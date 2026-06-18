"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
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

  const [isView, setIsView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsView(params.get("view") === "true");
    }
  }, []);

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
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate KTP
    if (noKtp && noKtp.length !== 16 && noKtp !== "-") {
      alert("Nomor KTP harus terdiri dari 16 digit angka.");
      return;
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
        nipPendata
      };

      const res = await fetch(`/api/spop/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/dashboard/my-spop");
      } else {
        const data = await res.json();
        alert(data.error || "Gagal update");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menghubungi server");
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
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Data SPOP</h1>
          <p className="text-slate-500 mt-1">Mengubah data SPOP yang sudah masuk</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <fieldset disabled={isView} className="space-y-6 border-none p-0 m-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Pendataan SPOP</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">No Formulir</label>
              <div className="md:col-span-3">
                <input type="text" value={noFormulir} disabled className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded bg-slate-100 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Pilih Transaksi</label>
              <div className="md:col-span-3">
                <select value={jenisTransaksi} onChange={e => setJenisTransaksi(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="Perekaman Data Baru">Perekaman Data Baru</option>
                  <option value="Pemutakhiran Data">Pemutakhiran Data</option>
                  <option value="Penghapusan Data">Penghapusan Data</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">NOP</label>
              <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                <input type="text" value={nopProv} disabled className="w-12 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopKab} disabled className="w-12 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopKec} disabled className="w-14 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopKel} disabled className="w-14 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopBlok} disabled className="w-16 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopUrut} disabled className="w-20 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
                <input type="text" value={nopJenis} disabled className="w-12 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Data Subjek Pajak / Wajib Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">No KTP <span className="text-red-500">*</span></label>
                <input type="text" required value={noKtp} onChange={e=>setNoKtp(e.target.value.replace(/\D/g, '').substring(0, 16))} maxLength={16} minLength={16} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Nama Wajib Pajak <span className="text-red-500">*</span></label>
                <input type="text" required value={namaWp} onChange={e=>setNamaWp(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Status WP</label>
                <select value={statusWp} onChange={e=>setStatusWp(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="PEMILIK">PEMILIK</option>
                  <option value="PENYEWA">PENYEWA</option>
                  <option value="PENGELOLA">PENGELOLA</option>
                  <option value="PEMAKAI">PEMAKAI</option>
                  <option value="SENGKETA">SENGKETA</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">NPWP</label>
                <input type="text" value={npwp} onChange={e=>setNpwp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Pekerjaan</label>
                <select value={pekerjaan} onChange={e=>setPekerjaan(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="">Pilih Pekerjaan</option>
                  <option value="PNS">PNS</option>
                  <option value="ABRI">ABRI</option>
                  <option value="PENSIUNAN">PENSIUNAN</option>
                  <option value="BADAN">BADAN</option>
                  <option value="LAINNYA">LAINNYA</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">No. Handphone</label>
                <input type="text" value={noHp} onChange={e=>setNoHp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Jalan <span className="text-red-500">*</span></label>
                <input type="text" required value={jalanWp} onChange={e=>setJalanWp(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">RT / RW</label>
                <div className="flex items-center space-x-2">
                  <input type="text" maxLength={2} value={rtRwWp.split('/')[0] || ""} onChange={e=>setRtRwWp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwWp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                  <span>/</span>
                  <input type="text" maxLength={2} value={rtRwWp.split('/')[1] || ""} onChange={e=>setRtRwWp(`${rtRwWp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Kelurahan</label>
                <input type="text" value={kelurahanWp} onChange={e=>setKelurahanWp(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Kabupaten</label>
                <input type="text" value={dati2} onChange={e=>setDati2(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Data Letak Objek Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">RT / RW</label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="text" maxLength={2} value={rtRwOp.split('/')[0] || ""} onChange={e=>setRtRwOp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwOp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                <span>/</span>
                <input type="text" maxLength={2} value={rtRwOp.split('/')[1] || ""} onChange={e=>setRtRwOp(`${rtRwOp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Titik Koordinat</label>
              <div className="md:col-span-3 flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Latitude" value={latitude} onChange={e=>setLatitude(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" placeholder="Longitude" value={longitude} onChange={e=>setLongitude(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
                <button type="button" onClick={getLocation} className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded font-medium transition-colors text-sm whitespace-nowrap">
                  Dapatkan Lokasi Saat Ini
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Jalan</label>
              <div className="md:col-span-3">
                <input type="text" required value={jalanOp} onChange={e=>setJalanOp(e.target.value)} className="w-full md:w-2/3 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Data Bumi</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Luas Tanah</label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="number" required value={luasBumi} onChange={e=>setLuasBumi(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
                <span className="text-slate-600">M²</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Kode ZNT</label>
              <div className="md:col-span-3">
                <input type="text" required value={kodeZnt} onChange={e=>setKodeZnt(e.target.value)} className="w-24 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Jenis Bumi</label>
              <div className="md:col-span-3">
                <select value={jenisBumi} onChange={e=>setJenisBumi(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="TANAH + BANGUNAN">TANAH + BANGUNAN</option>
                  <option value="TANAH KOSONG">TANAH KOSONG</option>
                  <option value="FASILITAS UMUM">FASILITAS UMUM</option>
                  <option value="LAIN-LAIN">LAIN-LAIN</option>
                  <option value="SAWAH">SAWAH</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-slate-700">Jenis Surat</label>
              <div className="md:col-span-3 flex space-x-2">
                <select value={jenisSuratOption} onChange={e=>setJenisSuratOption(e.target.value)} className="px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none w-1/4">
                  <option value="PILIH">PILIH</option>
                  <option value="SHM">SHM</option>
                  <option value="AJB">AJB</option>
                  <option value="SHGB">SHGB</option>
                </select>
                <input type="text" value={jenisSurat} onChange={e=>setJenisSurat(e.target.value)} placeholder="Nomor Surat..." className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <label className="text-sm font-semibold text-slate-700 mt-2">Keterangan</label>
              <div className="md:col-span-3">
                <textarea value={keteranganBumi} onChange={e=>setKeteranganBumi(e.target.value)} rows={3} className="w-full md:w-2/3 px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Identitas Pendata/Pejabat yang berwenang</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1">NIP Pendata</label>
              <input type="text" required value={nipPendata} onChange={e=>setNipPendata(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>
        </fieldset>

        {/* Submit */}
        {!isView && (
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[var(--border)]">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-colors flex items-center">
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Simpan Perubahan
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
