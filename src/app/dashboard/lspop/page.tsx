"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LspopPage() {
  const { data: session, status } = useSession();
  
  // NOP state
  const [nopProv, setNopProv] = useState("32");
  const [nopKab, setNopKab] = useState("16");
  const [nopKec, setNopKec] = useState("");
  const [nopKel, setNopKel] = useState("");
  const [nopBlok, setNopBlok] = useState("");
  const [nopUrut, setNopUrut] = useState("");
  const [nopJenis, setNopJenis] = useState("");

  const [jenisTransaksi, setJenisTransaksi] = useState("Pendataan Bangunan Baru");
  
  // Rincian Bangunan
  const [noBangunan, setNoBangunan] = useState("1");
  const [jenisBangunan, setJenisBangunan] = useState("");
  const [luasBangunan, setLuasBangunan] = useState("");
  const [jumlahLantai, setJumlahLantai] = useState("1");
  const [tahunDibangun, setTahunDibangun] = useState("");
  const [tahunRenovasi, setTahunRenovasi] = useState("");
  const [dayaListrik, setDayaListrik] = useState("");
  
  const [kondisiBangunan, setKondisiBangunan] = useState("");
  const [konstruksi, setKonstruksi] = useState("");
  const [atap, setAtap] = useState("");
  const [dinding, setDinding] = useState("");
  const [lantai, setLantai] = useState("");
  const [langitLangit, setLangitLangit] = useState("");

  const [saving, setSaving] = useState(false);

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isNopLocked, setIsNopLocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nopParam = params.get("nop");
      if (nopParam) {
        const parts = nopParam.split(".");
        if (parts.length >= 7) {
          setNopProv(parts[0]);
          setNopKab(parts[1]);
          setNopKec(parts[2]);
          setNopKel(parts[3]);
          setNopBlok(parts[4]);
          setNopUrut(parts[5]);
          setNopJenis(parts[6]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile?t=" + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.kodeKecamatan) {
          setNopKec(data.kodeKecamatan);
          setIsNopLocked(true);
        }
        if (data.kodeKelurahan) setNopKel(data.kodeKelurahan);
        setIsProfileLoaded(true);
      })
      .catch(e => console.error(e));
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const nop = `${nopProv}.${nopKab}.${nopKec}.${nopKel}.${nopBlok}.${nopUrut}.${nopJenis}`;

    try {
      const res = await fetch("/api/lspop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nop,
          noBangunan,
          jenisBangunan,
          luasBangunan,
          jumlahLantai,
          tahunDibangun,
          kondisiBangunan,
          konstruksi,
          atap,
          dinding,
          lantai,
          langitLangit,
          dayaListrik,
          tahunRenovasi
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`LSPOP Berhasil Disimpan!\nNomor Formulir Anda: ${data.noFormulir}`);
        // Reset specific fields
        setNoBangunan((parseInt(noBangunan) + 1).toString());
        setLuasBangunan("");
        setTahunDibangun("");
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">PENDATAAN OBYEK PAJAK (LSPOP)</h1>
          <p className="text-[var(--text-secondary)] mt-1">Lampiran Surat Pemberitahuan Objek Pajak</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1 */}
        <div className="bg-[var(--input-bg)] text-[var(--text-primary)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Pendataan LSPOP</h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Transaksi */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="md:w-1/4 text-sm font-semibold text-[var(--text-primary)]">Pilih Transaksi</label>
              <select value={jenisTransaksi} onChange={e => setJenisTransaksi(e.target.value)} className="md:w-1/2 px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="Pendataan Bangunan Baru">Pendataan Bangunan Baru</option>
                <option value="Pendataan Renovasi/Perubahan Bangunan">Pendataan Renovasi/Perubahan Bangunan</option>
              </select>
            </div>

            {/* NOP */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="md:w-1/4 text-sm font-semibold text-[var(--text-primary)]">
                NOP <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input type="text" value={nopProv} readOnly className="w-10 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-sm font-medium" />
                <input type="text" value={nopKab} readOnly className="w-10 px-2 py-2 border border-[var(--border)] rounded bg-[var(--section-bg)] text-center text-sm font-medium" />
                <input type="text" value={nopKec} onChange={e => setNopKec(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center text-sm ${isNopLocked ? "bg-[var(--section-bg)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"} focus:ring-2 focus:ring-purple-500 outline-none`} readOnly={isNopLocked} />
                <input type="text" value={nopKel} onChange={e => setNopKel(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-[var(--border)] rounded text-center text-sm ${isNopLocked ? "bg-[var(--section-bg)]" : "bg-[var(--input-bg)] text-[var(--text-primary)]"} focus:ring-2 focus:ring-purple-500 outline-none`} readOnly={isNopLocked} />
                <input type="text" value={nopBlok} onChange={e => setNopBlok(e.target.value)} maxLength={3} required placeholder="000" className="w-14 px-2 py-2 border border-[var(--border)] rounded text-center text-sm bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" value={nopUrut} onChange={e => setNopUrut(e.target.value)} maxLength={4} required placeholder="0000" className="w-16 px-2 py-2 border border-[var(--border)] rounded text-center text-sm bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" value={nopJenis} onChange={e => setNopJenis(e.target.value)} maxLength={1} required placeholder="0" className="w-10 px-2 py-2 border border-[var(--border)] rounded text-center text-sm bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-[var(--input-bg)] text-[var(--text-primary)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--section-bg)] px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Rincian Data Bangunan</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Jenis Bangunan <span className="text-red-500">*</span></label>
                <select required value={jenisBangunan} onChange={e => setJenisBangunan(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Jenis Bangunan</option>
                  <option value="PERUMAHAN">PERUMAHAN</option>
                  <option value="PERKANTORAN SWASTA">PERKANTORAN SWASTA</option>
                  <option value="PABRIK">PABRIK</option>
                  <option value="TOKO/APOTIK/PASAR/RUKO">TOKO/APOTIK/PASAR/RUKO</option>
                  <option value="RUMAH SAKIT/KLINIK">RUMAH SAKIT/KLINIK</option>
                  <option value="OLAH RAGA/REKREASI">OLAH RAGA/REKREASI</option>
                  <option value="HOTEL/WISMA">HOTEL/WISMA</option>
                  <option value="BENGKEL/GUDANG/PERTANIAN">BENGKEL/GUDANG/PERTANIAN</option>
                  <option value="GEDUNG PEMERINTAH">GEDUNG PEMERINTAH</option>
                  <option value="LAIN-LAIN">LAIN-LAIN</option>
                  <option value="BANGUNAN TIDAK KENA PAJAK">BANGUNAN TIDAK KENA PAJAK</option>
                  <option value="BANGUNAN PARKIR">BANGUNAN PARKIR</option>
                  <option value="APARTEMEN">APARTEMEN</option>
                  <option value="POMPA BENSIN">POMPA BENSIN</option>
                  <option value="TANGKI MINYAK">TANGKI MINYAK</option>
                  <option value="GEDUNG SEKOLAH">GEDUNG SEKOLAH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Luas Bangunan <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <input type="number" required value={luasBangunan} onChange={e => setLuasBangunan(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded-l focus:ring-2 focus:ring-purple-500 outline-none" />
                  <span className="px-4 py-2 bg-[var(--section-bg)] border border-l-0 border-[var(--border)] rounded-r text-slate-600 font-medium">M²</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Jumlah Lantai</label>
                <input type="number" value={jumlahLantai} onChange={e => setJumlahLantai(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Tahun Dibangun</label>
                <input type="number" value={tahunDibangun} onChange={e => setTahunDibangun(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Tahun Renovasi</label>
                <input type="number" value={tahunRenovasi} onChange={e => setTahunRenovasi(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Daya Listrik <span className="text-red-500">*</span></label>
                <input type="text" required value={dayaListrik} onChange={e => setDayaListrik(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Kondisi Bangunan <span className="text-red-500">*</span></label>
                <select required value={kondisiBangunan} onChange={e => setKondisiBangunan(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Kondisi Bangunan</option>
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Jelek">Jelek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Konstruksi <span className="text-red-500">*</span></label>
                <select required value={konstruksi} onChange={e => setKonstruksi(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Konstruksi</option>
                  <option value="Baja">Baja</option>
                  <option value="Beton">Beton</option>
                  <option value="Batu Bata">Batu Bata</option>
                  <option value="Kayu">Kayu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Atap <span className="text-red-500">*</span></label>
                <select required value={atap} onChange={e => setAtap(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Atap</option>
                  <option value="Decrabond/Beton/Genting Glazur">Decrabond/Beton/Genting Glazur</option>
                  <option value="Genting Beton/Aluminium">Genting Beton/Aluminium</option>
                  <option value="Genting Biasa/Sirap">Genting Biasa/Sirap</option>
                  <option value="Asbes">Asbes</option>
                  <option value="Seng">Seng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Dinding <span className="text-red-500">*</span></label>
                <select required value={dinding} onChange={e => setDinding(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Dinding</option>
                  <option value="Kaca/Aluminium">Kaca/Aluminium</option>
                  <option value="Beton">Beton</option>
                  <option value="Batu Bata/Conblock">Batu Bata/Conblock</option>
                  <option value="Kayu">Kayu</option>
                  <option value="Seng">Seng</option>
                  <option value="Asbes">Asbes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Lantai <span className="text-red-500">*</span></label>
                <select required value={lantai} onChange={e => setLantai(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Lantai</option>
                  <option value="Marmer">Marmer</option>
                  <option value="Keramik">Keramik</option>
                  <option value="Teraso">Teraso</option>
                  <option value="Ubin PC/Papan">Ubin PC/Papan</option>
                  <option value="Semen">Semen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Langit-langit <span className="text-red-500">*</span></label>
                <select required value={langitLangit} onChange={e => setLangitLangit(e.target.value)} className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Langit-langit</option>
                  <option value="Akuistik/Jati">Akuistik/Jati</option>
                  <option value="Triplek/Asbes Bambu">Triplek/Asbes Bambu</option>
                  <option value="Gypsum">Gypsum</option>
                  <option value="Triplek">Triplek</option>
                  <option value="Tidak Ada">Tidak Ada</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#00557e] hover:bg-[#004466] text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            SIMPAN LSPOP
          </button>
        </div>

      </form>
    </div>
  );
}

