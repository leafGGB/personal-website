import { Link } from "react-router-dom";
import dashboardCards from "../../data/dashboard-cards.json";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        <h1 className="font-display text-2xl font-bold">控制台</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((c: { to: string; label: string; desc: string }) => (
          <Link
            key={c.to}
            to={c.to}
            className="glass-card-interactive glass-depth-deep p-6"
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