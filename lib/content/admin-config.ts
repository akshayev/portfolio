export const adminTableNames = [
  "hero",
  "about",
  "settings",
  "skills",
  "experience",
  "education",
  "projects",
  "publications",
  "certifications",
] as const;

export type AdminTableName = (typeof adminTableNames)[number];

export type AdminFieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "date"
  | "checkbox"
  | "string-array"
  | "image";

export type AdminFieldDefinition = {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  placeholder?: string;
};

export type AdminTableConfig = {
  title: string;
  singleton: boolean;
  fields: AdminFieldDefinition[];
  createDefaults: Record<string, unknown>;
};

export const adminTableConfig: Record<AdminTableName, AdminTableConfig> = {
  hero: {
    title: "Hero",
    singleton: true,
    fields: [
      { key: "headline", label: "Headline", type: "textarea", required: true },
      { key: "subheadline", label: "Subheadline", type: "textarea", required: true },
      { key: "cta_label", label: "CTA Label", type: "text", required: true },
      { key: "cta_url", label: "CTA URL", type: "url", required: true },
      { key: "portrait_url", label: "Portrait Image", type: "image" },
    ],
    createDefaults: {
      headline: "",
      subheadline: "",
      cta_label: "",
      cta_url: "",
      portrait_url: null,
    },
  },
  about: {
    title: "About",
    singleton: true,
    fields: [
      { key: "bio", label: "Bio", type: "textarea", required: true },
      { key: "location", label: "Location", type: "text" },
    ],
    createDefaults: {
      bio: "",
      location: null,
    },
  },
  settings: {
    title: "Settings",
    singleton: true,
    fields: [
      { key: "site_title", label: "Site Title", type: "text", required: true },
      { key: "site_tagline", label: "Site Tagline", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "contact_email", label: "Contact Email", type: "text" },
      { key: "contact_phone", label: "Contact Phone", type: "text" },
      { key: "social_github", label: "GitHub", type: "url" },
      { key: "social_linkedin", label: "LinkedIn", type: "url" },
      { key: "social_x", label: "X", type: "url" },
      { key: "visual_glow_strength", label: "Glow Strength", type: "number" },
      { key: "visual_grain_opacity", label: "Grain Opacity", type: "number" },
    ],
    createDefaults: {
      site_title: "",
      site_tagline: null,
      location: null,
      contact_email: null,
      contact_phone: null,
      social_github: null,
      social_linkedin: null,
      social_x: null,
      visual_glow_strength: 0.75,
      visual_grain_opacity: 0.14,
    },
  },
  skills: {
    title: "Skills",
    singleton: false,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      name: "",
      description: null,
      position: 100,
    },
  },
  experience: {
    title: "Experience",
    singleton: false,
    fields: [
      { key: "company", label: "Company", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "link_url", label: "Company URL", type: "url" },
      { key: "start_date", label: "Start Date", type: "date" },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      company: "",
      role: "",
      location: null,
      link_url: null,
      start_date: null,
      end_date: null,
      summary: null,
      position: 100,
    },
  },
  education: {
    title: "Education",
    singleton: false,
    fields: [
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "field_of_study", label: "Field", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "start_date", label: "Start Date", type: "date" },
      { key: "end_date", label: "End Date", type: "date" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      institution: "",
      degree: "",
      field_of_study: null,
      location: null,
      start_date: null,
      end_date: null,
      summary: null,
      position: 100,
    },
  },
  projects: {
    title: "Projects",
    singleton: false,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "tech_stack", label: "Tech Stack", type: "string-array" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "media_type", label: "Media Type", type: "text" },
      { key: "thumbnail_url", label: "Thumbnail URL", type: "url" },
      { key: "project_url", label: "Project URL", type: "url" },
      { key: "repo_url", label: "Repo URL", type: "url" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      title: "",
      summary: "",
      tech_stack: [],
      featured: false,
      media_type: "image",
      thumbnail_url: null,
      project_url: null,
      repo_url: null,
      position: 100,
    },
  },
  publications: {
    title: "Publications",
    singleton: false,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "publisher", label: "Publisher", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "published_on", label: "Published On", type: "date" },
      { key: "url", label: "URL", type: "url" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      title: "",
      publisher: "",
      summary: null,
      published_on: null,
      url: null,
      position: 100,
    },
  },
  certifications: {
    title: "Certifications",
    singleton: false,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text", required: true },
      { key: "issued_on", label: "Issued On", type: "date" },
      { key: "credential_url", label: "Credential URL", type: "url" },
      { key: "position", label: "Position", type: "number" },
    ],
    createDefaults: {
      title: "",
      issuer: "",
      issued_on: null,
      credential_url: null,
      position: 100,
    },
  },
};

export function isAdminTableName(value: string): value is AdminTableName {
  return adminTableNames.includes(value as AdminTableName);
}
