import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
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
    
    // Support both single file ("file") and multiple files ("file" or "files")
    const rawFiles = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ] as (File | FormDataEntryValue)[];

    const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const uploadedAssets = [];

    for (const file of files) {
      // 1. Enforce size limit
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)` },
          { status: 400 }
        );
      }

      // 2. Strict MIME type validation
      const mime = file.type.toLowerCase();
      const ext = ALLOWED_MIME_TYPES[mime];
      if (!ext) {
        return NextResponse.json(
          { success: false, error: `Invalid file type for "${file.name}". Only JPG, PNG, and WEBP images are supported.` },
          { status: 400 }
        );
      }

      // 3. Read buffer and validate magic bytes
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (!validateMagicBytes(buffer, mime)) {
        return NextResponse.json(
          { success: false, error: `File content signature for "${file.name}" does not match the declared image type.` },
          { status: 400 }
        );
      }

      // 4. Generate sanitized filename with server-derived extension
      const rawBase = path.basename(file.name, path.extname(file.name));
      const safeBase = rawBase.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 30) || "upload";
      const filename = `kpd-${Date.now()}-${Math.floor(100 + Math.random() * 900)}-${safeBase}${ext}`;

      let publicUrl: string;

      // Option A: If Vercel Blob storage is configured, upload directly to Vercel Blob CDN
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const blob = await put(`uploads/${filename}`, buffer, {
            access: "public",
            contentType: mime,
          });
          publicUrl = blob.url;
        } catch (blobErr) {
          console.error("Vercel Blob upload failed, falling back to base64:", blobErr);
          publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
        }
      } else {
        // Option B: Try writing to local disk (works in local dev), with fallback if on read-only serverless
        try {
          await fs.mkdir(UPLOADS_DIR, { recursive: true });
          const filePath = path.join(UPLOADS_DIR, filename);
          const resolvedPath = path.resolve(filePath);
          if (!resolvedPath.startsWith(path.resolve(UPLOADS_DIR))) {
            return NextResponse.json({ success: false, error: "Invalid path destination." }, { status: 400 });
          }
          await fs.writeFile(filePath, buffer);
          publicUrl = `/uploads/${filename}`;
        } catch (fsErr: any) {
          // If filesystem is read-only (e.g. Vercel serverless without BLOB_READ_WRITE_TOKEN)
          if (fsErr.code === "EROFS" || fsErr.message?.includes("read-only")) {
            publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
          } else {
            throw fsErr;
          }
        }
      }

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

      uploadedAssets.push(asset);
    }

    return NextResponse.json(
      {
        success: true,
        count: uploadedAssets.length,
        url: uploadedAssets[0]?.url,
        asset: uploadedAssets[0],
        urls: uploadedAssets.map((a) => a.url),
        assets: uploadedAssets,
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
