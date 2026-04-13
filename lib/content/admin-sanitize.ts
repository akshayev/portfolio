import {
  adminTableConfig,
  type AdminFieldDefinition,
  type AdminTableName,
} from "@/lib/content/admin-config";
import { normalizeExternalUrl } from "@/utils/url";

function sanitizeDate(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function sanitizeByType(field: AdminFieldDefinition, raw: unknown): unknown {
  switch (field.type) {
    case "text":
    case "textarea": {
      if (typeof raw !== "string") {
        return field.required ? "" : null;
      }

      const value = raw.trim();
      return value || (field.required ? "" : null);
    }
    case "url": {
      if (typeof raw !== "string") {
        return null;
      }

      const value = raw.trim();

      if (!value) {
        return null;
      }

      return normalizeExternalUrl(value);
    }
    case "number": {
      if (typeof raw === "number") {
        return Number.isFinite(raw) ? raw : 0;
      }

      if (typeof raw === "string") {
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : 0;
      }

      return 0;
    }
    case "date": {
      return sanitizeDate(raw);
    }
    case "checkbox": {
      if (typeof raw === "boolean") {
        return raw;
      }

      if (typeof raw === "string") {
        return raw === "true";
      }

      return false;
    }
    case "string-array": {
      if (Array.isArray(raw)) {
        return raw
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      if (typeof raw === "string") {
        return raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [];
    }
    default: {
      return null;
    }
  }
}

export function sanitizeAdminValues(
  table: AdminTableName,
  incoming: Record<string, unknown>,
  mode: "create" | "update",
): Record<string, unknown> {
  const config = adminTableConfig[table];
  const output: Record<string, unknown> = mode === "create" ? { ...config.createDefaults } : {};

  for (const field of config.fields) {
    if (mode === "update" && !(field.key in incoming)) {
      continue;
    }

    output[field.key] = sanitizeByType(field, incoming[field.key]);
  }

  if (mode === "create") {
    for (const field of config.fields) {
      if (!field.required) {
        continue;
      }

      const value = output[field.key];

      if ((typeof value === "string" && !value.trim()) || value === null || value === undefined) {
        throw new Error(`${field.label} is required.`);
      }
    }
  }

  return output;
}
