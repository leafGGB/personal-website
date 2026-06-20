import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api/client";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiPost<{ access_token: string }>("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.access_token);
      nav("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-sm p-8 md:p-10"
        style={{ borderRadius: 20 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <h1 className="font-display text-xl font-bold">Admin Login</h1>
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-4 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-3 py-2.5 text-sm"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-3 py-2.5 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-medium text-sm hover:brightness-110 transition-all disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
