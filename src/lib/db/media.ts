import { readTable, writeTable } from "./index";
import { MediaAsset } from "./types";
import { getDbProducts } from "./products";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "media";

const INITIAL_MEDIA_SEED: MediaAsset[] = [
  {
    id: "med-01",
    filename: "hero.png",
    url: "/images/hero.png",
    sizeBytes: 1024000,
    mimeType: "image/png",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-02",
    filename: "vintage-wash.jpg",
    url: "/images/vintage-wash.jpg",
    sizeBytes: 840000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-03",
    filename: "slate-boxy.jpg",
    url: "/images/slate-boxy.jpg",
    sizeBytes: 780000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-04",
    filename: "retro-boxy.jpg",
    url: "/images/retro-boxy.jpg",
    sizeBytes: 810000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-05",
    filename: "cyber-tee.jpg",
    url: "/images/cyber-tee.jpg",
    sizeBytes: 920000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-06",
    filename: "puff-tee.jpg",
    url: "/images/puff-tee.jpg",
    sizeBytes: 790000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-07",
    filename: "chrome-tee.jpg",
    url: "/images/chrome-tee.jpg",
    sizeBytes: 860000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-08",
    filename: "cropped-shirt.jpg",
    url: "/images/cropped-shirt.jpg",
    sizeBytes: 910000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
  {
    id: "med-09",
    filename: "cargos.jpg",
    url: "/images/cargos.jpg",
    sizeBytes: 950000,
    mimeType: "image/jpeg",
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  },
];

/**
 * Fetch all media assets with dynamically resolved "usedBy" product references
 */
export async function getDbMedia(): Promise<MediaAsset[]> {
  const mediaList = await readTable<MediaAsset>(TABLE_NAME, INITIAL_MEDIA_SEED);
  const products = await getDbProducts(true);

  return mediaList.map((asset) => {
    const usedBy: MediaAsset["usedBy"] = [];

    for (const p of products) {
      const hasImage =
        p.image === asset.url ||
        p.images.includes(asset.url) ||
        p.imageSlots.some((s) => s.url === asset.url);

      if (hasImage) {
        usedBy.push({
          type: "product",
          id: p.id,
          name: p.name,
        });
      }
    }

    return {
      ...asset,
      usedBy,
    };
  });
}

/**
 * Add a new media asset record
 */
export async function addDbMedia(
  asset: Omit<MediaAsset, "id" | "usedBy" | "uploadedAt">,
  admin = "System Admin"
): Promise<MediaAsset> {
  const mediaList = await readTable<MediaAsset>(TABLE_NAME, INITIAL_MEDIA_SEED);
  const id = `med-${Date.now()}`;

  const newAsset: MediaAsset = {
    ...asset,
    id,
    usedBy: [],
    uploadedAt: new Date().toISOString(),
  };

  mediaList.unshift(newAsset);
  await writeTable(TABLE_NAME, mediaList);

  await recordAuditLog({
    admin,
    action: "MEDIA_UPLOADED",
    targetType: "MEDIA",
    targetId: id,
    targetName: asset.filename,
    details: `Uploaded asset ${asset.filename} (${asset.url})`,
  });

  return newAsset;
}

/**
 * Delete a media asset record
 */
export async function deleteDbMedia(
  id: string,
  force = false,
  admin = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const mediaList = await getDbMedia();
  const target = mediaList.find((m) => m.id === id);
  if (!target) {
    return { success: false, error: "Media asset not found" };
  }

  if (target.usedBy.length > 0 && !force) {
    return {
      success: false,
      error: `Asset is actively in use by ${target.usedBy.length} product(s): ${target.usedBy.map((u) => u.name).join(", ")}. Cannot delete without confirmation.`,
    };
  }

  const remaining = mediaList.filter((m) => m.id !== id);
  await writeTable(TABLE_NAME, remaining);

  await recordAuditLog({
    admin,
    action: "MEDIA_DELETED",
    targetType: "MEDIA",
    targetId: id,
    targetName: target.filename,
    details: `Deleted asset ${target.filename}`,
  });

  return { success: true };
}
