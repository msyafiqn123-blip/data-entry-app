"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SpopPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // NOP state
  const [nopProv, setNopProv] = useState("32");
  const [nopKab, setNopKab] = useState("16");
  const [nopKec, setNopKec] = useState("");
  const [nopKel, setNopKel] = useState("");
  const [nopBlok, setNopBlok] = useState("");
  const [nopUrut, setNopUrut] = useState("");
  const [nopJenis, setNopJenis] = useState("0");

  // NOP Tetangga state
  const [nopTetProv, setNopTetProv] = useState("32");
  const [nopTetKab, setNopTetKab] = useState("16");
  const [nopTetKec, setNopTetKec] = useState("");
  const [nopTetKel, setNopTetKel] = useState("");
  const [nopTetBlok, setNopTetBlok] = useState("");
  const [nopTetUrut, setNopTetUrut] = useState("");
  const [nopTetJenis, setNopTetJenis] = useState("");

  const [jenisTransaksi, setJenisTransaksi] = useState("Perekaman Data Baru");
  
  // NOP Double state (untuk Penghapusan)
  const [alasanPenghapusan, setAlasanPenghapusan] = useState("");
  const [nopDoubleProv, setNopDoubleProv] = useState("32");
  const [nopDoubleKab, setNopDoubleKab] = useState("16");
  const [nopDoubleKec, setNopDoubleKec] = useState("");
  const [nopDoubleKel, setNopDoubleKel] = useState("");
  const [nopDoubleBlok, setNopDoubleBlok] = useState("");
  const [nopDoubleUrut, setNopDoubleUrut] = useState("");
  const [nopDoubleJenis, setNopDoubleJenis] = useState("0");

  const [isPecah, setIsPecah] = useState("Tidak");
  const [nopAsalProv, setNopAsalProv] = useState("32");
  const [nopAsalKab, setNopAsalKab] = useState("16");
  const [nopAsalKec, setNopAsalKec] = useState("");
  const [nopAsalKel, setNopAsalKel] = useState("");
  const [nopAsalBlok, setNopAsalBlok] = useState("");
  const [nopAsalUrut, setNopAsalUrut] = useState("0000");
  const [nopAsalJenis, setNopAsalJenis] = useState("0");
  
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
  const [jenisBumi, setJenisBumi] = useState("TANAH KOSONG");
  const [jenisTanah, setJenisTanah] = useState("TANAH KOSONG");
  const [jenisSuratOption, setJenisSuratOption] = useState("PILIH");
  const [jenisSurat, setJenisSurat] = useState("");
  const [keteranganBumi, setKeteranganBumi] = useState("");
  const [keteranganBphtb, setKeteranganBphtb] = useState("");

  const [nipPendata, setNipPendata] = useState("");
  const [saving, setSaving] = useState(false);

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isNopLocked, setIsNopLocked] = useState(false);
  
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, noFormulir?: string, redirectUrl?: string}>({isOpen: false});

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile?t=" + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.kodeKecamatan) {
          setNopKec(data.kodeKecamatan);
          setNopTetKec(data.kodeKecamatan);
          setNopDoubleKec(data.kodeKecamatan);
          setNopAsalKec(data.kodeKecamatan);
          setIsNopLocked(true);
        }
        if (data.kodeKelurahan) {
          setNopKel(data.kodeKelurahan);
          setNopTetKel(data.kodeKelurahan);
          setNopDoubleKel(data.kodeKelurahan);
          setNopAsalKel(data.kodeKelurahan);
        }
        if (data.username) setNipPendata(data.username);
        
        // Auto-fill kelurahan WP if it's currently empty
        if (data.namaKelurahan && !kelurahanWp) {
          setKelurahanWp(data.namaKelurahan);
        }
        if (!dati2) {
          setDati2("Purwakarta"); // Default Kabupaten
        }
        setIsProfileLoaded(true);
      })
      .catch(e => console.error(e));
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jenisTransaksi === "Perekaman Data Baru" && nopTetUrut === "0000") {
      alert("Nomor Urut pada NOP Tetangga tidak boleh bernilai 0000.");
      return;
    }

    const isSubjekHidden = jenisTransaksi === "Penghapusan Data" && (alasanPenghapusan === "Subjek Pajak Tidak Diketahui" || alasanPenghapusan === "Objek Pajak Tidak Ada" || alasanPenghapusan === "Double NOP");
    if (!isSubjekHidden && noKtp && noKtp.length !== 16) {
      alert("Nomor KTP harus terdiri dari 16 digit angka.");
      return;
    }

    setSaving(true);

    const actualNopBlok = jenisTransaksi === "Perekaman Data Baru" ? nopTetBlok : nopBlok;
    const actualNopUrut = jenisTransaksi === "Perekaman Data Baru" ? "0000" : nopUrut;
    const actualNopJenis = jenisTransaksi === "Perekaman Data Baru" ? "0" : nopJenis;
    const nop = `${nopProv}.${nopKab}.${nopKec}.${nopKel}.${actualNopBlok}.${actualNopUrut}.${actualNopJenis}`;
    const nopAsal = isPecah === "Ya" ? `${nopAsalProv}.${nopAsalKab}.${nopAsalKec}.${nopAsalKel}.${nopAsalBlok}.${nopAsalUrut}.${nopAsalJenis}` : null;
    const nopTetangga = nopTetBlok && nopTetUrut && nopTetJenis ? `${nopTetProv}.${nopTetKab}.${nopTetKec}.${nopTetKel}.${nopTetBlok}.${nopTetUrut}.${nopTetJenis}` : "";
    const nopDouble = nopDoubleBlok && nopDoubleUrut && nopDoubleJenis ? `${nopDoubleProv}.${nopDoubleKab}.${nopDoubleKec}.${nopDoubleKel}.${nopDoubleBlok}.${nopDoubleUrut}.${nopDoubleJenis}` : "";

    const hideObjek = jenisTransaksi === "Penghapusan Data" && (alasanPenghapusan === "Objek Pajak Tidak Ada" || alasanPenghapusan === "Double NOP");
    const hideSubjek = jenisTransaksi === "Penghapusan Data" && (alasanPenghapusan === "Subjek Pajak Tidak Diketahui" || alasanPenghapusan === "Objek Pajak Tidak Ada" || alasanPenghapusan === "Double NOP");

    try {
      const payload = {
          nop,
          jenisTransaksi,
          isPecah: isPecah === "Ya",
          nopAsal,
          noKtp: hideSubjek ? "-" : noKtp, 
          kelurahanWp: hideSubjek ? "" : kelurahanWp, 
          namaWp: hideSubjek ? "-" : namaWp, 
          statusWp: hideSubjek ? "" : statusWp, 
          npwp: hideSubjek ? "" : npwp, 
          jalanWp: hideSubjek ? "-" : jalanWp, 
          pekerjaan: hideSubjek ? "" : pekerjaan, 
          telepon: hideSubjek ? "" : telepon, 
          rtRwWp: hideSubjek ? "-/-" : rtRwWp, 
          noHp: hideSubjek ? "" : noHp, 
          dati2: hideSubjek ? "" : dati2, 
          blokKavNoWp: hideSubjek ? "" : blokKavNoWp, 
          kodePosWp: hideSubjek ? "" : kodePosWp,
          noPersil: hideObjek ? "" : noPersil, 
          blokKavNoOp: hideObjek ? "" : blokKavNoOp, 
          rtRwOp: hideObjek ? "" : rtRwOp, 
          jalanOp: hideObjek ? "-" : jalanOp, 
          statusCabang: hideObjek ? "" : statusCabang,
          luasBumi: hideObjek ? "0" : luasBumi, 
          kodeZnt: "-", 
          jenisBumi: hideObjek ? "" : jenisBumi, 
          jenisTanah: hideObjek ? "" : jenisTanah, 
          jenisSurat: hideObjek ? "" : (jenisSuratOption === "PILIH" ? "" : jenisSurat),
          keteranganBumi,
          keteranganBphtb,
          latitude,
          longitude,
          nopTetangga,
          alasanPenghapusan,
          nopDouble
      };

      const res = await fetch("/api/spop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccessModal({
          isOpen: true,
          noFormulir: data.noFormulir,
          redirectUrl: (jenisBumi === "TANAH + BANGUNAN" && !hideObjek && jenisTransaksi !== "Penghapusan Data") ? `/dashboard/lspop?nop=${nop}` : undefined
        });
        
        if (!(jenisBumi === "TANAH + BANGUNAN" && !hideObjek && jenisTransaksi !== "Penghapusan Data")) {
          // Reset specific fields
          setNopBlok(""); setNopUrut("");
          setNoKtp(""); setNamaWp(""); setNpwp(""); setJalanWp(""); setTelepon(""); setNoHp(""); setKelurahanWp(""); setRtRwWp(""); setDati2(""); setBlokKavNoWp(""); setKodePosWp("");
          setNoPersil(""); setBlokKavNoOp(""); setRtRwOp(""); setJalanOp("");
          setLuasBumi(""); setKodeZnt(""); setKeteranganBumi(""); setKeteranganBphtb("");
          setLatitude(""); setLongitude(""); 
          setNopTetBlok(""); setNopTetUrut(""); setNopTetJenis("");
          setAlasanPenghapusan(""); setNopDoubleBlok(""); setNopDoubleUrut(""); setNopDoubleJenis("");
        }
      } else {
        alert(data.error || "Terjadi kesalahan");
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">PENDATAAN OBYEK PAJAK (SPOP)</h1>
          <p className="text-[var(--text-secondary)] mt-1">Surat Pemberitahuan Objek Pajak</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PENDATAAN SPOP */}
        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Pendataan SPOP</h2>
          </div>
          <div className="p-6 space-y-6">
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

            {jenisTransaksi === "Perekaman Data Baru" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <label className="text-sm font-semibold text-[var(--text-primary)]">NOP Tetangga</label>
                <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                  <input type="text" value={nopTetProv} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                  <input type="text" value={nopTetKab} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopTetKec} onChange={e => setNopTetKec(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kec" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopTetKel} onChange={e => setNopTetKel(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kel" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopTetBlok} onChange={e => setNopTetBlok(e.target.value)} maxLength={3} className="w-16 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Blok" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopTetUrut} onChange={e => setNopTetUrut(e.target.value)} maxLength={4} className="w-20 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Urut" />
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopTetJenis} onChange={e => setNopTetJenis(e.target.value)} maxLength={1} className="w-12 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Jns" />
                </div>
              </div>
            )}

            {jenisTransaksi === "Pemutakhiran Data" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Pecah? <span className="text-red-500">*</span></label>
                  <div className="md:col-span-3">
                    <select value={isPecah} onChange={e => setIsPecah(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </div>
                </div>

                {isPecah === "Ya" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">NOP Asal / Induk <span className="text-red-500">*</span></label>
                    <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                      <input type="text" value={nopAsalProv} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                      <input type="text" value={nopAsalKab} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopAsalKec} onChange={e => { setNopAsalKec(e.target.value); setNopKec(e.target.value); }} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kec" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopAsalKel} onChange={e => { setNopAsalKel(e.target.value); setNopKel(e.target.value); }} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kel" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopAsalBlok} onChange={e => { setNopAsalBlok(e.target.value); setNopBlok(e.target.value); }} maxLength={3} className="w-16 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Blok" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopAsalUrut} onChange={e => setNopAsalUrut(e.target.value)} maxLength={4} className="w-20 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Urut" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopAsalJenis} onChange={e => { setNopAsalJenis(e.target.value); setNopJenis(e.target.value); }} maxLength={1} className="w-12 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Jns" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">NOP <span className="text-red-500">*</span></label>
              <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                <input type="text" value={nopProv} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                <input type="text" value={nopKab} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopKec} onChange={e => setNopKec(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kec" />
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopKel} onChange={e => setNopKel(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kel" />
                <input type="text" inputMode="numeric" pattern="[0-9]*" required={jenisTransaksi !== "Perekaman Data Baru"} value={jenisTransaksi === "Perekaman Data Baru" ? nopTetBlok : nopBlok} onChange={e => setNopBlok(e.target.value)} maxLength={3} className={`w-16 px-2 py-2 border rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${jenisTransaksi === "Perekaman Data Baru" ? "bg-[var(--section-bg)] text-[var(--text-secondary)] border-[var(--border)] cursor-not-allowed" : "bg-[var(--input-bg)] text-[var(--text-primary)] border-purple-400 shadow-sm"}`} placeholder="Blok" disabled={jenisTransaksi === "Perekaman Data Baru"} />
                <input type="text" inputMode="numeric" pattern="[0-9]*" required={jenisTransaksi !== "Perekaman Data Baru"} value={jenisTransaksi === "Perekaman Data Baru" ? "0000" : nopUrut} onChange={e => setNopUrut(e.target.value)} maxLength={4} className={`w-20 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${jenisTransaksi === "Perekaman Data Baru" ? "bg-[var(--section-bg)] text-[var(--text-secondary)] cursor-not-allowed" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} placeholder="Urut" disabled={jenisTransaksi === "Perekaman Data Baru"} />
                <input type="text" inputMode="numeric" pattern="[0-9]*" required={jenisTransaksi !== "Perekaman Data Baru"} value={jenisTransaksi === "Perekaman Data Baru" ? "0" : nopJenis} onChange={e => setNopJenis(e.target.value)} maxLength={1} className={`w-12 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${jenisTransaksi === "Perekaman Data Baru" ? "bg-[var(--section-bg)] text-[var(--text-secondary)] cursor-not-allowed" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} placeholder="Jns" disabled={jenisTransaksi === "Perekaman Data Baru"} />
              </div>
            </div>

            {jenisTransaksi === "Penghapusan Data" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <label className="text-sm font-semibold text-[var(--text-primary)]">Alasan Penghapusan <span className="text-red-500">*</span></label>
                  <div className="md:col-span-3">
                    <select required value={alasanPenghapusan} onChange={e => setAlasanPenghapusan(e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]">
                      <option value="">Pilih Alasan Penghapusan</option>
                      <option value="Double NOP">Double NOP</option>
                      <option value="Objek Pajak Tidak Ada">Objek Pajak Tidak Ada</option>
                      <option value="Subjek Pajak Tidak Diketahui">Subjek Pajak Tidak Diketahui</option>
                    </select>
                  </div>
                </div>

                {alasanPenghapusan === "Double NOP" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">NOP Double <span className="text-red-500">*</span></label>
                    <div className="md:col-span-3 flex flex-wrap items-center gap-2">
                      <input type="text" value={nopDoubleProv} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                      <input type="text" value={nopDoubleKab} disabled className="w-12 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-[var(--text-secondary)]" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopDoubleKec} onChange={e => setNopDoubleKec(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kec" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" value={nopDoubleKel} onChange={e => setNopDoubleKel(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none ${isNopLocked ? "bg-[var(--section-bg)] text-[var(--text-secondary)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"}`} readOnly={isNopLocked} placeholder="Kel" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopDoubleBlok} onChange={e => setNopDoubleBlok(e.target.value)} maxLength={3} className="w-16 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Blok" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopDoubleUrut} onChange={e => setNopDoubleUrut(e.target.value)} maxLength={4} className="w-20 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Urut" />
                      <input type="text" inputMode="numeric" pattern="[0-9]*" required value={nopDoubleJenis} onChange={e => setNopDoubleJenis(e.target.value)} maxLength={1} className="w-12 px-2 py-2 border border-[var(--border)] rounded text-center focus:ring-2 focus:ring-purple-500 outline-none bg-[var(--input-bg)] text-[var(--text-primary)]" placeholder="Jns" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!(jenisTransaksi === "Penghapusan Data" && (alasanPenghapusan === "Subjek Pajak Tidak Diketahui" || alasanPenghapusan === "Objek Pajak Tidak Ada" || alasanPenghapusan === "Double NOP")) && (
          <>
            {/* DATA SUBJEK PAJAK */}
            <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Subjek Pajak / Wajib Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">No KTP <span className="text-red-500">*</span></label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" required value={noKtp} onChange={e=>setNoKtp(e.target.value.replace(/\D/g, '').substring(0, 16))} maxLength={16} minLength={16} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Nama Wajib Pajak <span className="text-red-500">*</span></label>
                <input type="text" required value={namaWp} onChange={e=>setNamaWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
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
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={npwp} onChange={e=>setNpwp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
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
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={noHp} onChange={e=>setNoHp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Jalan <span className="text-red-500">*</span></label>
                <input type="text" required value={jalanWp} onChange={e=>setJalanWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">RT / RW <span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-2">
                  <input type="text" inputMode="numeric" pattern="[0-9]*" required maxLength={2} value={rtRwWp.split('/')[0] || ""} onChange={e=>setRtRwWp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwWp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                  <span>/</span>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" required maxLength={2} value={rtRwWp.split('/')[1] || ""} onChange={e=>setRtRwWp(`${rtRwWp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Kelurahan</label>
                <input type="text" value={kelurahanWp} onChange={e=>setKelurahanWp(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Kabupaten</label>
                <input type="text" value={dati2} onChange={e=>setDati2(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {!(jenisTransaksi === "Penghapusan Data" && (alasanPenghapusan === "Objek Pajak Tidak Ada" || alasanPenghapusan === "Double NOP")) && (
          <>
            {/* DATA LETAK OBJEK PAJAK */}
            <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Letak Objek Pajak</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">RT / RW <span className="text-red-500">*</span></label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="text" inputMode="numeric" pattern="[0-9]*" required maxLength={2} value={rtRwOp.split('/')[0] || ""} onChange={e=>setRtRwOp(`${e.target.value.replace(/\D/g, '').substring(0,2)}/${rtRwOp.split('/')[1]||""}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center" />
                <span>/</span>
                <input type="text" inputMode="numeric" pattern="[0-9]*" required maxLength={2} value={rtRwOp.split('/')[1] || ""} onChange={e=>setRtRwOp(`${rtRwOp.split('/')[0]||""}/${e.target.value.replace(/\D/g, '').substring(0,2)}`)} className="w-16 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none text-center bg-[var(--input-bg)] text-[var(--text-primary)]" />
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
              <label className="text-sm font-semibold text-[var(--text-primary)]">Jalan <span className="text-red-500">*</span></label>
              <div className="md:col-span-3">
                <input type="text" required value={jalanOp} onChange={e=>setJalanOp(e.target.value)} className="w-full md:w-2/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* DATA BUMI */}
        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Data Bumi</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Luas Tanah <span className="text-red-500">*</span></label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input type="number" required value={luasBumi} onChange={e=>setLuasBumi(e.target.value)} className="w-full md:w-1/3 px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
                <span className="text-slate-600">M²</span>
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
                <input type="text" value={jenisSurat} onChange={e=>setJenisSurat(e.target.value)} placeholder="Nomor Surat..." className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
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
        </>
        )}

        {/* IDENTITAS PENDATA */}
        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Identitas Pendata/Pejabat yang berwenang</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Tanggal Pendataan <span className="text-red-500">*</span></label>
              <input type="date" required value={new Date().toISOString().split('T')[0]} readOnly className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-[var(--text-secondary)] cursor-not-allowed" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">Petugas Pendata <span className="text-red-500">*</span></label>
              <input type="text" required value={nipPendata} readOnly className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-[var(--text-secondary)] cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#00557e] hover:bg-[#004466] text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center text-lg"
          >
            {saving ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Save className="w-6 h-6 mr-2" />}
            SIMPAN SPOP
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all border border-[var(--border)]">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">SPOP Berhasil Disimpan!</h3>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Nomor formulir Anda:<br/>
                <span className="font-mono font-bold text-lg text-[var(--primary)]">{successModal.noFormulir}</span>
              </p>
              <button 
                onClick={() => {
                  if (successModal.redirectUrl) {
                    router.push(successModal.redirectUrl);
                  } else {
                    setSuccessModal({isOpen: false});
                  }
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-md"
              >
                {successModal.redirectUrl ? "Lanjut Isi LSPOP" : "Tutup & Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
