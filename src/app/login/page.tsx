"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, MessageCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Username atau password salah");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-100/60 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-200 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">DataEntry</h1>
          <p className="text-slate-500 font-medium">Silakan masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00557e]/50 focus:border-[#00557e] transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-700 text-sm font-semibold">Password</label>
              <a 
                href="https://wa.me/6285156123059?text=Halo%20Admin,%20saya%20lupa%20password%20akun%20DataEntry%20saya" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-[#00557e] hover:text-[#00334c] font-medium transition-colors"
              >
                Lupa password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00557e]/50 focus:border-[#00557e] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#00557e] text-white font-bold rounded-xl shadow-md hover:bg-[#004466] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00557e] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
          
          {error && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-500 mb-3">Masih kesulitan masuk?</p>
              <a 
                href="https://wa.me/6285156123059?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20aplikasi%20DataEntry" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-full py-3 px-4 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Hubungi Admin via WhatsApp
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
