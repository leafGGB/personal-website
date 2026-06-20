import { Link } from "react-router-dom";

const CARDS = [
  { to: "/admin/messages", label: "留言管理", desc: "查看访客留言" },
  { to: "/admin/projects", label: "项目管理", desc: "管理工作项目" },
  { to: "/admin/travel", label: "旅行管理", desc: "管理旅行记录" },
  { to: "/admin/journal", label: "日记管理", desc: "管理日记文章" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        <h1 className="font-display text-2xl font-bold">控制台</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="glass-card-interactive p-6"
            style={{ borderRadius: 16, display: "block" }}
          >
            <h2 className="font-display text-lg font-bold text-[var(--color-text)] mb-1">
              {c.label}
            </h2>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
