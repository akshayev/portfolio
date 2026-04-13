"use client";

import { trackEvent } from "@/utils/analytics";
import { ExternalLink } from "@/components/public/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { SettingsContent } from "@/lib/content/types";

type ContactSectionProps = {
  settings: SettingsContent | null;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const socials = [
    { label: "GitHub", href: settings?.social_github ?? null },
    { label: "LinkedIn", href: settings?.social_linkedin ?? null },
    { label: "X", href: settings?.social_x ?? null },
  ];

  return (
    <section id="contact" className="space-y-6">
      <SectionHeading
        eyebrow="Connect"
        title="Contact"
        description="Open to product engineering, platform architecture, and leadership opportunities."
      />
      <SurfaceCard>
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Email</p>
            {settings?.contact_email ? (
              <a
                href={`mailto:${settings.contact_email}`}
                className="mt-2 inline-block font-serif text-2xl text-zinc-50 hover:text-amber-100"
                onClick={() =>
                  trackEvent("contact_click", {
                    method: "email",
                    value: settings.contact_email,
                  })
                }
              >
                {settings.contact_email}
              </a>
            ) : (
              <p className="mt-2 text-zinc-300">Not available</p>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Social</p>
            <ul className="mt-3 space-y-2 text-zinc-200">
              {socials.map((social) => (
                <li key={social.label}>
                  <ExternalLink
                    href={social.href}
                    label={social.label}
                    section="contact"
                    className="hover:text-amber-100"
                  >
                    {social.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SurfaceCard>
    </section>
  );
}
