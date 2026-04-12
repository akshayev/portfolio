import { z } from "zod";
import { Constants, type Json, type TablesInsert } from "@/types/supabase";

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`);

const nullableText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`)
    .transform((value) => (value.length === 0 ? null : value));

const nullableUrl = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .refine((value) => value === null || URL.canParse(value), {
    message: "Please enter a valid URL",
  });

const booleanFromForm = z.enum(["true", "false"]).transform((value) => value === "true");

const nullableInteger = (label: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? null : Number(value)))
    .refine((value) => value === null || Number.isInteger(value), {
      message: `${label} must be a whole number`,
    });

const nonNegativeIntegerWithDefaultZero = (label: string) =>
  z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? 0 : Number(value)))
    .refine((value) => Number.isInteger(value) && value >= 0, {
      message: `${label} must be a non-negative whole number`,
    });

const seoDefaultsFromJson = z.string().trim().transform((value, ctx): Json | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Json;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    ctx.addIssue({
      code: "custom",
      message: "SEO defaults must be a valid JSON object",
    });
    return z.NEVER;
  } catch {
    ctx.addIssue({
      code: "custom",
      message: "SEO defaults must be valid JSON",
    });
    return z.NEVER;
  }
});

const animationIntensitySchema = z.enum(Constants.public.Enums.animation_intensity);
const mobileEffectsModeSchema = z.enum(Constants.public.Enums.mobile_effects_mode);

export type SiteSettingsPayload = Pick<
  TablesInsert<"site_settings">,
  "name" | "title" | "tagline" | "resume_url" | "seo_defaults"
>;

export type HeroSectionPayload = Pick<
  TablesInsert<"hero_sections">,
  "headline" | "subheadline" | "cta_text" | "cta_link" | "is_active"
>;

export type AboutSectionPayload = Pick<
  TablesInsert<"about_sections">,
  "title" | "content" | "image_url" | "is_active"
>;

export type SkillPayload = Pick<
  TablesInsert<"skills">,
  "name" | "category" | "icon_url" | "proficiency_level" | "display_order"
>;

export type GlobalVisualSettingsPayload = Pick<
  TablesInsert<"global_visual_settings">,
  | "sounds_enabled"
  | "heavy_3d_enabled"
  | "preloader_enabled"
  | "animation_intensity"
  | "mobile_effects_mode"
>;

export const siteSettingsSchema: z.ZodType<SiteSettingsPayload> = z.object({
  name: requiredText("Name", 120),
  title: requiredText("Title", 160),
  tagline: nullableText("Tagline", 240),
  resume_url: nullableUrl,
  seo_defaults: seoDefaultsFromJson,
});

export const heroSectionSchema: z.ZodType<HeroSectionPayload> = z.object({
  headline: requiredText("Headline", 200),
  subheadline: nullableText("Subheadline", 400),
  cta_text: nullableText("CTA text", 120),
  cta_link: nullableUrl,
  is_active: booleanFromForm,
});

export const aboutSectionSchema: z.ZodType<AboutSectionPayload> = z.object({
  title: requiredText("Title", 160),
  content: requiredText("Content", 5000),
  image_url: nullableUrl,
  is_active: booleanFromForm,
});

export const skillSchema: z.ZodType<SkillPayload> = z.object({
  name: requiredText("Skill name", 120),
  category: requiredText("Category", 120),
  icon_url: nullableUrl,
  proficiency_level: nullableInteger("Proficiency level").refine(
    (value) => value === null || (value >= 0 && value <= 100),
    "Proficiency level must be between 0 and 100"
  ),
  display_order: nonNegativeIntegerWithDefaultZero("Display order"),
});

export const globalVisualSettingsSchema: z.ZodType<GlobalVisualSettingsPayload> = z.object({
  sounds_enabled: booleanFromForm,
  heavy_3d_enabled: booleanFromForm,
  preloader_enabled: booleanFromForm,
  animation_intensity: animationIntensitySchema,
  mobile_effects_mode: mobileEffectsModeSchema,
});

const recordIdSchema = z.string().uuid();

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readSwitch(formData: FormData, name: string): "true" | "false" {
  const value = readText(formData, name).toLowerCase();
  return value === "true" || value === "on" ? "true" : "false";
}

export function extractRecordId(formData: FormData): string | null {
  const candidate = readText(formData, "id").trim();
  if (!candidate) {
    return null;
  }

  const parsed = recordIdSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export function parseSiteSettingsFormData(formData: FormData) {
  return siteSettingsSchema.safeParse({
    name: readText(formData, "name"),
    title: readText(formData, "title"),
    tagline: readText(formData, "tagline"),
    resume_url: readText(formData, "resume_url"),
    seo_defaults: readText(formData, "seo_defaults"),
  });
}

export function parseHeroSectionFormData(formData: FormData) {
  return heroSectionSchema.safeParse({
    headline: readText(formData, "headline"),
    subheadline: readText(formData, "subheadline"),
    cta_text: readText(formData, "cta_text"),
    cta_link: readText(formData, "cta_link"),
    is_active: readSwitch(formData, "is_active"),
  });
}

export function parseAboutSectionFormData(formData: FormData) {
  return aboutSectionSchema.safeParse({
    title: readText(formData, "title"),
    content: readText(formData, "content"),
    image_url: readText(formData, "image_url"),
    is_active: readSwitch(formData, "is_active"),
  });
}

export function parseSkillFormData(formData: FormData) {
  return skillSchema.safeParse({
    name: readText(formData, "name"),
    category: readText(formData, "category"),
    icon_url: readText(formData, "icon_url"),
    proficiency_level: readText(formData, "proficiency_level"),
    display_order: readText(formData, "display_order"),
  });
}

export function parseGlobalVisualSettingsFormData(formData: FormData) {
  return globalVisualSettingsSchema.safeParse({
    sounds_enabled: readSwitch(formData, "sounds_enabled"),
    heavy_3d_enabled: readSwitch(formData, "heavy_3d_enabled"),
    preloader_enabled: readSwitch(formData, "preloader_enabled"),
    animation_intensity: readText(formData, "animation_intensity"),
    mobile_effects_mode: readText(formData, "mobile_effects_mode"),
  });
}

