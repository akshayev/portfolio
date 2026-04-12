"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import type { AdminActionState } from "@/lib/admin/action-state";

type BaseFieldProps = {
  label: string;
  name: string;
  required?: boolean;
};

export function AdminInput({
  label,
  name,
  required,
  ...props
}: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  required,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <textarea
        name={name}
        required={required}
        className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

export function AdminSelect({
  label,
  name,
  options,
  required,
  ...props
}: BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: SelectOption[];
  }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminSwitch({
  label,
  name,
  defaultChecked,
}: BaseFieldProps & {
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          name={name}
          value="true"
          defaultChecked={defaultChecked}
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
        />
        <input type="hidden" name={name} value="false" />
      </span>
    </label>
  );
}

export function AdminFormFeedback({ state }: { state: AdminActionState }) {
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0);
  if (state.status === "idle" && !hasFieldErrors) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border px-3 py-2 text-sm ${
        state.status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
      aria-live="polite"
    >
      {state.message ? <p>{state.message}</p> : null}
      {hasFieldErrors ? (
        <ul className="mt-2 list-disc pl-5">
          {Object.entries(state.fieldErrors ?? {}).map(([field, errors]) =>
            errors?.map((error) => (
              <li key={`${field}-${error}`}>
                <span className="font-medium">{field}</span>: {error}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export function AdminActionRow({
  submitLabel = "Save changes",
  children,
}: {
  submitLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <div className="text-xs text-slate-500">{children}</div>
      <SubmitButton label={submitLabel} />
    </div>
  );
}

