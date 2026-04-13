"use client";

import { useEffect, useMemo, useState } from "react";

import {
  adminTableConfig,
  adminTableNames,
  type AdminFieldDefinition,
  type AdminTableName,
} from "@/lib/content/admin-config";

type AdminPanelProps = {
  initialTable?: AdminTableName;
};

type JsonRecord = Record<string, unknown>;

type TableResponse = {
  ok?: boolean;
  items?: unknown;
  error?: unknown;
};

function coerceString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getItemId(item: JsonRecord): string | null {
  const value = item.id;
  return typeof value === "string" && value ? value : null;
}

function toFormValue(field: AdminFieldDefinition, value: unknown): string | boolean {
  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (field.type === "string-array") {
    if (Array.isArray(value)) {
      return value.filter((entry): entry is string => typeof entry === "string").join(", ");
    }

    return "";
  }

  if (field.type === "number") {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    return "";
  }

  if (field.type === "date") {
    if (typeof value === "string" && value) {
      return value.slice(0, 10);
    }

    return "";
  }

  return typeof value === "string" ? value : "";
}

function fromFormValue(field: AdminFieldDefinition, value: string | boolean): unknown {
  if (field.type === "checkbox") {
    return Boolean(value);
  }

  if (typeof value !== "string") {
    return "";
  }

  return value;
}

function createDraft(table: AdminTableName, item: JsonRecord | null): JsonRecord {
  const config = adminTableConfig[table];
  const draft: JsonRecord = { ...config.createDefaults };

  if (!item) {
    return draft;
  }

  for (const field of config.fields) {
    draft[field.key] = field.key in item ? item[field.key] : config.createDefaults[field.key];
  }

  return draft;
}

function itemLabel(table: AdminTableName, item: JsonRecord): string {
  if (typeof item.title === "string" && item.title.trim()) {
    return item.title;
  }

  if (typeof item.name === "string" && item.name.trim()) {
    return item.name;
  }

  if (typeof item.company === "string" && item.company.trim()) {
    return item.company;
  }

  if (adminTableConfig[table].singleton) {
    return "Singleton record";
  }

  return getItemId(item) ?? "Untitled";
}

