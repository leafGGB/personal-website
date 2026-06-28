import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
}

export default function Field({ label, value, onChange, type = "text", multiline, rows }: FieldProps) {
  const cls = "glass-input w-full px-3 py-2.5 text-sm";
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
      {multiline ? (
        <textarea className={cls} rows={rows || 3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
