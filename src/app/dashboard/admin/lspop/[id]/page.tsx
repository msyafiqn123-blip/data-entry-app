"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditLspopPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // NOP state
  const [nopProv, setNopProv] = useState("32");
  const [nopKab, setNopKab] = useState("16");
  const [nopKec, setNopKec] = useState("");
  const [nopKel, setNopKel] = useState("");
  const [nopBlok, setNopBlok] = useState("");
  const [nopUrut, setNopUrut] = useState("");
  const [nopJenis, setNopJenis] = useState("");

  const [noFormulir, setNoFormulir] = useState("");
  const [jenisTransaksi, setJenisTransaksi] = useState("Perekaman Data Baru");
  
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
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Fetch existing data
    fetch(`/api/lspop/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        const nopStr = data.nop || data.spop?.nop;
        if (nopStr) {
          const parts = nopStr.split(".");
          setNopProv(parts[0] || "");
          setNopKab(parts[1] || "");
          setNopKec(parts[2] || "");
          setNopKel(parts[3] || "");
          setNopBlok(parts[4] || "");
          setNopUrut(parts[5] || "");
          setNopJenis(parts[6] || "");
        }

        setNoFormulir(data.noFormulir || "");

        setNoBangunan(data.noBangunan.toString());
        setJenisBangunan(data.jenisBangunan);
        setLuasBangunan(data.luasBangunan.toString());
        setJumlahLantai(data.jumlahLantai?.toString() || "1");
        setTahunDibangun(data.tahunDibangun?.toString() || "");
        setTahunRenovasi(data.tahunRenovasi?.toString() || "");
        setDayaListrik(data.dayaListrik || "");
        
        setKondisiBangunan(data.kondisiBangunan || "");
        setKonstruksi(data.konstruksi);
        setAtap(data.atap);
        setDinding(data.dinding);
        setLantai(data.lantai);
        setLangitLangit(data.langitLangit);
        setIsVerified(data.isVerified || false);
      });
  }, [params.id]);

  const doSave = async () => {
    setSaving(true);
    
    const nop = `${nopProv}.${nopKab}.${nopKec}.${nopKel}.${nopBlok}.${nopUrut}.${nopJenis}`;

    try {
      const res = await fetch(`/api/lspop/${params.id}`, {
        method: "PUT",
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
    if(ok) window.location.href = "/dashboard/admin/lspop";
  };

  const handleSaveAndVerify = async () => {
    if(!document.querySelector('form')?.reportValidity()) return;
    const ok = await doSave();
    if(ok) {
      await fetch(`/api/lspop/${params.id}/verify`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({isVerified: true}) });
      window.location.href = "/dashboard/admin/lspop";
    }
  };

  const handleCancelVerify = async () => {
    setSaving(true);
    await fetch(`/api/lspop/${params.id}/verify`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({isVerified: false}) });
    window.location.href = "/dashboard/admin/lspop";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">EDIT LSPOP</h1>
          <p className="text-slate-500 mt-1">Lampiran Surat Pemberitahuan Objek Pajak</p>
        </div>
        <button onClick={() => router.push("/dashboard/admin/lspop")} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-medium">
          Kembali
        </button>
      </div>

      <form className="space-y-6">
        
        {/* Section 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Pendataan LSPOP</h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* No Formulir */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="md:w-1/4 text-sm font-semibold text-slate-700">
                No Formulir
              </label>
              <div className="flex items-center space-x-2">
                <input type="text" value={noFormulir} disabled className="w-48 px-3 py-2 border border-slate-300 rounded bg-slate-100 text-slate-500 focus:outline-none" />
              </div>
            </div>

            {/* Transaksi */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="md:w-1/4 text-sm font-semibold text-slate-700">Pilih Transaksi</label>
              <select value={jenisTransaksi} onChange={e => setJenisTransaksi(e.target.value)} className="md:w-1/2 px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="Perekaman Data Baru">Perekaman Data Baru</option>
                <option value="Pemutakhiran Data">Pemutakhiran Data</option>
              </select>
            </div>

            {/* NOP */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <label className="md:w-1/4 text-sm font-semibold text-slate-700">
                NOP <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input type="text" value={nopProv} readOnly className="w-10 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-sm font-medium" />
                <input type="text" value={nopKab} readOnly className="w-10 px-2 py-2 border border-slate-300 rounded bg-slate-100 text-center text-sm font-medium" />
                <input type="text" value={nopKec} onChange={e => setNopKec(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-slate-300 rounded text-center text-sm ${(session as any)?.user?.kodeKecamatan ? "bg-slate-100" : "bg-white"} focus:ring-2 focus:ring-purple-500 outline-none`} readOnly={!!(session as any)?.user?.kodeKecamatan} />
                <input type="text" value={nopKel} onChange={e => setNopKel(e.target.value)} maxLength={3} className={`w-14 px-2 py-2 border border-slate-300 rounded text-center text-sm ${(session as any)?.user?.kodeKelurahan ? "bg-slate-100" : "bg-white"} focus:ring-2 focus:ring-purple-500 outline-none`} readOnly={!!(session as any)?.user?.kodeKelurahan} />
                <input type="text" value={nopBlok} onChange={e => setNopBlok(e.target.value)} maxLength={3} required placeholder="000" className="w-14 px-2 py-2 border border-slate-300 rounded text-center text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" value={nopUrut} onChange={e => setNopUrut(e.target.value)} maxLength={4} required placeholder="0000" className="w-16 px-2 py-2 border border-slate-300 rounded text-center text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" value={nopJenis} onChange={e => setNopJenis(e.target.value)} maxLength={1} required placeholder="0" className="w-10 px-2 py-2 border border-slate-300 rounded text-center text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Rincian Data Bangunan</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">No Bangunan <span className="text-red-500">*</span></label>
                <input type="number" required value={noBangunan} onChange={e => setNoBangunan(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Bangunan <span className="text-red-500">*</span></label>
                <select required value={jenisBangunan} onChange={e => setJenisBangunan(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Luas Bangunan <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <input type="number" required value={luasBangunan} onChange={e => setLuasBangunan(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-l focus:ring-2 focus:ring-purple-500 outline-none" />
                  <span className="px-4 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r text-slate-600 font-medium">M²</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Lantai</label>
                <input type="number" value={jumlahLantai} onChange={e => setJumlahLantai(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tahun Dibangun</label>
                <input type="number" value={tahunDibangun} onChange={e => setTahunDibangun(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tahun Renovasi</label>
                <input type="number" value={tahunRenovasi} onChange={e => setTahunRenovasi(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Daya Listrik <span className="text-red-500">*</span></label>
                <input type="text" required value={dayaListrik} onChange={e => setDayaListrik(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kondisi Bangunan <span className="text-red-500">*</span></label>
                <select required value={kondisiBangunan} onChange={e => setKondisiBangunan(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Kondisi Bangunan</option>
                  <option value="Sangat Baik">Sangat Baik</option>
                  <option value="Baik">Baik</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Jelek">Jelek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Konstruksi <span className="text-red-500">*</span></label>
                <select required value={konstruksi} onChange={e => setKonstruksi(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Konstruksi</option>
                  <option value="Baja">Baja</option>
                  <option value="Beton">Beton</option>
                  <option value="Batu Bata">Batu Bata</option>
                  <option value="Kayu">Kayu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Atap <span className="text-red-500">*</span></label>
                <select required value={atap} onChange={e => setAtap(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Atap</option>
                  <option value="Decrabond/Beton/Genting Glazur">Decrabond/Beton/Genting Glazur</option>
                  <option value="Genting Beton/Aluminium">Genting Beton/Aluminium</option>
                  <option value="Genting Biasa/Sirap">Genting Biasa/Sirap</option>
                  <option value="Asbes">Asbes</option>
                  <option value="Seng">Seng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Dinding <span className="text-red-500">*</span></label>
                <select required value={dinding} onChange={e => setDinding(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lantai <span className="text-red-500">*</span></label>
                <select required value={lantai} onChange={e => setLantai(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">Pilih Lantai</option>
                  <option value="Marmer">Marmer</option>
                  <option value="Keramik">Keramik</option>
                  <option value="Teraso">Teraso</option>
                  <option value="Ubin PC/Papan">Ubin PC/Papan</option>
                  <option value="Semen">Semen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Langit-langit <span className="text-red-500">*</span></label>
                <select required value={langitLangit} onChange={e => setLangitLangit(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-purple-500 outline-none">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={saving}
            className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-white border-2 border-[#00557e] text-[#00557e] hover:bg-slate-50 font-bold rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
          >
            {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Simpan Data
          </button>
          {!isVerified ? (
            <button
              type="button"
              onClick={handleSaveAndVerify}
              disabled={saving}
              className="w-full sm:w-auto justify-center px-4 sm:px-6 py-3 bg-[#00557e] hover:bg-[#004466] text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-70 flex items-center text-base sm:text-lg"
            >
              {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
              Simpan & Verifikasi
            </button>
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
    </div>
  );
}
