import { createClient } from "@/utils/supabase/server";

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
    supabase.from("skills").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("education").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
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

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-8 py-20 px-8 bg-white dark:bg-black sm:px-16">
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

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">About</h2>
          <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200">{about?.title ?? "About me"}</h3>
          <p className="text-zinc-600 dark:text-zinc-400">{about?.content ?? "No about content yet."}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Skills</h2>
          {skills && skills.length > 0 ? (
            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
              {skills.map((skill) => (
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

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Experience</h2>
          {experiences && experiences.length > 0 ? (
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              {experiences.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.role_title} @ {item.company_name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.start_date} - {item.is_current ? "Present" : (item.end_date ?? "")}
                  </p>
                  {item.description ? <p>{item.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">No experience records yet.</p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Education</h2>
          {education && education.length > 0 ? (
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              {education.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.degree} - {item.institution_name}</p>
                  {item.field_of_study ? <p className="text-sm">{item.field_of_study}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">No education records yet.</p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Certifications</h2>
          {certifications && certifications.length > 0 ? (
            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
              {certifications.map((item) => (
                <li key={item.id}>
                  {item.credential_url ? (
                    <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="underline">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                  {` - ${item.issuer}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">No certifications yet.</p>
          )}
        </section>

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

        <section className="space-y-1 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p>Visual: {visual?.animation_intensity ?? "medium"} intensity</p>
          <p>Mobile Effects: {visual?.mobile_effects_mode ?? "adaptive"}</p>
        </section>
      </main>
    </div>
  );
}
