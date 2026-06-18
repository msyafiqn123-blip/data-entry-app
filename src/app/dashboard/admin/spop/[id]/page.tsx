"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, CheckCircle, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditSpopPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // NOP state
  const [nopProv, setNopProv] = useState("32");
  const [nopKab, setNopKab] = useState("16");
  const [nopKec, setNopKec] = useState("");
  const [nopKel, setNopKel] = useState("");
  const [nopBlok, setNopBlok] = useState("");
  const [nopUrut, setNopUrut] = useState("");
  const [nopJenis, setNopJenis] = useState("0");

  const [noFormulir, setNoFormulir] = useState("");
  const [jenisTransaksi, setJenisTransaksi] = useState("Perekaman Data Baru");
  const [nipPendata, setNipPendata] = useState("");

  // Data Subjek Pajak
  const [noKtp, setNoKtp] = useState("");
  const [kelurahanWp, setKelurahanWp] = useState("");
  const [namaWp, setNamaWp] = useState("");
  const [statusWp, setStatusWp] = useState("PEMILIK");
  const [npwp, setNpwp] = useState("");
  const [jalanWp, setJalanWp] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [telepon, setTelepon] = useState("");
  const [rtRwWp, setRtRwWp] = useState("");
  const [noHp, setNoHp] = useState("");
  const [dati2, setDati2] = useState("");
  const [blokKavNoWp, setBlokKavNoWp] = useState("");
  const [kodePosWp, setKodePosWp] = useState("");

  // Data Letak Objek Pajak
  const [noPersil, setNoPersil] = useState("");
  const [blokKavNoOp, setBlokKavNoOp] = useState("");
  const [rtRwOp, setRtRwOp] = useState("");
  const [jalanOp, setJalanOp] = useState("");
  const [statusCabang, setStatusCabang] = useState("Bukan Cabang (Ada NJOPTKP)");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Data Bumi
  const [luasBumi, setLuasBumi] = useState("");
  const [kodeZnt, setKodeZnt] = useState("");
  const [jenisBumi, setJenisBumi] = useState("TANAH + BANGUNAN");
  const [jenisTanah, setJenisTanah] = useState("TANAH + BANGUNAN");
  const [jenisSuratOption, setJenisSuratOption] = useState("PILIH");
  const [jenisSurat, setJenisSurat] = useState("");
  const [keteranganBumi, setKeteranganBumi] = useState("");
  const [keteranganBphtb, setKeteranganBphtb] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [statusData, setStatusData] = useState("MENUNGGU");
  const [catatanVerifikasi, setCatatanVerifikasi] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [tempNote, setTempNote] = useState("");

  useEffect(() => {
    fetch(`/api/spop/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const parts = data.nop.split(".");
          setNopProv(parts[0] || "32");
          setNopKab(parts[1] || "16");
          setNopKec(parts[2] || "");
          setNopKel(parts[3] || "");
          setNopBlok(parts[4] || "");
          setNopUrut(parts[5] || "");
          setNopJenis(parts[6] || "0");

          setNoFormulir(data.noFormulir || "");
          setJenisTransaksi(data.jenisTransaksi || "Perekaman Data Baru");
          setNipPendata(data.nipPendata || "");

          setNoKtp(data.noKtp || "");
          setKelurahanWp(data.kelurahanWp || "");
          setNamaWp(data.namaWp || "");
          setStatusWp(data.statusWp || "PEMILIK");
          setNpwp(data.npwp || "");
          setJalanWp(data.jalanWp || "");
          setPekerjaan(data.pekerjaan || "");
          setTelepon(data.telepon || "");
          setRtRwWp(data.rtRwWp || "");
          setNoHp(data.noHp || "");
          setDati2(data.dati2 || "");
          setBlokKavNoWp(data.blokKavNoWp || "");
          setKodePosWp(data.kodePosWp || "");

          setNoPersil(data.noPersil || "");
          setBlokKavNoOp(data.blokKavNoOp || "");
          setRtRwOp(data.rtRwOp || "");
          setJalanOp(data.jalanOp || "");
          setStatusCabang(data.statusCabang || "Bukan Cabang (Ada NJOPTKP)");

          setLuasBumi(data.luasBumi?.toString() || "");
          setKodeZnt(data.kodeZnt || "");
          setJenisBumi(data.jenisBumi || "TANAH + BANGUNAN");
          setJenisTanah(data.jenisTanah || "TANAH + BANGUNAN");
          
          setLatitude(data.latitude || "");
          setLongitude(data.longitude || "");
          
          if (data.jenisSurat && data.jenisSurat.includes(" - ")) {
            const [opt, ...rest] = data.jenisSurat.split(" - ");
            setJenisSuratOption(opt);
            setJenisSurat(rest.join(" - "));
          } else {
            setJenisSuratOption("PILIH");
            setJenisSurat(data.jenisSurat || "");
          }

          setKeteranganBumi(data.keteranganBumi || "");
          setKeteranganBphtb(data.keteranganBphtb || "");
          setIsVerified(data.isVerified || false);
          setStatusData(data.status || "MENUNGGU");
          setCatatanVerifikasi(data.catatanVerifikasi || "");
        }
        setLoading(false);
      });
  }, [id]);

  const doSave = async () => {
    if (noKtp && noKtp.length !== 16 && noKtp !== "-") {
      alert("Nomor KTP harus terdiri dari 16 digit angka.");
      return false;
    }
    
    setSaving(true);
    
    try {
      const payload = {
        jenisTransaksi,
        noKtp, kelurahanWp, namaWp, statusWp, npwp, jalanWp, pekerjaan, telepon, rtRwWp, noHp, dati2, blokKavNoWp, kodePosWp,
        noPersil, blokKavNoOp, rtRwOp, jalanOp, statusCabang,
        luasBumi, kodeZnt, jenisBumi, jenisTanah, 
        jenisSurat: jenisSuratOption === "PILIH" ? "" : `${jenisSuratOption} - ${jenisSurat}`,
        keteranganBumi, keteranganBphtb,
        latitude, longitude,
        nipPendata,
        status: statusData,
        catatanVerifikasi: catatanVerifikasi
      };

      const res = await fetch(`/api/spop/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan");
      return true;
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan data");
      setSaving(false);
      return false;
    }
  };

  const handleSaveOnly = async () => {
    if(!document.querySelector('form')?.reportValidity()) return;
    const ok = await doSave();
    if(ok) window.location.href = "/dashboard/admin/spop";
  };

  const handleNeedsRevision = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/spop/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: false, status: "PERLU_PERBAIKAN", catatanVerifikasi: tempNote })
      });
      if (res.ok) {
        setIsVerified(false);
        setStatusData("PERLU_PERBAIKAN");
        setCatatanVerifikasi(tempNote);
        setIsNoteModalOpen(false);
      } else {
        alert("Gagal menyimpan status.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndVerify = async () => {
    const success = await doSave();
    if (success) {
      const res = await fetch(`/api/spop/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true, status: "TERVERIFIKASI", catatanVerifikasi: "" })
      });
      if (res.ok) {
        setIsVerified(true);
        setStatusData("TERVERIFIKASI");
        setCatatanVerifikasi("");
        router.push("/dashboard/admin/spop");
      }
    }
  };

  const handleCancelVerify = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/spop/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: false, status: "MENUNGGU", catatanVerifikasi: "" })
      });
      if (res.ok) {
        setIsVerified(false);
        setStatusData("MENUNGGU");
        setCatatanVerifikasi("");
      }
    } catch(e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          alert("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#00557e]" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/spop" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[var(--text-secondary)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Data SPOP</h1>
          <p className="text-[var(--text-secondary)] mt-1">Mengubah data SPOP yang sudah masuk</p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Pendataan SPOP</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">No Formulir</label>
              <div className="md:col-span-3">
                <input type="text" value={noFormulir} disabled className="w-full md:w-1/2 px-4 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-[var(--text-secondary)] border-[var(--border)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Pilih Transaksi</label>
              <div className="md:col-span-3">
                <select value={jenisTransaksi} onChange={e => setJenisTransaksi(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                  <option value="Perekaman Data Baru">Perekaman Data Baru</option>
                  <option value="Pemutakhiran Data">Pemutakhiran Data</option>
                  <option value="Penghapusan Data">Penghapusan Data</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">NOP</label>
              <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                <input type="text" value={nopProv} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopKab} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopKec} disabled className="w-14 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopKel} disabled className="w-14 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopBlok} disabled className="w-16 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopUrut} disabled className="w-20 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopJenis} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-slate-100 text-center text-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Subjek Pajak / Wajib Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">No KTP <span className="text-red-500">*</span></label>
                <input type="text" required value={noKtp} onChange={e=>setNoKtp(e.target.value.replace(/\D/g, '').substring(0, 16))} maxLength={16} minLength={16} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Nama Wajib Pajak <span className="text-red-500">*</span></label>
                <input type="text" required value={namaWp} onChange={e=>setNamaWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Status WP</label>
                <select value={statusWp} onChange={e=>setStatusWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                  <option value="PEMILIK">PEMILIK</option>
                  <option value="PENYEWA">PENYEWA</option>
                  <option value="PENGELOLA">PENGELOLA</option>
                  <option value="PEMAKAI">PEMAKAI</option>
                  <option value="SENGKETA">SENGKETA</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">NPWP</label>
                <input type="text" value={npwp} onChange={e=>setNpwp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Pekerjaan</label>
                <select value={pekerjaan} onChange={e=>setPekerjaan(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                  <option value="">Pilih Pekerjaan</option>
                  <option value="PNS">PNS</option>
                  <option value="ABRI">ABRI</option>
                  <option value="PENSIUNAN">PENSIUNAN</option>
                  <option value="BADAN">BADAN</option>
                  <option value="LAINNYA">LAINNYA</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">No. Handphone</label>
                <input type="text" value={noHp} onChange={e=>setNoHp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Jalan <span className="text-red-500">*</span></label>
                <input type="text" required value={jalanWp} onChange={e=>setJalanWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">RT / RW</label>
                <div className="flex items-center space-x-2">
                  <input type="text" maxLength={2} value={rtRwWp.split('/')[0] || ""} onChange={e=>setRtRwWp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwWp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                  <span>/</span>
                  <input type="text" maxLength={2} value={rtRwWp.split('/')[1] || ""} onChange={e=>setRtRwWp(`${rtRwWp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Kelurahan</label>
                <input type="text" value={kelurahanWp} onChange={e=>setKelurahanWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Kabupaten</label>
                <input type="text" value={dati2} onChange={e=>setDati2(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Letak Objek Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">RT / RW</label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="text" maxLength={2} value={rtRwOp.split('/')[0] || ""} onChange={e=>setRtRwOp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwOp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                <span>/</span>
                <input type="text" maxLength={2} value={rtRwOp.split('/')[1] || ""} onChange={e=>setRtRwOp(`${rtRwOp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Titik Koordinat</label>
              <div className="md:col-span-3 flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Latitude" value={latitude} onChange={e=>setLatitude(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
                <input type="text" placeholder="Longitude" value={longitude} onChange={e=>setLongitude(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
                <button type="button" onClick={getLocation} className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded font-medium transition-colors text-sm whitespace-nowrap">
                  Dapatkan Lokasi Saat Ini
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Jalan</label>
              <div className="md:col-span-3">
                <input type="text" required value={jalanOp} onChange={e=>setJalanOp(e.target.value)} className="w-full md:w-2/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Bumi</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Luas Tanah</label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="number" required value={luasBumi} onChange={e=>setLuasBumi(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
                <span className="text-[var(--text-secondary)]">M²</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Kode ZNT</label>
              <div className="md:col-span-3">
                <input type="text" required value={kodeZnt} onChange={e=>setKodeZnt(e.target.value)} className="w-24 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Jenis Bumi</label>
              <div className="md:col-span-3">
                <select value={jenisBumi} onChange={e=>setJenisBumi(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                  <option value="TANAH + BANGUNAN">TANAH + BANGUNAN</option>
                  <option value="TANAH KOSONG">TANAH KOSONG</option>
                  <option value="FASILITAS UMUM">FASILITAS UMUM</option>
                  <option value="LAIN-LAIN">LAIN-LAIN</option>
                  <option value="SAWAH">SAWAH</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Jenis Surat</label>
              <div className="md:col-span-3 flex space-x-2">
                <select value={jenisSuratOption} onChange={e=>setJenisSuratOption(e.target.value)} className="px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none w-1/4">
                  <option value="PILIH">PILIH</option>
                  <option value="SHM">SHM</option>
                  <option value="AJB">AJB</option>
                  <option value="SHGB">SHGB</option>
                </select>
                <input type="text" value={jenisSurat} onChange={e=>setJenisSurat(e.target.value)} placeholder="Nomor Surat..." className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <label className="text-sm font-semibold text-[var(--text-primary)] mt-2">Keterangan</label>
              <div className="md:col-span-3">
                <textarea value={keteranganBumi} onChange={e=>setKeteranganBumi(e.target.value)} rows={3} className="w-full md:w-2/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Identitas Pendata/Pejabat yang berwenang</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Petugas Pendata</label>
              <input type="text" required value={nipPendata} onChange={e=>setNipPendata(e.target.value)} disabled className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--section-bg)] text-[var(--text-secondary)] border-[var(--border)] cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={saving}
            className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-[var(--input-bg)] border-2 border-[#00557e] text-[#00557e] hover:bg-slate-50 font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Simpan Data
          </button>
          {!isVerified ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setTempNote(catatanVerifikasi);
                  setIsNoteModalOpen(true);
                }}
                disabled={saving}
                className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Perlu Perbaikan
              </button>
              <button
                type="button"
                onClick={handleSaveAndVerify}
                disabled={saving}
                className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-[#00557e] hover:bg-[#004466] text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
              >
                {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                Simpan & Verifikasi
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancelVerify}
              disabled={saving}
              className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
            >
              Batal Verifikasi
            </button>
          )}
        </div>
      </form>

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--input-bg)] text-[var(--text-primary)] rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Catatan Perbaikan</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-[var(--text-secondary)]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Masukkan catatan perbaikan untuk pendata..."
              rows={4}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 bg-[var(--section-bg)] hover:bg-[var(--border)] text-[var(--text-primary)] font-medium rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleNeedsRevision}
                disabled={saving || !tempNote.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Kirim Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
