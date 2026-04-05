"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Login gagal");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      {/* Ghost watermark */}
      <p
        className="fixed bottom-0 right-0 font-cinzel text-[18rem] leading-none text-black/[0.03] select-none pointer-events-none tracking-tighter"
        aria-hidden
      >
        W
      </p>

      <div className="w-full max-w-sm relative z-10">

        {/* Header */}
        <div className="mb-10">
          <p className="font-cinzel text-[9px] uppercase tracking-[0.5em] text-accent font-bold mb-3">
            Wanpicture Studio
          </p>
          <h1 className="font-cinzel text-3xl text-black tracking-tight leading-tight">
            ADMIN<br />PANEL
          </h1>
          <div className="w-10 h-[2px] bg-accent mt-4" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-cinzel text-[9px] tracking-[0.4em] uppercase text-black/35 mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-black/20 focus:outline-none transition-colors bg-white"
            />
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-400 text-[10px] font-cinzel tracking-widest uppercase">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-accent disabled:bg-black/20 text-white font-cinzel text-[10px] tracking-[0.4em] uppercase py-4 transition-all duration-300"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-black/20 text-[9px] uppercase tracking-widest font-cinzel text-center mt-8">
          © {new Date().getFullYear()} Wanpicture Studio
        </p>
      </div>
    </div>
  );
}