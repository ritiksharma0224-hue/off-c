import { readTable, writeTable } from "./index";
import { AuditLog } from "./types";

const TABLE_NAME = "audit_logs";

/**
 * Record a new audit log
 */
export async function recordAuditLog(log: {
  admin: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: string;
}): Promise<void> {
  try {
    const logs = await readTable<AuditLog>(TABLE_NAME, []);
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...log,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep max 500 audit logs
    if (logs.length > 500) {
      logs.length = 500;
    }
    await writeTable(TABLE_NAME, logs);
  } catch {
    // Audit log write failure shouldn't crash operations
  }
}

/**
 * Fetch all audit logs
 */
export async function getDbAuditLogs(): Promise<AuditLog[]> {
  return await readTable<AuditLog>(TABLE_NAME, []);
}
