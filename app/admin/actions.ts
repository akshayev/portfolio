"use server";

import type { AdminActionState } from "@/lib/admin/action-state";
import { getValidationErrorState } from "@/lib/admin/action-state";
import { runAdminDelete, runAdminMutation } from "@/lib/admin/mutations";
import {
  parseCertificationFormData,
  parseContactSettingsFormData,
  parseEducationFormData,
  parseExperienceFormData,
  extractRecordId,
  parseOptionalRecordId,
  parseAboutSectionFormData,
  parseGlobalVisualSettingsFormData,
  parseHeroSectionFormData,
  parseSocialLinkFormData,
  parseSiteSettingsFormData,
  parseSkillFormData,
} from "@/lib/admin/schemas";

function toValidationState(result: { error: { flatten: () => { fieldErrors: Record<string, string[]> } } }) {
  return getValidationErrorState(result.error.flatten().fieldErrors);
}

function getSaveRecordId(formData: FormData): {
  id: string | null;
  errorState: AdminActionState | null;
} {
  const parsed = parseOptionalRecordId(formData);
  if (parsed.error) {
    return {
      id: null,
      errorState: {
        status: "error",
        message: parsed.error,
        fieldErrors: {},
      },
    };
  }

  return {
    id: parsed.id,
    errorState: null,
  };
}

export async function saveSiteSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseSiteSettingsFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "site_settings",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Site settings saved.",
    revalidatePaths: ["/admin/settings/site", "/"],
  });
}

export async function saveHeroSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseHeroSectionFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "hero_sections",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Hero section saved.",
    revalidatePaths: ["/admin/hero", "/"],
  });
}

export async function saveAboutSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseAboutSectionFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "about_sections",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "About section saved.",
    revalidatePaths: ["/admin/about", "/"],
  });
}

export async function saveSkill(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseSkillFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "skills",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Skill saved.",
    revalidatePaths: ["/admin/skills", "/"],
  });
}

export async function saveGlobalVisualSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseGlobalVisualSettingsFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "global_visual_settings",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Visual settings saved.",
    revalidatePaths: ["/admin/settings/visual", "/"],
  });
}

export async function saveExperience(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseExperienceFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "experiences",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Experience saved.",
    revalidatePaths: ["/admin/experience", "/"],
  });
}

export async function saveEducation(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseEducationFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "education",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Education saved.",
    revalidatePaths: ["/admin/education", "/"],
  });
}

export async function saveCertification(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseCertificationFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "certifications",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Certification saved.",
    revalidatePaths: ["/admin/certifications", "/"],
  });
}

export async function saveContactSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseContactSettingsFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "contact_settings",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Contact settings saved.",
    revalidatePaths: ["/admin/settings/contact", "/"],
  });
}

export async function saveSocialLink(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = getSaveRecordId(formData);
  if (recordId.errorState) {
    return recordId.errorState;
  }

  const parsed = parseSocialLinkFormData(formData);
  if (!parsed.success) {
    return toValidationState(parsed);
  }

  return runAdminMutation({
    table: "social_links",
    payload: parsed.data,
    recordId: recordId.id,
    successMessage: "Social link saved.",
    revalidatePaths: ["/admin/settings/social", "/"],
  });
}

function invalidDeleteState(): AdminActionState {
  return {
    status: "error",
    message: "Invalid record identifier.",
    fieldErrors: {},
  };
}

export async function deleteSiteSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "site_settings",
    recordId,
    successMessage: "Site settings deleted.",
    revalidatePaths: ["/admin/settings/site", "/"],
  });
}

export async function deleteHeroSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "hero_sections",
    recordId,
    successMessage: "Hero section deleted.",
    revalidatePaths: ["/admin/hero", "/"],
  });
}

export async function deleteAboutSection(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "about_sections",
    recordId,
    successMessage: "About section deleted.",
    revalidatePaths: ["/admin/about", "/"],
  });
}

export async function deleteSkill(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "skills",
    recordId,
    successMessage: "Skill deleted.",
    revalidatePaths: ["/admin/skills", "/"],
  });
}

export async function deleteGlobalVisualSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "global_visual_settings",
    recordId,
    successMessage: "Visual settings deleted.",
    revalidatePaths: ["/admin/settings/visual", "/"],
  });
}

export async function deleteExperience(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "experiences",
    recordId,
    successMessage: "Experience deleted.",
    revalidatePaths: ["/admin/experience", "/"],
  });
}

export async function deleteEducation(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "education",
    recordId,
    successMessage: "Education deleted.",
    revalidatePaths: ["/admin/education", "/"],
  });
}

export async function deleteCertification(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "certifications",
    recordId,
    successMessage: "Certification deleted.",
    revalidatePaths: ["/admin/certifications", "/"],
  });
}

export async function deleteContactSettings(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "contact_settings",
    recordId,
    successMessage: "Contact settings deleted.",
    revalidatePaths: ["/admin/settings/contact", "/"],
  });
}

export async function deleteSocialLink(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const recordId = extractRecordId(formData);
  if (!recordId) {
    return invalidDeleteState();
  }

  return runAdminDelete({
    table: "social_links",
    recordId,
    successMessage: "Social link deleted.",
    revalidatePaths: ["/admin/settings/social", "/"],
  });
}
