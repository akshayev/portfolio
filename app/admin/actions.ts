"use server";

import type { AdminActionState } from "@/lib/admin/action-state";
import { getValidationErrorState } from "@/lib/admin/action-state";
import { runAdminMutation } from "@/lib/admin/mutations";
import {
  extractRecordId,
  parseAboutSectionFormData,
  parseGlobalVisualSettingsFormData,
  parseHeroSectionFormData,
  parseSiteSettingsFormData,
  parseSkillFormData,
} from "@/lib/admin/schemas";

function toValidationState(result: { error: { flatten: () => { fieldErrors: Record<string, string[]> } } }) {
  return getValidationErrorState(result.error.flatten().fieldErrors);
}

export async function saveSiteSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseSiteSettingsFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "site_settings",
    payload: parsed.data,
    recordId: extractRecordId(formData),
    successMessage: "Site settings saved.",
    revalidatePaths: ["/admin/settings/site", "/"],
  });
}

export async function saveHeroSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseHeroSectionFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "hero_sections",
    payload: parsed.data,
    recordId: extractRecordId(formData),
    successMessage: "Hero section saved.",
    revalidatePaths: ["/admin/hero", "/"],
  });
}

export async function saveAboutSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseAboutSectionFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "about_sections",
    payload: parsed.data,
    recordId: extractRecordId(formData),
    successMessage: "About section saved.",
    revalidatePaths: ["/admin/about", "/"],
  });
}

export async function saveSkill(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseSkillFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "skills",
    payload: parsed.data,
    recordId: extractRecordId(formData),
    successMessage: "Skill saved.",
    revalidatePaths: ["/admin/skills", "/"],
  });
}

export async function saveGlobalVisualSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseGlobalVisualSettingsFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "global_visual_settings",
    payload: parsed.data,
    recordId: extractRecordId(formData),
    successMessage: "Visual settings saved.",
    revalidatePaths: ["/admin/settings/visual", "/"],
  });
}

