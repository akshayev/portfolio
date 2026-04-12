import { createClient } from "@/utils/supabase/server";

type SectionVisibility = {
  hero?: boolean;
  about?: boolean;
  skills?: boolean;
  experience?: boolean;
  education?: boolean;
  certifications?: boolean;
  contactSocial?: boolean;
};

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonthYear(value: string | null): string {
  if (!value) {
    return "";
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return monthYearFormatter.format(parsed);
}

function compareDateDesc(a: string | null, b: string | null): number {
  const aTime = a ? Date.parse(`${a}T00:00:00Z`) : Number.NEGATIVE_INFINITY;
  const bTime = b ? Date.parse(`${b}T00:00:00Z`) : Number.NEGATIVE_INFINITY;
  return bTime - aTime;
}

function readSectionVisibility(value: unknown): SectionVisibility {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const source = value as Record<string, unknown>;
  const sectionsRaw = source.sections;
  const sections =
    sectionsRaw && typeof sectionsRaw === "object" && !Array.isArray(sectionsRaw)
      ? (sectionsRaw as Record<string, unknown>)
      : source;

  return {
    hero: typeof sections.hero === "boolean" ? sections.hero : undefined,
    about: typeof sections.about === "boolean" ? sections.about : undefined,
    skills: typeof sections.skills === "boolean" ? sections.skills : undefined,
    experience: typeof sections.experience === "boolean" ? sections.experience : undefined,
    education: typeof sections.education === "boolean" ? sections.education : undefined,
    certifications: typeof sections.certifications === "boolean" ? sections.certifications : undefined,
    contactSocial:
      typeof sections.contactSocial === "boolean"
        ? sections.contactSocial
        : typeof sections.contact_social === "boolean"
          ? sections.contact_social
          : typeof sections.contact === "boolean"
            ? sections.contact
            : undefined,
  };
}

export default async function Home() {
  const supabase = await createClient();
  const [
    { data: siteSettings },
    { data: heroSections },
    { data: aboutSections },
    { data: skills },
    { data: experiences },
    { data: education },
    { data: certifications },
    { data: contactSettings },
    { data: socialLinks },
    { data: visualSettings },
  ] = await Promise.all([
    supabase.from("site_settings").select("*").order("created_at", { ascending: true }).limit(1),
    supabase
      .from("hero_sections")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1),
    supabase
      .from("about_sections")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1),
    supabase.from("skills").select("*").order("created_at", { ascending: false }),
    supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("education")
      .select("*")
      .order("start_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("contact_settings")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(1),
    supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("global_visual_settings").select("*").order("created_at", { ascending: true }).limit(1),
  ]);

  const site = siteSettings?.[0] ?? null;
  const hero = heroSections?.[0] ?? null;
  const about = aboutSections?.[0] ?? null;
  const contact = contactSettings?.[0] ?? null;
  const visual = visualSettings?.[0] ?? null;
  const visibility = readSectionVisibility(site?.seo_defaults);
  const showHero = (visibility.hero ?? true) && (hero?.is_active ?? true);
  const showAbout = (visibility.about ?? true) && (about?.is_active ?? true);
  const showSkills = visibility.skills ?? true;
  const showExperience = visibility.experience ?? true;
  const showEducation = visibility.education ?? true;
  const showCertifications = visibility.certifications ?? true;
  const showContactSocial = visibility.contactSocial ?? true;
  const orderedSkills = [...(skills ?? [])].sort((a, b) => {
    const aSortOrder =
      "sort_order" in (a as object) && typeof (a as { sort_order?: number | null }).sort_order === "number"
        ? ((a as { sort_order?: number | null }).sort_order ?? Number.MAX_SAFE_INTEGER)
        : (a.display_order ?? Number.MAX_SAFE_INTEGER);
    const bSortOrder =
      "sort_order" in (b as object) && typeof (b as { sort_order?: number | null }).sort_order === "number"
        ? ((b as { sort_order?: number | null }).sort_order ?? Number.MAX_SAFE_INTEGER)
        : (b.display_order ?? Number.MAX_SAFE_INTEGER);

    if (aSortOrder !== bSortOrder) {
      return aSortOrder - bSortOrder;
    }

    const aCreatedAt = a.created_at ? Date.parse(a.created_at) : Number.NEGATIVE_INFINITY;
    const bCreatedAt = b.created_at ? Date.parse(b.created_at) : Number.NEGATIVE_INFINITY;
    return bCreatedAt - aCreatedAt;
  });
  const orderedExperiences = [...(experiences ?? [])].sort((a, b) => {
    const dateCompare = compareDateDesc(a.start_date, b.start_date);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    const aCreatedAt = a.created_at ? Date.parse(a.created_at) : Number.NEGATIVE_INFINITY;
    const bCreatedAt = b.created_at ? Date.parse(b.created_at) : Number.NEGATIVE_INFINITY;
    return bCreatedAt - aCreatedAt;
  });
  const orderedEducation = [...(education ?? [])].sort((a, b) => {
    const dateCompare = compareDateDesc(a.start_date, b.start_date);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    const aCreatedAt = a.created_at ? Date.parse(a.created_at) : Number.NEGATIVE_INFINITY;
    const bCreatedAt = b.created_at ? Date.parse(b.created_at) : Number.NEGATIVE_INFINITY;
    return bCreatedAt - aCreatedAt;
  });
  const orderedCertifications = [...(certifications ?? [])].sort((a, b) => {
    const dateCompare = compareDateDesc(a.issue_date, b.issue_date);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    const aCreatedAt = a.created_at ? Date.parse(a.created_at) : Number.NEGATIVE_INFINITY;
    const bCreatedAt = b.created_at ? Date.parse(b.created_at) : Number.NEGATIVE_INFINITY;
    return bCreatedAt - aCreatedAt;
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-8 py-20 px-8 bg-white dark:bg-black sm:px-16">
        {showHero ? (
          <section className="space-y-3">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {hero?.headline ?? site?.title ?? "Portfolio"}
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {hero?.subheadline ?? site?.tagline ?? "Content coming soon."}
            </p>
            {hero?.cta_text && hero?.cta_link ? (
              <a
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                href={hero.cta_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hero.cta_text}
              </a>
            ) : null}
          </section>
        ) : null}

        {showAbout ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">About</h2>
            <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200">{about?.title ?? "About me"}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{about?.content ?? "No about content yet."}</p>
          </section>
        ) : null}

        {showSkills ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Skills</h2>
            {orderedSkills.length > 0 ? (
              <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                {orderedSkills.map((skill) => (
                  <li key={skill.id}>
                    {skill.name} ({skill.category})
                    {typeof skill.proficiency_level === "number" ? ` - ${skill.proficiency_level}%` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No skills listed yet.</p>
            )}
          </section>
        ) : null}

        {showExperience ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Experience</h2>
            {orderedExperiences.length > 0 ? (
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                {orderedExperiences.map((item) => (
                  <li key={item.id}>
                    <p className="font-medium">{item.role_title} @ {item.company_name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatMonthYear(item.start_date)} - {item.is_current ? "Present" : (formatMonthYear(item.end_date) || "")}
                    </p>
                    {item.description ? <p>{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No experience records yet.</p>
            )}
          </section>
        ) : null}

        {showEducation ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Education</h2>
            {orderedEducation.length > 0 ? (
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                {orderedEducation.map((item) => (
                  <li key={item.id}>
                    <p className="font-medium">{item.degree} - {item.institution_name}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatMonthYear(item.start_date)} - {formatMonthYear(item.end_date)}
                    </p>
                    {item.field_of_study ? <p className="text-sm">{item.field_of_study}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No education records yet.</p>
            )}
          </section>
        ) : null}

        {showCertifications ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Certifications</h2>
            {orderedCertifications.length > 0 ? (
              <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                {orderedCertifications.map((item) => (
                  <li key={item.id}>
                    {item.credential_url ? (
                      <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="underline">
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                    {` - ${item.issuer}`}
                    {item.issue_date ? ` (${formatMonthYear(item.issue_date)})` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No certifications yet.</p>
            )}
          </section>
        ) : null}

        {showContactSocial ? (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Contact & Social</h2>
            <p className="text-zinc-700 dark:text-zinc-300">Email: {contact?.email ?? "Not provided"}</p>
            <p className="text-zinc-700 dark:text-zinc-300">Phone: {contact?.phone ?? "Not provided"}</p>
            <p className="text-zinc-700 dark:text-zinc-300">WhatsApp: {contact?.whatsapp ?? "Not provided"}</p>
            {socialLinks && socialLinks.length > 0 ? (
              <ul className="space-y-1">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-zinc-700 underline dark:text-zinc-300">
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No social links yet.</p>
            )}
          </section>
        ) : null}

        <section className="space-y-1 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p>Visual: {visual?.animation_intensity ?? "medium"} intensity</p>
          <p>Mobile Effects: {visual?.mobile_effects_mode ?? "adaptive"}</p>
        </section>
      </main>
    </div>
  );
}
