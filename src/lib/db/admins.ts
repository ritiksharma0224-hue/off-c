import crypto from "crypto";
import { readTable, writeTable } from "./index";
import { recordAuditLog } from "./audit";

const TABLE_NAME = "admins";

export type AdminRole = "SUPER_ADMIN" | "STORE_MANAGER" | "ORDER_OPERATOR" | "CATALOG_EDITOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: AdminRole;
  status: "ACTIVE" | "INACTIVE";
  lastLoginAt?: string;
  createdAt: string;
  createdBy: string;
}

export type AdminUserPublic = Omit<AdminUser, "passwordHash" | "salt">;

/**
 * Hash password with PBKDF2 and a random salt
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, generatedSalt, 1000, 64, "sha512")
    .toString("hex");
  return { hash, salt: generatedSalt };
}

/**
 * Verify plaintext password against stored hash and salt
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Generate Initial Super Admin Seed with hashed credentials
 */
function getInitialAdminSeed(): AdminUser[] {
  const initialEmail = (process.env.ADMIN_EMAIL || "admin@kapdology.store").toLowerCase().trim();
  const initialPassword = process.env.ADMIN_PASSWORD || "kapdology2026";
  const { hash, salt } = hashPassword(initialPassword);

  return [
    {
      id: "adm-01",
      name: "Master Super Admin",
      email: initialEmail,
      passwordHash: hash,
      salt,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: "System Bootstrap",
    },
  ];
}

/**
 * Fetch all admins (public view, hashes stripped)
 */
export async function getDbAdmins(): Promise<AdminUserPublic[]> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  return admins.map(({ passwordHash: _, salt: __, ...publicUser }) => publicUser);
}

/**
 * Fetch raw admin record including password hash (internal auth only)
 */
export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  const normalized = email.toLowerCase().trim();
  const match = admins.find((a) => a.email.toLowerCase().trim() === normalized);
  return match || null;
}

/**
 * Fetch raw admin record by ID
 */
export async function getAdminById(id: string): Promise<AdminUser | null> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  return admins.find((a) => a.id === id) || null;
}

/**
 * Create a new admin account
 */
export async function createDbAdmin(
  input: {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
    status?: "ACTIVE" | "INACTIVE";
  },
  createdBy = "System Admin"
): Promise<{ success: boolean; admin?: AdminUserPublic; error?: string }> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  const normalizedEmail = input.email.toLowerCase().trim();

  if (admins.some((a) => a.email.toLowerCase().trim() === normalizedEmail)) {
    return { success: false, error: "An admin with this email/ID already exists." };
  }

  if (input.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const { hash, salt } = hashPassword(input.password);
  const id = `adm-${Date.now()}`;

  const newAdmin: AdminUser = {
    id,
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    role: input.role,
    status: input.status || "ACTIVE",
    createdAt: new Date().toISOString(),
    createdBy,
  };

  admins.push(newAdmin);
  await writeTable(TABLE_NAME, admins);

  await recordAuditLog({
    admin: createdBy,
    action: "ADMIN_CREATED",
    targetType: "ADMIN_USER",
    targetId: id,
    targetName: newAdmin.name,
    details: `Created admin "${newAdmin.name}" (${newAdmin.email}) with role [${newAdmin.role}]`,
  });

  const { passwordHash: _, salt: __, ...publicUser } = newAdmin;
  return { success: true, admin: publicUser };
}

/**
 * Update an existing admin account (details, role, status, or password)
 */
export async function updateDbAdmin(
  id: string,
  updates: {
    name?: string;
    email?: string;
    password?: string;
    role?: AdminRole;
    status?: "ACTIVE" | "INACTIVE";
  },
  updatedBy = "System Admin"
): Promise<{ success: boolean; admin?: AdminUserPublic; error?: string }> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  const targetIndex = admins.findIndex((a) => a.id === id);

  if (targetIndex === -1) {
    return { success: false, error: "Admin user not found." };
  }

  const existing = admins[targetIndex];

  // Prevent deactivating the last active SUPER_ADMIN
  if (
    updates.status === "INACTIVE" &&
    existing.role === "SUPER_ADMIN"
  ) {
    const activeSuperAdmins = admins.filter(
      (a) => a.role === "SUPER_ADMIN" && a.status === "ACTIVE" && a.id !== id
    );
    if (activeSuperAdmins.length === 0) {
      return { success: false, error: "Cannot deactivate the only active Super Admin." };
    }
  }

  // Prevent demoting the last active SUPER_ADMIN
  if (
    updates.role &&
    updates.role !== "SUPER_ADMIN" &&
    existing.role === "SUPER_ADMIN"
  ) {
    const activeSuperAdmins = admins.filter(
      (a) => a.role === "SUPER_ADMIN" && a.status === "ACTIVE" && a.id !== id
    );
    if (activeSuperAdmins.length === 0) {
      return { success: false, error: "Cannot change role of the only active Super Admin." };
    }
  }

  // Check email uniqueness if changing email
  if (updates.email) {
    const normalizedEmail = updates.email.toLowerCase().trim();
    if (
      admins.some(
        (a) => a.id !== id && a.email.toLowerCase().trim() === normalizedEmail
      )
    ) {
      return { success: false, error: "Email already in use by another admin." };
    }
    existing.email = normalizedEmail;
  }

  if (updates.name) existing.name = updates.name.trim();
  if (updates.role) existing.role = updates.role;
  if (updates.status) existing.status = updates.status;

  if (updates.password) {
    if (updates.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }
    const { hash, salt } = hashPassword(updates.password);
    existing.passwordHash = hash;
    existing.salt = salt;
  }

  admins[targetIndex] = existing;
  await writeTable(TABLE_NAME, admins);

  await recordAuditLog({
    admin: updatedBy,
    action: "ADMIN_UPDATED",
    targetType: "ADMIN_USER",
    targetId: id,
    targetName: existing.name,
    details: `Updated admin "${existing.name}" (${existing.email})`,
  });

  const { passwordHash: _, salt: __, ...publicUser } = existing;
  return { success: true, admin: publicUser };
}

/**
 * Delete an admin account
 */
export async function deleteDbAdmin(
  id: string,
  deletedBy = "System Admin"
): Promise<{ success: boolean; error?: string }> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  const target = admins.find((a) => a.id === id);

  if (!target) {
    return { success: false, error: "Admin user not found." };
  }

  // Protect against deleting the last SUPER_ADMIN
  if (target.role === "SUPER_ADMIN") {
    const remainingSuperAdmins = admins.filter(
      (a) => a.role === "SUPER_ADMIN" && a.id !== id
    );
    if (remainingSuperAdmins.length === 0) {
      return { success: false, error: "Cannot delete the last remaining Super Admin." };
    }
  }

  const remaining = admins.filter((a) => a.id !== id);
  await writeTable(TABLE_NAME, remaining);

  await recordAuditLog({
    admin: deletedBy,
    action: "ADMIN_DELETED",
    targetType: "ADMIN_USER",
    targetId: id,
    targetName: target.name,
    details: `Deleted admin user "${target.name}" (${target.email})`,
  });

  return { success: true };
}

/**
 * Record last login timestamp
 */
export async function recordAdminLogin(id: string): Promise<void> {
  const admins = await readTable<AdminUser>(TABLE_NAME, getInitialAdminSeed());
  const target = admins.find((a) => a.id === id);
  if (target) {
    target.lastLoginAt = new Date().toISOString();
    await writeTable(TABLE_NAME, admins);
  }
}
