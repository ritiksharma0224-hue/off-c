import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { addDbMedia } from "@/lib/db/media";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

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

    // Verify file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPG, PNG, WEBP, and SVG are supported." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Generate safe filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    const filename = `kpd-${Date.now()}-${baseName}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Write file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Register media in database
    const asset = await addDbMedia(
      {
        filename,
        url: publicUrl,
        sizeBytes: file.size,
        mimeType: file.type,
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
