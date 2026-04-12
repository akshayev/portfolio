"use client";

import { useActionState, type ReactNode } from "react";
import type { Tables } from "@/types/supabase";
import type { AdminActionState } from "@/lib/admin/action-state";
import { initialAdminActionState } from "@/lib/admin/action-state";
import {
  deleteAboutSection,
  deleteCertification,
  deleteContactSettings,
  deleteEducation,
  deleteExperience,
  deleteGlobalVisualSettings,
  deleteHeroSection,
  deleteSiteSettings,
  deleteSkill,
  deleteSocialLink,
  saveAboutSection,
  saveCertification,
  saveContactSettings,
  saveEducation,
  saveExperience,
  saveGlobalVisualSettings,
  saveHeroSection,
  saveSiteSettings,
  saveSkill,
  saveSocialLink,
} from "@/app/admin/actions";
import {
  AdminActionRow,
  AdminDangerButton,
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

function DeleteRecordForm({
  action,
  recordId,
  label,
}: {
  action: AdminServerAction;
  recordId: string;
  label: string;
}) {
  const [state, formAction] = useActionState(action, initialAdminActionState);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-red-200 bg-red-50/40 p-4">
      <input type="hidden" name="id" value={recordId} />
      <AdminFormFeedback state={state} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-red-700">{label}</p>
        <AdminDangerButton label="Delete record" />
      </div>
    </form>
  );
}

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

function withDelete({
  canDelete,
  recordId,
  action,
}: {
  canDelete: boolean;
  recordId: string | null;
  action: AdminServerAction;
}) {
  if (!recordId || !canDelete) {
    return null;
  }

  return (
    <DeleteRecordForm
      action={action}
      recordId={recordId}
      label="Delete permanently. This cannot be undone."
    />
  );
}

export function SiteSettingsForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"site_settings"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const seoDefaultsValue =
    initial?.seo_defaults === null || initial?.seo_defaults === undefined
      ? ""
      : JSON.stringify(initial.seo_defaults, null, 2);
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveSiteSettings}
        submitLabel={isUpdate ? "Update Site Settings" : "Create Site Settings"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
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
      {withDelete({ canDelete, recordId, action: deleteSiteSettings })}
    </div>
  );
}

export function HeroSectionForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"hero_sections"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveHeroSection}
        submitLabel={isUpdate ? "Update Hero Section" : "Create Hero Section"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Headline" name="headline" required defaultValue={initial?.headline ?? ""} />
        <AdminTextarea label="Subheadline" name="subheadline" rows={4} defaultValue={initial?.subheadline ?? ""} />
        <AdminInput label="CTA Text" name="cta_text" defaultValue={initial?.cta_text ?? ""} />
        <AdminInput label="CTA Link" name="cta_link" type="url" defaultValue={initial?.cta_link ?? ""} />
        <AdminSwitch label="Is Active" name="is_active" defaultChecked={initial?.is_active ?? true} />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteHeroSection })}
    </div>
  );
}

export function AboutSectionForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"about_sections"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveAboutSection}
        submitLabel={isUpdate ? "Update About Section" : "Create About Section"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Title" name="title" required defaultValue={initial?.title ?? ""} />
        <AdminTextarea label="Content" name="content" required rows={8} defaultValue={initial?.content ?? ""} />
        <AdminInput label="Image URL" name="image_url" type="url" defaultValue={initial?.image_url ?? ""} />
        <AdminSwitch label="Is Active" name="is_active" defaultChecked={initial?.is_active ?? true} />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteAboutSection })}
    </div>
  );
}

export function SkillForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"skills"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveSkill}
        submitLabel={isUpdate ? "Update Skill" : "Create Skill"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
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
      {withDelete({ canDelete, recordId, action: deleteSkill })}
    </div>
  );
}

