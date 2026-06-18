"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import * as xlsx from "xlsx";
import { useSession } from "next-auth/react";

export default function AdminLspopPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [wilayahList, setWilayahList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");

  useEffect(() => {
    fetchData();
    fetchWilayah();
  }, []);

  const fetchWilayah = async () => {
    try {
      const res = await fetch("/api/wilayah");
      const json = await res.json();
      setWilayahList(json);
      
      const uniqueKecamatan = Array.from(new Set(json.map((w: any) => JSON.stringify({ kode: w.kodeKecamatan, nama: w.namaKecamatan })))).map((str: any) => JSON.parse(str));
      setKecamatanList(uniqueKecamatan);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/lspop");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = data.filter((item) => {
    if (statusFilter === "verified" && !item.isVerified) return false;
    if (statusFilter === "unverified" && item.isVerified) return false;

    const nop = item.nop || item.spop?.nop || "";
    if (!nop) return true;
    const parts = nop.split('.');
    if (parts.length >= 4) {
      if (selectedKecamatan && parts[2] !== selectedKecamatan) return false;
      if (selectedKelurahan && parts[3] !== selectedKelurahan) return false;
    }
    return true;
  });

  const handleExport = () => {
    // Format data for excel: satu baris satu NOP
    const excelData = filteredData.map(item => ({
      "NOP": item.nop || item.spop?.nop || "-",
      "No Bangunan": item.noBangunan,
      "Jenis Bangunan": item.jenisBangunan,
      "Luas Bangunan (m2)": item.luasBangunan,
      "Jumlah Lantai": item.jumlahLantai,
      "Tahun Dibangun": item.tahunDibangun,
      "Kondisi Bangunan": item.kondisiBangunan,
      "Konstruksi": item.konstruksi,
      "Atap": item.atap,
      "Dinding": item.dinding,
      "Lantai": item.lantai,
      "Langit-langit": item.langitLangit,
      "Nama WP": item.spop?.namaWp || "-",
      "Jalan OP": item.spop?.jalanOp || "-",
      "Pendata": item.user?.username || "-",
      "Kecamatan Pendata": item.user?.namaKecamatan || "-",
      "Kelurahan Pendata": item.user?.namaKelurahan || "-",
      "Tanggal Input": new Date(item.createdAt).toLocaleString("id-ID")
    }));

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data LSPOP");
    xlsx.writeFile(workbook, "Data_LSPOP_Export.xlsx");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data LSPOP ini?")) return;
    try {
      const res = await fetch(`/api/lspop/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("Gagal menghapus data");
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/lspop/${id}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Gagal memperbarui status verifikasi");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00557e]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Masuk LSPOP</h1>
          <p className="text-slate-500 mt-1">Daftar semua LSPOP yang telah diinput oleh petugas.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-xl shadow-sm hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Status Verifikasi</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="all">Semua Data</option>
            <option value="verified">Terverifikasi</option>
            <option value="unverified">Menunggu Verifikasi</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter Kecamatan</label>
          <select 
            value={selectedKecamatan} 
            onChange={(e) => {
              setSelectedKecamatan(e.target.value);
              setSelectedKelurahan("");
            }}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanList.map(kec => (
              <option key={kec.kode} value={kec.kode}>{kec.nama}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter Kelurahan</label>
          <select 
            value={selectedKelurahan} 
            onChange={(e) => setSelectedKelurahan(e.target.value)}
            disabled={!selectedKecamatan}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">Semua Kelurahan</option>
            {wilayahList.filter(w => w.kodeKecamatan === selectedKecamatan).map(w => (
              <option key={w.id} value={w.kodeKelurahan}>{w.namaKelurahan}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 font-bold">NOP</th>
                <th className="p-4 font-bold">No Bgn</th>
                <th className="p-4 font-bold">Jenis Bangunan</th>
                <th className="p-4 font-bold">Luas Bangunan</th>
                <th className="p-4 font-bold">Kondisi</th>
                <th className="p-4 font-bold">Petugas Input</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Petugas Verifikator</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{item.nop || item.spop?.nop}</td>
                  <td className="p-4 text-slate-600">Ke-{item.noBangunan}</td>
                  <td className="p-4 text-slate-600">{item.jenisBangunan}</td>
                  <td className="p-4 text-slate-600">{item.luasBangunan} m²</td>
                  <td className="p-4 text-slate-600">{item.kondisiBangunan}</td>
                  <td className="p-4 text-slate-600">{item.user?.username || "-"}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    {item.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-700 w-max">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 w-max">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {item.isVerified ? (item.verifiedBy || "-") : "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a href={`/dashboard/admin/lspop/${item.id}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 transition-colors">
                      Detail
                    </a>
                    {session?.user?.role === "ADMIN" && (
                      <button onClick={() => handleDelete(item.id)} className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200 transition-colors">
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    Belum ada data LSPOP masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
