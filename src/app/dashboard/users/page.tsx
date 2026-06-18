"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, User as UserIcon, Loader2, Key, X, Download } from "lucide-react";
import * as XLSX from "xlsx";

type User = {
  id: string;
  username: string;
  role: string;
  namaKecamatan?: string;
  namaKelurahan?: string;
};

type Wilayah = {
  id: string;
  kodeKecamatan: string;
  namaKecamatan: string;
  kodeKelurahan: string;
  namaKelurahan: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("PENDATA");
  
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState("");
  
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchWilayah();
  }, []);

  const fetchWilayah = async () => {
    try {
      const res = await fetch("/api/wilayah");
      const data: Wilayah[] = await res.json();
      setWilayahList(data);
      
      const uniqueKecamatan = Array.from(new Set(data.map(w => w.namaKecamatan)));
      setKecamatanList(uniqueKecamatan);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (users.length === 0) return;
    
    const data = users.map(u => ({
      "Username": u.username,
      "Role": u.role,
      "Kecamatan": u.namaKecamatan || "-",
      "Kelurahan": u.namaKelurahan || "-"
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Pengguna");
    
    XLSX.writeFile(workbook, `Data_Pengguna_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      let wilayahData = {};
      if (selectedWilayah) {
        const w = wilayahList.find(w => w.id === selectedWilayah);
        if (w) {
          wilayahData = {
            kodeKecamatan: w.kodeKecamatan,
            namaKecamatan: w.namaKecamatan,
            kodeKelurahan: w.kodeKelurahan,
            namaKelurahan: w.namaKelurahan
          };
        }
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: newUsername, 
          password: newPassword, 
          role: newRole,
          ...wilayahData
        }),
      });
      if (res.ok) {
        setNewUsername("");
        setNewPassword("");
        setSelectedWilayah("");
        fetchUsers();
      } else {
        alert("Gagal membuat user");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus user ini?")) return;
    try {
      await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserId || !resetPassword) return;
    
    setResetting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resettingUserId, password: resetPassword }),
      });
      if (res.ok) {
        alert("Password berhasil diubah!");
        setResettingUserId(null);
        setResetPassword("");
      } else {
        alert("Gagal mengubah password");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--card-border)] flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Akun</h1>
          <p className="text-[var(--text-muted)] mt-1">Buat akun untuk Pendata atau tambah Admin baru.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--card-border)] lg:col-span-1 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-[var(--primary)]" /> Buat Akun Baru
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username</label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-muted)]"
                placeholder="misal: budi_input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all outline-none placeholder:text-[var(--text-muted)]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Peran (Role)</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all outline-none"
              >
                <option value="PENDATA">Pendata</option>
                <option value="VERIFIKATOR">Verifikator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {newRole === "PENDATA" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Kecamatan</label>
                  <select
                    value={selectedKecamatan}
                    onChange={(e) => {
                      setSelectedKecamatan(e.target.value);
                      setSelectedWilayah(""); // Reset kelurahan when kecamatan changes
                    }}
                    className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Pilih Kecamatan...</option>
                    {kecamatanList.map(kec => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Kelurahan</label>
                  <select
                    value={selectedWilayah}
                    onChange={(e) => setSelectedWilayah(e.target.value)}
                    disabled={!selectedKecamatan}
                    className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all outline-none disabled:opacity-50"
                  >
                    <option value="">Pilih Kelurahan...</option>
                    {wilayahList
                      .filter(w => w.namaKecamatan === selectedKecamatan)
                      .map(w => (
                      <option key={w.id} value={w.id}>
                        {w.namaKelurahan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] hover:shadow-[0_4px_14px_#3b82f666] text-white font-medium rounded-xl transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Akun"}
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="bg-[var(--card-bg)] p-0 rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--card-border)] lg:col-span-2 overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Daftar Pengguna</h2>
            <button
              onClick={exportToExcel}
              className="flex items-center space-x-2 px-3 py-1.5 bg-[var(--section-bg)] hover:bg-[var(--border)] text-[var(--text-primary)] text-sm font-medium rounded-lg transition-colors border border-[var(--border)]"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="p-4 font-bold">Username</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Wilayah</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[rgba(59,130,246,0.05)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ${u.role === "ADMIN" ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"}`}>
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[var(--text-primary)]">{u.username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        u.role === "ADMIN" ? "bg-[rgba(168,85,247,0.1)] text-[#c084fc] border-[rgba(168,85,247,0.2)]" : u.role === "VERIFIKATOR" ? "bg-[rgba(59,130,246,0.1)] text-[#93c5fd] border-[rgba(59,130,246,0.2)]" : "bg-[rgba(156,163,175,0.1)] text-[var(--text-secondary)] border-[rgba(156,163,175,0.2)]"
                      }`}>
                        {u.role === "ADMIN" ? <Shield className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      {u.namaKelurahan ? `${u.namaKecamatan} - ${u.namaKelurahan}` : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <button
                          onClick={() => setResettingUserId(u.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[rgba(59,130,246,0.1)] rounded-lg transition-colors"
                          title="Ganti Password"
                        >
                          <Key className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">
                      Belum ada pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resettingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-[var(--modal-bg)] border border-[var(--card-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] w-full max-w-md p-6 relative">
            <button 
              onClick={() => {
                setResettingUserId(null);
                setResetPassword("");
              }}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ganti Password</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Masukkan password baru untuk pengguna ini.</p>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password Baru</label>
                <input
                  type="text"
                  required
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setResettingUserId(null);
                    setResetPassword("");
                  }}
                  className="px-4 py-2 text-[var(--text-secondary)] font-medium hover:bg-[var(--section-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--border)]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-70 flex items-center"
                >
                  {resetting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
