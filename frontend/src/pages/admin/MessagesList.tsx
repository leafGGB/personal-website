import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiDelete, apiRequest } from "../../api/client";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesList() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: msgs, isLoading } = useQuery<Message[]>({
    queryKey: ["admin", "messages"],
    queryFn: () => apiGet<Message[]>("/api/messages"),
    refetchInterval: 10000,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/messages/${id}/read`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });

  const unread = msgs?.filter((m) => !m.read).length || 0;

  if (isLoading) return <p className="text-sm text-[var(--color-text-tertiary)]">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <h1 className="font-display text-2xl font-bold">留言管理</h1>
          {unread > 0 && (
            <span className="tag-pill text-[10px] bg-red-500/20 text-red-400 border-0">
              {unread} 条未读
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {msgs?.map((m) => {
          const open = expanded === m.id;
          return (
            <div
              key={m.id}
              className={`glass-card p-5 transition-all duration-300 ${!m.read ? "ring-1 ring-[var(--color-accent)]/20" : ""}`}
              style={{ borderRadius: 14 }}
            >
              <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(open ? null : m.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${m.read ? "bg-transparent" : "bg-[var(--color-accent)]"}`} />
                    <span className="font-medium text-sm text-[var(--color-text)] truncate">{m.name}</span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">{m.email}</span>
                  </div>
                  <p className={`text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 ${open ? "line-clamp-none" : ""}`}>
                    {m.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {open && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center gap-3">
                  {!m.read && (
                    <button
                      onClick={() => markRead.mutate(m.id)}
                      className="text-xs text-[var(--color-accent)] hover:underline"
                      disabled={markRead.isPending}
                    >
                      标为已读
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm("确定删除这条留言？")) del.mutate(m.id); }}
                    className="text-xs text-red-400 hover:underline"
                    disabled={del.isPending}
                  >
                    {del.isPending ? "删除中..." : "删除"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {!msgs?.length && (
          <div className="glass-card p-8 text-center text-xs text-[var(--color-text-tertiary)]" style={{ borderRadius: 14 }}>
            暂无留言
          </div>
        )}
      </div>
    </div>
  );
}