export function AdminPanel({ initialTable = "hero" }: AdminPanelProps) {
  const [table, setTable] = useState<AdminTableName>(initialTable);
  const [items, setItems] = useState<JsonRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<JsonRecord>(createDraft(initialTable, null));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = useMemo(() => adminTableConfig[table], [table]);

  const loadTable = async (targetTable: AdminTableName) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/${targetTable}`, {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as TableResponse;

      if (!response.ok || !Array.isArray(payload.items)) {
        throw new Error(coerceString(payload.error) || "Unable to load records.");
      }

      const nextItems = payload.items.filter(
        (item): item is JsonRecord => typeof item === "object" && item !== null && !Array.isArray(item),
      );

      setItems(nextItems);

      if (!nextItems.length) {
        setSelectedId(null);
        setDraft(createDraft(targetTable, null));
        return;
      }

      const first = nextItems[0];
      const id = getItemId(first);

      setSelectedId(id);
      setDraft(createDraft(targetTable, first));
    } catch (loadError) {
      const text = loadError instanceof Error ? loadError.message : "Failed to load";
      setError(text);
      setItems([]);
      setSelectedId(null);
      setDraft(createDraft(targetTable, null));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTable(table);
  }, [table]);

  const onSelectItem = (item: JsonRecord) => {
    const id = getItemId(item);
    setSelectedId(id);
    setDraft(createDraft(table, item));
    setMessage(null);
    setError(null);
  };

  const onCreateNew = () => {
    setSelectedId(null);
    setDraft(createDraft(table, null));
    setMessage(null);
    setError(null);
  };

  const onFieldChange = (field: AdminFieldDefinition, value: string | boolean) => {
    setDraft((previous) => ({
      ...previous,
      [field.key]: fromFormValue(field, value),
    }));
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const isEditing = Boolean(selectedId);
      const endpoint = isEditing ? `/api/admin/${table}?id=${selectedId}` : `/api/admin/${table}`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ values: draft }),
      });

      const payload = (await response.json()) as { error?: unknown };

      if (!response.ok) {
        throw new Error(coerceString(payload.error) || "Save failed.");
      }

      setMessage(isEditing ? "Record updated." : "Record created.");
      await loadTable(table);
    } catch (saveError) {
      const text = saveError instanceof Error ? saveError.message : "Failed to save";
      setError(text);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selectedId) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/${table}?id=${selectedId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { error?: unknown };

      if (!response.ok) {
        throw new Error(coerceString(payload.error) || "Delete failed.");
      }

      setMessage("Record deleted.");
      await loadTable(table);
    } catch (deleteError) {
      const text = deleteError instanceof Error ? deleteError.message : "Failed to delete";
      setError(text);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {adminTableNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTable(name)}
            className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
              name === table
                ? "border-amber-300/80 bg-amber-200/90 text-zinc-900"
                : "border-zinc-600/80 text-zinc-300 hover:border-amber-300/60"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <section className="space-y-3 rounded-2xl border border-zinc-700/60 bg-zinc-900/65 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-zinc-100">{config.title}</h2>
            {!config.singleton ? (
              <button
                type="button"
                onClick={onCreateNew}
                className="rounded-full border border-zinc-600/80 px-3 py-1 text-xs uppercase tracking-[0.15em] text-zinc-200 transition hover:border-amber-300/60 hover:text-amber-100"
              >
                New
              </button>
            ) : null}
          </div>

          {loading ? <p className="text-sm text-zinc-400">Loading...</p> : null}

          {!loading && !items.length ? (
            <p className="text-sm text-zinc-400">No records yet.</p>
          ) : null}

          <ul className="space-y-2">
            {items.map((item) => {
              const id = getItemId(item);
              const active = id !== null && id === selectedId;

              return (
                <li key={id ?? JSON.stringify(item)}>
                  <button
                    type="button"
                    onClick={() => onSelectItem(item)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                      active
                        ? "border-amber-300/80 bg-amber-300/15 text-zinc-50"
                        : "border-zinc-700/80 text-zinc-300 hover:border-zinc-500/80"
                    }`}
                  >
                    {itemLabel(table, item)}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-700/60 bg-zinc-900/65 p-4">
          <h2 className="font-serif text-2xl text-zinc-100">
            {selectedId ? "Edit record" : config.singleton ? "Edit singleton" : "Create record"}
          </h2>

          <div className="grid gap-4">
            {config.fields.map((field) => {
              const value = toFormValue(field, draft[field.key]);

              if (field.type === "checkbox") {
                return (
                  <label key={field.key} className="flex items-center gap-3 text-sm text-zinc-200">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) => onFieldChange(field, event.target.checked)}
                      className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                    />
                    {field.label}
                  </label>
                );
              }

              if (field.type === "textarea" || field.type === "string-array") {
                return (
                  <label key={field.key} className="space-y-2 text-sm text-zinc-300">
                    <span>{field.label}</span>
                    <textarea
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => onFieldChange(field, event.target.value)}
                      rows={field.type === "string-array" ? 2 : 4}
                      placeholder={field.type === "string-array" ? "item 1, item 2" : field.placeholder}
                      className="w-full rounded-xl border border-zinc-600 bg-zinc-950/75 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/70"
                    />
                  </label>
                );
              }

              return (
                <label key={field.key} className="space-y-2 text-sm text-zinc-300">
                  <span>{field.label}</span>
                  <input
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onFieldChange(field, event.target.value)}
                    className="w-full rounded-xl border border-zinc-600 bg-zinc-950/75 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/70"
                  />
                </label>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={saving || loading}
              className="rounded-xl border border-amber-300/70 bg-amber-200/95 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:scale-[1.01] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            {!config.singleton && selectedId ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving}
                className="rounded-xl border border-rose-300/70 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-400/10 disabled:opacity-60"
              >
                Delete
              </button>
            ) : null}
          </div>

          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </section>
      </div>
    </div>
  );
}
