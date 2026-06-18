"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import * as xlsx from "xlsx";
import { useSession } from "next-auth/react";

export default function AdminSpopPage() {
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
      const res = await fetch("/api/admin/spop");
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error("API returned non-array:", json);
        setData([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [jenisTransaksiFilter, setJenisTransaksiFilter] = useState("all");

  const filteredData = (Array.isArray(data) ? data : []).filter((item) => {
    if (statusFilter === "verified" && item.status !== "TERVERIFIKASI") return false;
    if (statusFilter === "unverified" && item.status !== "MENUNGGU") return false;
    if (statusFilter === "revision" && item.status !== "PERLU_PERBAIKAN") return false;
    if (jenisTransaksiFilter !== "all" && item.jenisTransaksi !== jenisTransaksiFilter) return false;

    if (!item.nop) return true;
    const parts = item.nop.split('.');
    if (parts.length >= 4) {
      if (selectedKecamatan && parts[2] !== selectedKecamatan) return false;
      if (selectedKelurahan && parts[3] !== selectedKelurahan) return false;
    }
    return true;
  });

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      "No Formulir": item.noFormulir,
      "Jenis Transaksi": item.jenisTransaksi,
      "NOP": item.nop,
      "No KTP": item.noKtp || "",
      "Nama WP": item.namaWp,
      "NPWP": item.npwp || "",
      "Status WP": item.statusWp || "",
      "Pekerjaan": item.pekerjaan || "",
      "Kelurahan WP": item.kelurahanWp || "",
      "Jalan WP": item.jalanWp || "",
      "Blok/Kav/No WP": item.blokKavNoWp || "",
      "RT/RW WP": item.rtRwWp || "",
      "Telepon": item.telepon || "",
      "No HP": item.noHp || "",
      "Dati 2": item.dati2 || "",
      "Kode Pos": item.kodePosWp || "",
      "No Persil": item.noPersil || "",
      "Blok/Kav/No OP": item.blokKavNoOp || "",
      "RT/RW OP": item.rtRwOp || "",
      "Jalan OP": item.jalanOp,
      "Status Cabang": item.statusCabang || "",
      "Luas Bumi (m2)": item.luasBumi,
      "Kode ZNT": item.kodeZnt || "",
      "Jenis Bumi": item.jenisBumi || "",
      "Jenis Tanah": item.jenisTanah || "",
      "Jenis Surat": item.jenisSurat || "",
      "Keterangan Bumi": item.keteranganBumi || "",
      "Keterangan BPHTB": item.keteranganBphtb || "",
      "Petugas Input": item.user?.username || item.nipPendata || "",
      "Tanggal Masuk": new Date(item.createdAt).toLocaleString("id-ID"),
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data SPOP");
    
    xlsx.writeFile(workbook, "Data_SPOP_Export.xlsx");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data SPOP ini? Semua LSPOP yang terkait juga akan terhapus.")) return;
    try {
      const res = await fetch(`/api/spop/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
      else alert("Gagal menghapus data");
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/spop/${id}/verify`, {
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
          <h1 className="text-2xl font-bold text-slate-800">Data Masuk SPOP</h1>
          <p className="text-slate-500 mt-1">Daftar semua SPOP yang telah diinput oleh petugas.</p>
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
            <option value="revision">Perlu Perbaikan</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Transaksi</label>
          <select 
            value={jenisTransaksiFilter} 
            onChange={(e) => setJenisTransaksiFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="all">Semua Transaksi</option>
            <option value="Perekaman Data Baru">Data Baru</option>
            <option value="Pemutakhiran Data">Pemutakhiran</option>
            <option value="Penghapusan Data">Penghapusan</option>
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
                <th className="p-4 font-bold">Nama WP</th>
                <th className="p-4 font-bold">Jalan OP</th>
                <th className="p-4 font-bold">Luas Bumi</th>
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
                  <td className="p-4 font-medium text-slate-800">{item.nop}</td>
                  <td className="p-4 text-slate-600">{item.namaWp}</td>
                  <td className="p-4 text-slate-600">{item.jalanOp}</td>
                  <td className="p-4 text-slate-600">{item.luasBumi} m²</td>
                  <td className="p-4 text-slate-600">{item.user?.username || item.nipPendata}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    {item.isVerified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-700 w-max">
                        Terverifikasi
                      </span>
                    ) : item.status === "PERLU_PERBAIKAN" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 w-max" title={item.catatanVerifikasi || "Perlu Perbaikan"}>
                        Perlu Perbaikan
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 w-max">
                        Menunggu
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {item.isVerified ? (item.verifiedBy || "-") : "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <a href={`/dashboard/admin/spop/${item.id}`} className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 transition-colors">
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
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada data SPOP masuk.
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
