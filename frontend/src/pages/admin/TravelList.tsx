import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../../api/client";

interface TravelPost {
  id: string;
  title: string;
  slug: string;
  location_name: string;
  featured: boolean;
  created_at: string;
}

export default function TravelList() {
  const qc = useQueryClient();
  const { data: posts, isLoading } = useQuery<TravelPost[]>({
    queryKey: ["admin", "travel"],
    queryFn: () => apiGet<TravelPost[]>("/api/travel"),
  });

  const del = useMutation({
    mutationFn: (slug: string) => apiDelete(`/api/travel/${slug}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "travel"] }),
  });

  if (isLoading) return <p className="text-sm text-[var(--color-text-tertiary)]">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <h1 className="font-display text-2xl font-bold">旅行管理</h1>
        </div>
        <Link to="/admin/travel/new" className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all">
          + 新建旅行
        </Link>
      </div>

      <div className="glass-card overflow-hidden" style={{ borderRadius: 16 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-tertiary)] text-xs">
              <th className="text-left px-5 py-3 font-medium">标题</th>
              <th className="text-left px-5 py-3 font-medium">地点</th>
              <th className="text-left px-5 py-3 font-medium">Slug</th>
              <th className="text-left px-5 py-3 font-medium">精选</th>
              <th className="text-right px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-accent-soft)] transition-colors">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium">{p.title}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{p.location_name}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-secondary)] font-mono text-xs">{p.slug}</td>
                <td className="px-5 py-3.5">{p.featured ? <span className="tag-pill text-[10px]">精选</span> : <span className="text-[var(--color-text-tertiary)] text-xs">否</span>}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link to={`/admin/travel/${p.slug}/edit`} className="text-xs text-[var(--color-accent)] hover:underline mr-4">编辑</Link>
                  <button onClick={() => { if (confirm("确定删除？")) del.mutate(p.slug); }} className="text-xs text-red-400 hover:underline" disabled={del.isPending}>
                    {del.isPending ? "删除中..." : "删除"}
                  </button>
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-[var(--color-text-tertiary)]">暂无旅行记录</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
