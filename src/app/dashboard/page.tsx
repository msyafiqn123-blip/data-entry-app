"use client";

import { useSession } from "next-auth/react";
import { Users, FileText, CheckCircle, Loader2, Trophy, PlusCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ users: 0, spop: 0, lspop: 0, spopVerified: 0, lspopVerified: 0 });
  const [summary, setSummary] = useState<any[]>([]);
  const [mySpops, setMySpops] = useState<any[]>([]);
  const [myLspops, setMyLspops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN";
  const isVerifikator = session?.user?.role === "VERIFIKATOR";
  const isPendata = !isAdmin && !isVerifikator;
  const myRank = isPendata ? summary.findIndex(item => 
    ((session?.user as any)?.kodeKelurahan && item.kodeKelurahan === (session?.user as any)?.kodeKelurahan && item.kodeKecamatan === (session?.user as any)?.kodeKecamatan) ||
    (session?.user?.username && item.kelurahan.toLowerCase() === session?.user?.username.toLowerCase())
  ) + 1 : null;

  useEffect(() => {
    if (status !== "authenticated") return;

    if (isAdmin) {
      Promise.all([
        fetch("/api/users").then(res => res.ok ? res.json() : []),
        fetch("/api/admin/spop").then(res => res.ok ? res.json() : []),
        fetch("/api/admin/lspop").then(res => res.ok ? res.json() : []),
        fetch("/api/dashboard/summary").then(res => res.ok ? res.json() : []),
      ]).then(([users, spop, lspop, summaryData]) => {
        setStats({
          users: Array.isArray(users) ? users.length : 0,
          spop: summaryData?.totalSpop || 0,
          lspop: summaryData?.totalLspop || 0,
          spopVerified: summaryData?.totalSpopVerified || 0,
          lspopVerified: summaryData?.totalLspopVerified || 0
        });
        setSummary(Array.isArray(summaryData?.regions) ? summaryData.regions : []);
        setLoading(false);
      }).catch(e => {
        console.error(e);
        setLoading(false);
      });
    } else {
      // For Pendata
      Promise.all([
        fetch("/api/spop").then(res => res.ok ? res.json() : []),
        fetch("/api/lspop").then(res => res.ok ? res.json() : []),
        fetch("/api/dashboard/summary").then(res => res.ok ? res.json() : []),
      ]).then(([spop, lspop, summaryData]) => {
        const mySpopData = Array.isArray(spop) ? spop.filter((s:any) => s.userId === session?.user?.id) : [];
        const myLspopData = Array.isArray(lspop) ? lspop.filter((l:any) => l.userId === session?.user?.id) : [];
        
        let spopCount = mySpopData.length;
        let lspopCount = myLspopData.length;
        let spopVerifiedCount = mySpopData.filter((s:any) => s.isVerified).length;
        let lspopVerifiedCount = myLspopData.filter((s:any) => s.isVerified).length;

        if (isAdmin) {
          spopCount = Array.isArray(spop) ? spop.length : 0;
          lspopCount = Array.isArray(lspop) ? lspop.length : 0;
          spopVerifiedCount = Array.isArray(spop) ? spop.filter((s:any) => s.isVerified).length : 0;
          lspopVerifiedCount = Array.isArray(lspop) ? lspop.filter((s:any) => s.isVerified).length : 0;
        } else if (isVerifikator) {
          spopCount = Array.isArray(spop) ? spop.filter((s:any) => !s.isVerified).length : 0;
          lspopCount = Array.isArray(lspop) ? lspop.filter((s:any) => !s.isVerified).length : 0;
          spopVerifiedCount = Array.isArray(spop) ? spop.filter((s:any) => s.verifiedBy === session?.user?.username).length : 0;
          lspopVerifiedCount = Array.isArray(lspop) ? lspop.filter((s:any) => s.verifiedBy === session?.user?.username).length : 0;
        }
        
        setStats({
          users: 0,
          spop: spopCount,
          lspop: lspopCount,
          spopVerified: spopVerifiedCount,
          lspopVerified: lspopVerifiedCount
        });
        setMySpops(mySpopData);
        setMyLspops(myLspopData);
        setSummary(Array.isArray(summaryData?.regions) ? summaryData.regions : []);
        setLoading(false);
      }).catch(e => {
        console.error(e);
        setLoading(false);
      });
    }
  }, [status, isAdmin, session?.user?.id]);

  if (loading || status === "loading") {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00557e]" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow)] border border-[var(--card-border)] relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Halo, {session?.user?.username}!
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Selamat datang kembali di Dashboard {session?.user?.role === "ADMIN" ? "Admin" : session?.user?.role === "VERIFIKATOR" ? "Verifikator" : "Pendata"}.
            {myRank && myRank > 0 ? (
              <div className={`inline-flex items-center gap-3 mt-4 px-4 py-2 rounded-full font-medium border ${
                myRank === 1 ? 'bg-amber-50/50 border-amber-200 text-amber-700' : 
                myRank === 2 ? 'bg-slate-50/50 border-slate-200 text-slate-700' : 
                myRank === 3 ? 'bg-orange-50/50 border-orange-200 text-orange-700' : 
                'bg-[var(--section-bg)] border-[var(--border)] text-[var(--text-secondary)]'
              }`}>
                <span className="text-xl">{myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🚀'}</span>
                <span>Kelurahan Anda saat ini berada di peringkat {myRank} dalam entri data!</span>
              </div>
            ) : null}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-10">
          <FileText className="w-32 h-32 text-[var(--primary)]" />
        </div>
      </div>

      {!isAdmin && session?.user?.role !== "VERIFIKATOR" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/spop" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Isi Data SPOP Baru</h3>
                <p className="text-blue-100 text-sm">Mulai entri data Surat Pemberitahuan Objek Pajak</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
            </div>
          </Link>
          
          <Link href="/dashboard/lspop" className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Isi Data LSPOP Baru</h3>
                <p className="text-purple-100 text-sm">Mulai entri data Lampiran Surat Pemberitahuan</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {isAdmin && (
          <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--card-border)] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] backdrop-blur-md">
            <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[rgba(59,130,246,0.1)] flex items-center justify-center text-[var(--primary-light)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)]">Total Pengguna</p>
              <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">{stats.users}</h3>
            </div>
          </div>
        )}

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--card-border)] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] backdrop-blur-md">
          <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[rgba(168,85,247,0.1)] flex items-center justify-center text-[#c084fc]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)]">{isAdmin ? "SPOP Masuk" : isVerifikator ? "SPOP Menunggu" : "SPOP Anda"}</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">{stats.spop}</h3>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--card-border)] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] backdrop-blur-md">
          <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[rgba(245,158,11,0.1)] flex items-center justify-center text-[#fde68a]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)]">{isAdmin ? "LSPOP Masuk" : isVerifikator ? "LSPOP Menunggu" : "LSPOP Anda"}</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">{stats.lspop}</h3>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--card-border)] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--success)] to-[#34d399] opacity-80"></div>
          <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[var(--success)]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)]">{isVerifikator ? "SPOP Diverifikasi (Saya)" : "SPOP Terverif"}</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">{stats.spopVerified}</h3>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)] border border-[var(--card-border)] flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--success)] to-[#34d399] opacity-80"></div>
          <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[var(--success)]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase text-[var(--text-muted)]">{isVerifikator ? "LSPOP Diverifikasi (Saya)" : "LSPOP Terverif"}</p>
            <h3 className="text-3xl font-extrabold text-[var(--text-primary)]">{stats.lspopVerified}</h3>
          </div>
        </div>
      </div>

      {/* Leaderboard Section (Visible to both Admin and Pendata) */}
      <div className="bg-[var(--card-bg)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--card-border)] overflow-hidden backdrop-blur-md">
        <div className="bg-[var(--section-bg)] px-6 py-5 border-b border-[var(--border)] flex items-center">
            <Trophy className="w-5 h-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Peringkat Entri Data per Kelurahan</h2>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                    <th className="p-4 font-bold">Peringkat</th>
                    <th className="p-4 font-bold border-b border-[var(--border)]">Kecamatan</th>
                    <th className="p-4 font-bold border-b border-[var(--border)]">Kelurahan</th>
                    <th className="p-4 font-bold border-b border-[var(--border)] text-right">SPOP Masuk</th>
                    <th className="p-4 font-bold border-b border-[var(--border)] text-right">Terverifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {summary.slice(0, 3).map((item, index) => {
                    const isMyKelurahan = isPendata && (
                      ((session?.user as any)?.kodeKelurahan && (session?.user as any)?.kodeKelurahan === item.kodeKelurahan && (session?.user as any)?.kodeKecamatan === item.kodeKecamatan) ||
                      (session?.user?.username && item.kelurahan.toLowerCase() === session?.user?.username.toLowerCase())
                    );
                    return (
                      <tr key={index} className={`transition-colors group ${isMyKelurahan ? "bg-[rgba(16,185,129,0.05)] border-l-4 border-[var(--success)]" : "hover:bg-[rgba(59,130,246,0.05)]"}`}>
                        <td className="p-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" :
                            index === 1 ? "bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300" :
                            index === 2 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400" :
                            "bg-[var(--section-bg)] text-[var(--text-muted)]"
                          }`}>
                            {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-[var(--text-secondary)]">
                          {item.kecamatan}
                        </td>
                        <td className="p-4 font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                          {item.kelurahan}
                          {isMyKelurahan && (
                            <span className="text-[10px] bg-[var(--success)] text-white px-2 py-0.5 rounded-full ml-2">Wilayah Anda</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-[var(--primary-light)]">
                          {item.totalInput || 0}
                        </td>
                        <td className="p-4 text-right font-bold text-[var(--success)]">
                          {item.totalVerified || 0}
                        </td>
                      </tr>
                    );
                  })}
                  {summary.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                        Belum ada data rekapan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


    </div>
  );
}
