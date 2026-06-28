import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import adminNav from "../../data/admin-nav.json";

export default function AdminLayout() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) nav("/admin/login", { replace: true });
  }, [nav]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 flex-shrink-0 border-r border-[var(--color-border)] p-6 flex flex-col">
        <Link to="/admin" className="font-display text-sm font-bold tracking-tight mb-8 text-[var(--color-text)]">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg)] text-[9px] font-bold">&#9674;</span>
            管理后台
          </span>
        </Link>

        <nav className="flex-1 space-y-1">
          {adminNav.map((item: { to: string; label: string }) => (
            <Link key={item.to} to={item.to} className={`block px-3 py-2 rounded-lg text-sm transition-all ${pathname === item.to ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-accent-soft)]"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="text-xs text-[var(--color-text-tertiary)] hover:text-red-400 transition-colors mt-4">
          退出登录
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}