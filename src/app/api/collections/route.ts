import { NextRequest, NextResponse } from "next/server";
import {
  getDbCollections,
  createDbCollection,
  updateDbCollection,
} from "@/lib/db/collections";
import { validateAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collections = await getDbCollections();
    return NextResponse.json({ success: true, collections });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Name and slug are required" }, { status: 400 });
    }

    const created = await createDbCollection(body, auth.email || "Admin");
    return NextResponse.json({ success: true, collection: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = validateAdminRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Collection id is required" }, { status: 400 });
    }

    const updated = await updateDbCollection(id, updates, auth.email || "Admin");
    if (!updated) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
