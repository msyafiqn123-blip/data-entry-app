"use client";

import { useState } from "react";
import { Save, Loader2, Lock, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.error || "Gagal mengubah password");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-1">Kelola keamanan dan password akun Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
          <User className="w-5 h-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-bold text-slate-700">Tentang Saya</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
              <p className="text-slate-600 bg-slate-50 px-4 py-2 rounded border border-slate-200">{session?.user?.username || "-"}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Role / Peran</label>
              <p className="text-slate-600 bg-slate-50 px-4 py-2 rounded border border-slate-200 capitalize">{session?.user?.role?.toLowerCase() || "-"}</p>
            </div>
            {(session?.user as any)?.namaKecamatan && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Wilayah Tugas</label>
                <p className="text-slate-600 bg-slate-50 px-4 py-2 rounded border border-slate-200">
                  Kec. {(session?.user as any)?.namaKecamatan}{(session?.user as any)?.namaKelurahan ? `, Kel. ${(session?.user as any)?.namaKelurahan}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
          <Lock className="w-5 h-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-bold text-slate-700">Ganti Password</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username Saat Ini</label>
              <input 
                type="text" 
                disabled 
                value={session?.user?.username || ""} 
                className="w-full px-4 py-2 border border-slate-300 rounded bg-slate-100 text-slate-500 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password Lama <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                required 
                value={oldPassword} 
                onChange={e => setOldPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password Baru <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                required 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Konfirmasi Password Baru <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" 
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-[#00557e] hover:bg-[#004466] text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                SIMPAN PASSWORD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
