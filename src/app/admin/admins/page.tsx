"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Key,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Crown,
  Sparkles,
  Package,
  Layers,
  Lock,
} from "lucide-react";
import { AdminRole, AdminUserPublic } from "@/lib/db/admins";

interface CurrentAdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

const ROLE_INFO: Record<
  AdminRole,
  {
    title: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    icon: React.ElementType;
    powers: string[];
  }
> = {
  SUPER_ADMIN: {
    title: "Super Admin",
    description: "Unlimited master authority across all systems.",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    icon: Crown,
    powers: [
      "Create, edit & delete admin accounts",
      "Store settings & payment gateway control",
      "Full product & pricing management",
      "Inventory & stock allocations",
      "Customer orders & pre-orders",
      "Audit trail logs inspection",
    ],
  },
  STORE_MANAGER: {
    title: "Store Manager",
    description: "Operations, products, stock & customer order fulfillment.",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/30",
    icon: Sparkles,
    powers: [
      "Manage products, pricing & specs",
      "Manage categories, families & drops",
      "Adjust inventory & stock levels",
      "Process customer orders & preorders",
      "Media asset library management",
      "View sales & demand analytics",
    ],
  },
  ORDER_OPERATOR: {
    title: "Order Operator",
    description: "Order fulfillment, packing, customer shipping & stock monitoring.",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-400",
    badgeBorder: "border-blue-500/30",
    icon: Package,
    powers: [
      "View & update order fulfillment status",
      "Process reservations & preorders",
      "View customer profiles & addresses",
      "Track inventory movements",
    ],
  },
  CATALOG_EDITOR: {
    title: "Catalog Editor",
    description: "Product visual styling, copywriting & media curation.",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    icon: Layers,
    powers: [
      "Create & edit product descriptions",
      "Upload lookbook & gallery photos",
      "Manage categories & collection drops",
      "Curate garment design families",
    ],
  },
};

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUserPublic[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminUserPublic | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserPublic | null>(null);

  // Form states - Add Admin
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("STORE_MANAGER");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form states - Edit Admin
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("STORE_MANAGER");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      // 1. Fetch current logged in user
      const meRes = await fetch("/api/admin/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // 2. Fetch all admins
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        setErrorNotice(data.error || "Failed to load admin accounts");
      }
    } catch {
      setErrorNotice("Error communicating with administration service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword) {
      setErrorNotice("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorNotice("Password must be at least 6 characters.");
      return;
    }

    setFormSubmitting(true);
    setErrorNotice(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
          password: newPassword,
          role: newRole,
          status: "ACTIVE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotice(`Created administrator ${data.admin.name}`);
        setTimeout(() => setNotice(null), 3000);
        setIsAddModalOpen(false);
        // Reset form
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewConfirmPassword("");
        setNewRole("STORE_MANAGER");
        fetchAdmins();
      } else {
        setErrorNotice(data.error || "Failed to create administrator");
      }
    } catch {
      setErrorNotice("Network error while creating administrator.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenEdit = (admin: AdminUserPublic) => {
    setEditAdmin(admin);
    setEditName(admin.name);
    setEditEmail(admin.email);
    setEditRole(admin.role);
    setEditStatus(admin.status);
    setEditPassword("");
    setEditConfirmPassword("");
    setErrorNotice(null);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;

    if (editPassword && editPassword !== editConfirmPassword) {
      setErrorNotice("New passwords do not match.");
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setErrorNotice("New password must be at least 6 characters.");
      return;
    }

    setFormSubmitting(true);
    setErrorNotice(null);

    try {
      const payload: {
        id: string;
        name: string;
        email: string;
        role: AdminRole;
        status: "ACTIVE" | "INACTIVE";
        password?: string;
      } = {
        id: editAdmin.id,
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        role: editRole,
        status: editStatus,
      };

      if (editPassword) {
        payload.password = editPassword;
      }

      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setNotice(`Updated administrator ${data.admin.name}`);
        setTimeout(() => setNotice(null), 3000);
        setEditAdmin(null);
        fetchAdmins();
      } else {
        setErrorNotice(data.error || "Failed to update administrator");
      }
    } catch {
      setErrorNotice("Network error while updating administrator.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!deleteTarget) return;

    setFormSubmitting(true);
    setErrorNotice(null);

    try {
      const res = await fetch(`/api/admin/users?id=${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setNotice(`Deleted admin user "${deleteTarget.name}"`);
        setTimeout(() => setNotice(null), 3000);
        setDeleteTarget(null);
        fetchAdmins();
      } else {
        setErrorNotice(data.error || "Failed to delete administrator");
      }
    } catch {
      setErrorNotice("Network error while deleting administrator.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262B36]">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#FF3B00]" />
            <h1 className="text-xl font-bold uppercase tracking-tight text-white">
              ADMIN ACCOUNTS & ROLES
            </h1>
          </div>
          <p className="text-xs text-[#7B828F] mt-1 font-mono">
            Manage administrative identities, set passwords, and allocate powers via Role-Based Access Control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            title="Refresh"
            className="p-2.5 bg-[#14171F] border border-[#262B36] rounded text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
          >
            <UserPlus className="h-4 w-4" />
            <span>ADD NEW ADMIN</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Role Power Level Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(ROLE_INFO) as AdminRole[]).map((roleKey) => {
          const info = ROLE_INFO[roleKey];
          const Icon = info.icon;
          const count = admins.filter((a) => a.role === roleKey).length;

          return (
            <div
              key={roleKey}
              className="bg-[#14171F] border border-[#262B36] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${info.badgeBg} ${info.badgeText} border ${info.badgeBorder}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7B828F] px-2 py-0.5 bg-[#0E1015] rounded border border-[#262B36]">
                  {count} {count === 1 ? "USER" : "USERS"}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">{info.title}</h3>
                <p className="text-[11px] text-[#7B828F] mt-0.5 line-clamp-2">
                  {info.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#262B36]/60">
                <span className="text-[9px] font-mono uppercase text-[#9AA0A6] font-bold block mb-1">
                  Core Permissions:
                </span>
                <ul className="text-[10px] text-[#A6ABB4] space-y-1 font-mono">
                  {info.powers.slice(0, 3).map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-[#FF3B00]">›</span>
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Users Table */}
      <div className="bg-[#14171F] border border-[#262B36] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-white uppercase tracking-wide">
              ADMINISTRATOR DIRECTORY
            </h2>
            <span className="text-xs text-[#7B828F] font-mono">
              ({admins.length} registered)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0E1015] text-[#7B828F] uppercase text-[10px] border-b border-[#262B36]">
              <tr>
                <th className="py-3 px-4">Admin Name & ID</th>
                <th className="py-3 px-4">Role & Power Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262B36] text-[#E4E6EB]">
              {loading && admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7B828F]">
                    Loading admin directory...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7B828F]">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const roleMeta = ROLE_INFO[admin.role] || ROLE_INFO.STORE_MANAGER;
                  const RoleIcon = roleMeta.icon;
                  const isCurrent = currentUser?.id === admin.id;

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-[#1A1E27]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#262B36] flex items-center justify-center text-white font-bold text-xs uppercase">
                            {admin.name.charAt(0) || "A"}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{admin.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/30 rounded uppercase">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#7B828F] font-mono mt-0.5">
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border ${roleMeta.badgeBg} ${roleMeta.badgeText} ${roleMeta.badgeBorder}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          <span>{roleMeta.title}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {admin.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            DEACTIVATED
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#7B828F] text-[11px]">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Never logged in"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(admin)}
                            className="p-1.5 bg-[#0E1015] border border-[#262B36] rounded hover:border-[#FF3B00] text-[#9AA0A6] hover:text-white transition-colors cursor-pointer"
                            title="Edit User & Password"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(admin)}
                            disabled={isCurrent}
                            className="p-1.5 bg-[#0E1015] border border-[#262B36] rounded hover:border-red-500 text-[#9AA0A6] hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isCurrent ? "Cannot delete yourself" : "Delete Admin Account"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#14171F] border border-[#262B36] rounded-xl shadow-2xl p-6 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#FF3B00]" />
                <h3 className="font-bold text-white uppercase text-base">
                  CREATE NEW ADMINISTRATOR
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#7B828F] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mansvi Choudhary"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                  ADMIN EMAIL / LOGIN ID *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ops@kapdology.store"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    PASSWORD *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-[#7B828F] hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    CONFIRM PASSWORD *
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-2">
                  ASSIGN ROLE & POWER LEVEL
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(ROLE_INFO) as AdminRole[]).map((roleKey) => {
                    const info = ROLE_INFO[roleKey];
                    const isSelected = newRole === roleKey;
                    const Icon = info.icon;

                    return (
                      <button
                        type="button"
                        key={roleKey}
                        onClick={() => setNewRole(roleKey)}
                        className={`p-2.5 rounded border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1E232E] border-[#FF3B00] text-white"
                            : "bg-[#0E1015] border-[#262B36] text-[#7B828F] hover:border-[#3D4454]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#FF3B00] text-white" : "bg-[#262B36] text-[#7B828F]"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div>
                          <div className={`font-bold text-xs ${isSelected ? "text-white" : "text-[#E4E6EB]"}`}>
                            {info.title}
                          </div>
                          <div className="text-[10px] text-[#7B828F] leading-tight mt-0.5 line-clamp-1">
                            {info.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#262B36] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#0E1015] border border-[#262B36] text-[#9AA0A6] hover:text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ADMIN / RESET PASSWORD */}
      {editAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#14171F] border border-[#262B36] rounded-xl shadow-2xl p-6 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#262B36]">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-[#FF3B00]" />
                <h3 className="font-bold text-white uppercase text-base">
                  EDIT ADMIN & RESET PASSWORD
                </h3>
              </div>
              <button
                onClick={() => setEditAdmin(null)}
                className="text-[#7B828F] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    EMAIL / LOGIN ID
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00] font-mono"
                  />
                </div>
              </div>

              {/* Status and Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    ROLE
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00]"
                  >
                    <option value="SUPER_ADMIN">👑 Super Admin (Full Control)</option>
                    <option value="STORE_MANAGER">⚡ Store Manager</option>
                    <option value="ORDER_OPERATOR">📦 Order Operator</option>
                    <option value="CATALOG_EDITOR">🎨 Catalog Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                    ACCOUNT STATUS
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full px-3 py-2 bg-[#0E1015] border border-[#262B36] rounded text-sm text-white focus:outline-none focus:border-[#FF3B00]"
                  >
                    <option value="ACTIVE">🟢 Active (Access Allowed)</option>
                    <option value="INACTIVE">🔴 Deactivated (Access Blocked)</option>
                  </select>
                </div>
              </div>

              {/* Password Reset Section */}
              <div className="p-3.5 bg-[#0E1015] border border-[#262B36] rounded-lg space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Lock className="h-3.5 w-3.5 text-[#FF3B00]" />
                  <span>RESET PASSWORD (OPTIONAL)</span>
                </div>
                <p className="text-[10px] text-[#7B828F]">
                  Leave blank to preserve current password. Enter a new password below to reset.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                      NEW PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        placeholder="Leave blank to keep"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00] font-mono pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        className="absolute right-2 top-2 text-[#7B828F] hover:text-white"
                      >
                        {showEditPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[#9AA0A6] mb-1">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type={showEditPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={editConfirmPassword}
                      onChange={(e) => setEditConfirmPassword(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#14171F] border border-[#262B36] rounded text-xs text-white focus:outline-none focus:border-[#FF3B00] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#262B36] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditAdmin(null)}
                  className="px-4 py-2 bg-[#0E1015] border border-[#262B36] text-[#9AA0A6] hover:text-white text-xs font-bold uppercase rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-[#FF3B00] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e03400] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#14171F] border border-red-500/30 rounded-xl shadow-2xl p-6 relative space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white uppercase">
                DELETE ADMINISTRATOR
              </h3>
              <p className="text-xs text-[#9AA0A6] mt-1">
                Are you sure you want to permanently delete administrator{" "}
                <strong className="text-white">{deleteTarget.name}</strong> (
                {deleteTarget.email})?
              </p>
              <p className="text-[11px] text-red-400 mt-2 font-mono">
                This action cannot be undone. They will immediately lose access to the admin cockpit.
              </p>
            </div>

            <div className="pt-3 border-t border-[#262B36] flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-[#0E1015] border border-[#262B36] text-[#9AA0A6] hover:text-white text-xs font-bold uppercase rounded cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteAdmin}
                disabled={formSubmitting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer disabled:opacity-50"
              >
                {formSubmitting ? "DELETING..." : "CONFIRM DELETE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
