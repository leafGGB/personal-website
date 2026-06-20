import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet, apiDelete } from "../../api/client";

interface JournalPost {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  featured: boolean;
  created_at: string;
}

export default function JournalList() {
  const qc = useQueryClient();
  const { data: posts, isLoading } = useQuery<JournalPost[]>({
    queryKey: ["admin", "journal"],
    queryFn: () => apiGet<JournalPost[]>("/api/journal"),
  });

  const del = useMutation({
    mutationFn: (slug: string) => apiDelete(`/api/journal/${slug}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "journal"] }),
  });

  if (isLoading) return <p className="text-sm text-[var(--color-text-tertiary)]">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <h1 className="font-display text-2xl font-bold">日记管理</h1>
        </div>
        <Link to="/admin/journal/new" className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all">
          + 新建日记
        </Link>
      </div>

      <div className="glass-card overflow-hidden" style={{ borderRadius: 16 }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-tertiary)] text-xs">
              <th className="text-left px-5 py-3 font-medium">标题</th>
              <th className="text-left px-5 py-3 font-medium">Slug</th>
              <th className="text-left px-5 py-3 font-medium">标签</th>
              <th className="text-left px-5 py-3 font-medium">精选</th>
              <th className="text-right px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-accent-soft)] transition-colors">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium">{p.title}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-secondary)] font-mono text-xs">{p.slug}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {p.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="tag-pill text-[10px]">{t}</span>
                    ))}
                    {(p.tags?.length || 0) > 3 && <span className="text-[var(--color-text-tertiary)] text-xs">+{p.tags!.length - 3}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5">{p.featured ? <span className="tag-pill text-[10px]">精选</span> : <span className="text-[var(--color-text-tertiary)] text-xs">否</span>}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link to={`/admin/journal/${p.slug}/edit`} className="text-xs text-[var(--color-accent)] hover:underline mr-4">编辑</Link>
                  <button onClick={() => { if (confirm("确定删除？")) del.mutate(p.slug); }} className="text-xs text-red-400 hover:underline" disabled={del.isPending}>
                    {del.isPending ? "删除中..." : "删除"}
                  </button>
                </td>
              </tr>
            ))}
            {!posts?.length && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-[var(--color-text-tertiary)]">暂无日记</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
