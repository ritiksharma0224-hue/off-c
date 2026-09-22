import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { addDbMedia } from "@/lib/db/media";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

// Strict MIME to extension mapping - only raster bitmaps, SVG removed to prevent Stored XSS
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Validate buffer magic bytes to ensure file content matches MIME type
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/jpeg") {
    // JPEG magic bytes: FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (mimeType === "image/webp") {
    // WebP: RIFF at [0..3] and WEBP at [8..11]
    const riff = buffer.toString("ascii", 0, 4);
    const webp = buffer.toString("ascii", 8, 12);
    return riff === "RIFF" && webp === "WEBP";
  }

  return false;
}

/**
 * POST /api/media/upload
 * Protected admin endpoint to upload an image file
 */
export async function POST(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // 1. Enforce size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ success: false, error: "Empty file cannot be uploaded" }, { status: 400 });
    }

    // 2. Strict MIME type validation
    const mime = file.type.toLowerCase();
    const ext = ALLOWED_MIME_TYPES[mime];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPG, PNG, and WEBP images are supported (SVG is disabled for security)." },
        { status: 400 }
      );
    }

    // 3. Read buffer and validate magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!validateMagicBytes(buffer, mime)) {
      return NextResponse.json(
        { success: false, error: "File content signature does not match the declared image type." },
        { status: 400 }
      );
    }

    // 4. Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // 5. Generate sanitized filename with server-derived extension (ignoring client extension)
    const rawBase = path.basename(file.name, path.extname(file.name));
    const safeBase = rawBase.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 30) || "upload";
    const filename = `kpd-${Date.now()}-${safeBase}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Path traversal check
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(UPLOADS_DIR))) {
      return NextResponse.json({ success: false, error: "Invalid path destination." }, { status: 400 });
    }

    // Write file to public/uploads
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Register media in database
    const asset = await addDbMedia(
      {
        filename,
        url: publicUrl,
        sizeBytes: file.size,
        mimeType: mime,
      },
      auth.email || "Admin"
    );

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        asset,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
