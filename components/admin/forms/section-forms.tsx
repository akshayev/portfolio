"use client";

import { useActionState, type ReactNode } from "react";
import type { Tables } from "@/types/supabase";
import type { AdminActionState } from "@/lib/admin/action-state";
import { initialAdminActionState } from "@/lib/admin/action-state";
import {
  saveAboutSection,
  saveGlobalVisualSettings,
  saveHeroSection,
  saveSiteSettings,
  saveSkill,
} from "@/app/admin/actions";
import {
  AdminActionRow,
  AdminFormFeedback,
  AdminInput,
  AdminSelect,
  AdminSwitch,
  AdminTextarea,
} from "./primitives";

type AdminServerAction = (
  prevState: AdminActionState,
  formData: FormData
) => Promise<AdminActionState>;

function CmsForm({
  action,
  submitLabel,
  children,
  helperText,
}: {
  action: AdminServerAction;
  submitLabel: string;
  children: ReactNode;
  helperText?: string;
}) {
  const [state, formAction] = useActionState(action, initialAdminActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <AdminFormFeedback state={state} />
      {children}
      <AdminActionRow submitLabel={submitLabel}>{helperText}</AdminActionRow>
    </form>
  );
}

export function SiteSettingsForm({ initial }: { initial: Tables<"site_settings"> | null }) {
  const seoDefaultsValue =
    initial?.seo_defaults === null || initial?.seo_defaults === undefined
      ? ""
      : JSON.stringify(initial.seo_defaults, null, 2);

  return (
    <CmsForm
      action={saveSiteSettings}
      submitLabel="Save Site Settings"
      helperText={initial?.id ? "Updating existing record." : "A new record will be created."}
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <AdminInput label="Name" name="name" required defaultValue={initial?.name ?? ""} />
      <AdminInput label="Title" name="title" required defaultValue={initial?.title ?? ""} />
      <AdminInput label="Tagline" name="tagline" defaultValue={initial?.tagline ?? ""} />
      <AdminInput label="Resume URL" name="resume_url" type="url" defaultValue={initial?.resume_url ?? ""} />
      <AdminTextarea
        label="SEO Defaults (JSON object)"
        name="seo_defaults"
        rows={6}
        defaultValue={seoDefaultsValue}
      />
    </CmsForm>
  );
}

export function HeroSectionForm({ initial }: { initial: Tables<"hero_sections"> | null }) {
  return (
    <CmsForm
      action={saveHeroSection}
      submitLabel="Save Hero Section"
      helperText={initial?.id ? "Updating existing record." : "A new record will be created."}
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <AdminInput label="Headline" name="headline" required defaultValue={initial?.headline ?? ""} />
      <AdminTextarea label="Subheadline" name="subheadline" rows={4} defaultValue={initial?.subheadline ?? ""} />
      <AdminInput label="CTA Text" name="cta_text" defaultValue={initial?.cta_text ?? ""} />
      <AdminInput label="CTA Link" name="cta_link" type="url" defaultValue={initial?.cta_link ?? ""} />
      <AdminSwitch label="Is Active" name="is_active" defaultChecked={initial?.is_active ?? true} />
    </CmsForm>
  );
}

export function AboutSectionForm({ initial }: { initial: Tables<"about_sections"> | null }) {
  return (
    <CmsForm
      action={saveAboutSection}
      submitLabel="Save About Section"
      helperText={initial?.id ? "Updating existing record." : "A new record will be created."}
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <AdminInput label="Title" name="title" required defaultValue={initial?.title ?? ""} />
      <AdminTextarea label="Content" name="content" required rows={8} defaultValue={initial?.content ?? ""} />
      <AdminInput label="Image URL" name="image_url" type="url" defaultValue={initial?.image_url ?? ""} />
      <AdminSwitch label="Is Active" name="is_active" defaultChecked={initial?.is_active ?? true} />
    </CmsForm>
  );
}

export function SkillForm({ initial }: { initial: Tables<"skills"> | null }) {
  return (
    <CmsForm
      action={saveSkill}
      submitLabel="Save Skill"
      helperText={initial?.id ? "Updating existing record." : "A new record will be created."}
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <AdminInput label="Skill Name" name="name" required defaultValue={initial?.name ?? ""} />
      <AdminInput label="Category" name="category" required defaultValue={initial?.category ?? ""} />
      <AdminInput label="Icon URL" name="icon_url" type="url" defaultValue={initial?.icon_url ?? ""} />
      <AdminInput
        label="Proficiency Level (0-100)"
        name="proficiency_level"
        type="number"
        min={0}
        max={100}
        defaultValue={initial?.proficiency_level ?? ""}
      />
      <AdminInput
        label="Display Order"
        name="display_order"
        type="number"
        min={0}
        defaultValue={initial?.display_order ?? 0}
      />
    </CmsForm>
  );
}

export function GlobalVisualSettingsForm({
  initial,
}: {
  initial: Tables<"global_visual_settings"> | null;
}) {
  return (
    <CmsForm
      action={saveGlobalVisualSettings}
      submitLabel="Save Visual Settings"
      helperText={initial?.id ? "Updating existing record." : "A new record will be created."}
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <AdminSwitch
        label="Sounds Enabled"
        name="sounds_enabled"
        defaultChecked={initial?.sounds_enabled ?? false}
      />
      <AdminSwitch
        label="Heavy 3D Enabled"
        name="heavy_3d_enabled"
        defaultChecked={initial?.heavy_3d_enabled ?? false}
      />
      <AdminSwitch
        label="Preloader Enabled"
        name="preloader_enabled"
        defaultChecked={initial?.preloader_enabled ?? true}
      />
      <AdminSelect
        label="Animation Intensity"
        name="animation_intensity"
        defaultValue={initial?.animation_intensity ?? "medium"}
        options={[
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ]}
      />
      <AdminSelect
        label="Mobile Effects Mode"
        name="mobile_effects_mode"
        defaultValue={initial?.mobile_effects_mode ?? "adaptive"}
        options={[
          { value: "adaptive", label: "Adaptive" },
          { value: "reduced", label: "Reduced" },
          { value: "off", label: "Off" },
        ]}
      />
    </CmsForm>
  );
}
