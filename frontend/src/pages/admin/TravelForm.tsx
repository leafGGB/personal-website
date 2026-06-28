import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../../api/client";
import Field from "../../components/admin/Field";

export default function TravelForm() {
  const nav = useNavigate();
  const { slug } = useParams();
  const isEdit = !!slug;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", title_zh: "", slug: "", location_name: "", location_name_zh: "",
    latitude: "0", longitude: "0", date_visited: "",
    description: "", description_zh: "", content: "", content_zh: "",
    images: "", tags: "", featured: false,
  });

  useEffect(() => {
    if (isEdit) {
      apiGet<any>(`/api/travel/${slug}`).then((d) => {
        setForm({
          title: d.title, title_zh: d.title_zh || "", slug: d.slug,
          location_name: d.location_name, location_name_zh: d.location_name_zh || "",
          latitude: String(d.latitude), longitude: String(d.longitude),
          date_visited: d.date_visited || "",
          description: d.description, description_zh: d.description_zh || "",
          content: d.content, content_zh: d.content_zh || "",
          images: (d.images || []).join(", "),
          tags: (d.tags || []).join(", "),
          featured: d.featured,
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
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        images: form.images.split(",").map((s: string) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await apiPut(`/api/travel/${slug}`, body);
      } else {
        await apiPost("/api/travel", body);
      }
      nav("/admin/travel");
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
        <h1 className="font-display text-2xl font-bold">{isEdit ? "编辑旅行" : "新建旅行"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-4" style={{ borderRadius: 16 }}>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="标题" value={form.title} onChange={(v) => set("title", v)} />
          <Field label="中文标题" value={form.title_zh} onChange={(v) => set("title_zh", v)} />
          <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
          <Field label="地点" value={form.location_name} onChange={(v) => set("location_name", v)} />
          <Field label="中文地点" value={form.location_name_zh} onChange={(v) => set("location_name_zh", v)} />
          <Field label="访问日期" value={form.date_visited} onChange={(v) => set("date_visited", v)} />
          <Field label="纬度" type="number" value={form.latitude} onChange={(v) => set("latitude", v)} />
          <Field label="经度" type="number" value={form.longitude} onChange={(v) => set("longitude", v)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="描述" value={form.description} onChange={(v) => set("description", v)} multiline />
          <Field label="中文描述" value={form.description_zh} onChange={(v) => set("description_zh", v)} multiline />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="内容 (Markdown)" value={form.content} onChange={(v) => set("content", v)} multiline rows={6} />
          <Field label="中文内容" value={form.content_zh} onChange={(v) => set("content_zh", v)} multiline rows={6} />
        </div>
        <Field label="图片 URL（逗号分隔）" value={form.images} onChange={(v) => set("images", v)} />
        <Field label="标签（逗号分隔）" value={form.tags} onChange={(v) => set("tags", v)} />
        <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
          精选旅行
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {loading ? "保存中..." : "保存"}
          </button>
          <button type="button" onClick={() => nav("/admin/travel")} className="px-5 py-2.5 rounded-xl glass-btn text-sm font-medium text-[var(--color-text-secondary)]">
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