export function ExperienceForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"experiences"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveExperience}
        submitLabel={isUpdate ? "Update Experience" : "Create Experience"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Company Name" name="company_name" required defaultValue={initial?.company_name ?? ""} />
        <AdminInput label="Role Title" name="role_title" required defaultValue={initial?.role_title ?? ""} />
        <AdminTextarea label="Description" name="description" rows={6} defaultValue={initial?.description ?? ""} />
        <AdminInput label="Start Date" name="start_date" type="date" required defaultValue={initial?.start_date ?? ""} />
        <AdminInput label="End Date" name="end_date" type="date" defaultValue={initial?.end_date ?? ""} />
        <AdminSwitch label="Currently Working Here" name="is_current" defaultChecked={initial?.is_current ?? false} />
        <AdminInput
          label="Display Order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={initial?.display_order ?? 0}
        />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteExperience })}
    </div>
  );
}

export function EducationForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"education"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveEducation}
        submitLabel={isUpdate ? "Update Education" : "Create Education"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput
          label="Institution Name"
          name="institution_name"
          required
          defaultValue={initial?.institution_name ?? ""}
        />
        <AdminInput label="Degree" name="degree" required defaultValue={initial?.degree ?? ""} />
        <AdminInput label="Field of Study" name="field_of_study" defaultValue={initial?.field_of_study ?? ""} />
        <AdminInput label="Start Date" name="start_date" type="date" defaultValue={initial?.start_date ?? ""} />
        <AdminInput label="End Date" name="end_date" type="date" defaultValue={initial?.end_date ?? ""} />
        <AdminInput
          label="Display Order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={initial?.display_order ?? 0}
        />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteEducation })}
    </div>
  );
}

export function CertificationForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"certifications"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveCertification}
        submitLabel={isUpdate ? "Update Certification" : "Create Certification"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Certification Name" name="name" required defaultValue={initial?.name ?? ""} />
        <AdminInput label="Issuer" name="issuer" required defaultValue={initial?.issuer ?? ""} />
        <AdminInput label="Issue Date" name="issue_date" type="date" defaultValue={initial?.issue_date ?? ""} />
        <AdminInput
          label="Credential URL"
          name="credential_url"
          type="url"
          defaultValue={initial?.credential_url ?? ""}
        />
        <AdminInput
          label="Display Order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={initial?.display_order ?? 0}
        />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteCertification })}
    </div>
  );
}

export function ContactSettingsForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"contact_settings"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveContactSettings}
        submitLabel={isUpdate ? "Update Contact Settings" : "Create Contact Settings"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Email" name="email" type="email" required defaultValue={initial?.email ?? ""} />
        <AdminInput label="Phone" name="phone" defaultValue={initial?.phone ?? ""} />
        <AdminInput label="WhatsApp" name="whatsapp" defaultValue={initial?.whatsapp ?? ""} />
        <AdminInput
          label="Display Order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={initial?.display_order ?? 0}
        />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteContactSettings })}
    </div>
  );
}

export function SocialLinkForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"social_links"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveSocialLink}
        submitLabel={isUpdate ? "Update Social Link" : "Create Social Link"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        <AdminInput label="Platform" name="platform" required defaultValue={initial?.platform ?? ""} />
        <AdminInput label="URL" name="url" type="url" required defaultValue={initial?.url ?? ""} />
        <AdminInput label="Icon URL" name="icon_url" type="url" defaultValue={initial?.icon_url ?? ""} />
        <AdminInput
          label="Display Order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={initial?.display_order ?? 0}
        />
      </CmsForm>
      {withDelete({ canDelete, recordId, action: deleteSocialLink })}
    </div>
  );
}

export function GlobalVisualSettingsForm({
  initial,
  canDelete = false,
}: {
  initial: Tables<"global_visual_settings"> | null;
  canDelete?: boolean;
}) {
  const recordId = initial?.id ?? null;
  const isUpdate = Boolean(recordId);

  return (
    <div className="space-y-3">
      <CmsForm
        action={saveGlobalVisualSettings}
        submitLabel={isUpdate ? "Update Visual Settings" : "Create Visual Settings"}
        helperText={isUpdate ? "Editing existing record." : "Creating new record."}
      >
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
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
      {withDelete({ canDelete, recordId, action: deleteGlobalVisualSettings })}
    </div>
  );
}

