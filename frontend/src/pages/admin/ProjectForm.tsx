import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../../api/client";
import Field from "../../components/admin/Field";

export default function ProjectForm() {
  const nav = useNavigate();
  const { slug } = useParams();
  const isEdit = !!slug;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", title_zh: "", slug: "", description: "",
    content: "", tech_stack: "", images: "", live_url: "",
    github_url: "", featured: false, sort_order: 0,
  });

  useEffect(() => {
    if (isEdit) {
      apiGet<any>(`/api/projects/${slug}`).then((d) => {
        setForm({
          title: d.title, title_zh: d.title_zh || "", slug: d.slug,
          description: d.description, content: d.content,
          tech_stack: (d.tech_stack || []).join(", "),
          images: (d.images || []).join(", "),
          live_url: d.live_url || "", github_url: d.github_url || "",
          featured: d.featured, sort_order: d.sort_order,
        });
      });
    }
  }, [isEdit, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        ...form,
        tech_stack: form.tech_stack ? form.tech_stack.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await apiPut(`/api/projects/${slug}`, body);
      } else {
        await apiPost("/api/projects", body);
      }
      nav("/admin/projects");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        <h1 className="font-display text-2xl font-bold">{isEdit ? "编辑项目" : "新建项目"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-4" style={{ borderRadius: 16 }}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="标题" value={form.title} onChange={(v) => set("title", v)} />
          <Field label="中文标题" value={form.title_zh} onChange={(v) => set("title_zh", v)} />
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Field label="排序值" type="number" value={String(form.sort_order)} onChange={(v) => set("sort_order", Number(v))} />
          <Field label="在线 URL" value={form.live_url} onChange={(v) => set("live_url", v)} />
          <Field label="GitHub URL" value={form.github_url} onChange={(v) => set("github_url", v)} />
        </div>
        <Field label="描述" value={form.description} onChange={(v) => set("description", v)} multiline />
        <Field label="内容 (Markdown)" value={form.content} onChange={(v) => set("content", v)} multiline rows={6} />
        <Field label="技术栈（逗号分隔）" value={form.tech_stack} onChange={(v) => set("tech_stack", v)} />
        <Field label="图片 URL（逗号分隔）" value={form.images} onChange={(v) => set("images", v)} />
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
          精选项目
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {loading ? "保存中..." : "保存"}
          </button>
          <button type="button" onClick={() => nav("/admin/projects")} className="px-5 py-2.5 rounded-xl glass-btn text-sm font-medium text-[var(--color-text-secondary)]">
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

