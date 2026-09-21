import { readSettings, writeSettings, getInitialSettingsSeed } from "./index";
import { StoreSettings } from "./types";
import { recordAuditLog } from "./audit";

/**
 * Fetch current store settings
 */
export async function getDbSettings(): Promise<StoreSettings> {
  return await readSettings(getInitialSettingsSeed());
}

/**
 * Update store settings
 */
export async function updateDbSettings(
  updates: Partial<StoreSettings>,
  admin = "System Admin"
): Promise<StoreSettings> {
  const current = await getDbSettings();
  const updated: StoreSettings = {
    ...current,
    ...updates,
  };

  await writeSettings(updated);

  await recordAuditLog({
    admin,
    action: "SETTINGS_UPDATED",
    targetType: "SETTINGS",
    targetId: "global-settings",
    targetName: "Store Settings",
    details: `Updated settings: ${Object.keys(updates).join(", ")}`,
  });

  return updated;
}
