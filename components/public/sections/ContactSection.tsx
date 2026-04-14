"use client";

import { FormEvent, useMemo, useState } from "react";

import { trackEvent } from "@/utils/analytics";
import { ExternalLink } from "@/components/public/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { SettingsContent } from "@/lib/content/types";

type ContactSectionProps = {
  settings: SettingsContent | null;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const socials = [
    { label: "GitHub", href: settings?.social_github ?? null },
    { label: "LinkedIn", href: settings?.social_linkedin ?? null },
    { label: "X", href: settings?.social_x ?? null },
  ];

  const isSubmitDisabled = useMemo(
    () => loading || !name.trim() || !email.trim() || !message.trim(),
    [email, loading, message, name],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setStatus("idle");
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const payload = (await response.json()) as { error?: unknown };

      if (!response.ok) {
        const error = typeof payload.error === "string" ? payload.error : "submission_failed";

        if (error === "rate_limited" || error === "cooldown_active") {
          setFeedback("Too many attempts. Please wait a moment and try again.");
        } else if (error === "invalid_email") {
          setFeedback("Please enter a valid email address.");
        } else {
          setFeedback("Could not send your message. Please try again.");
        }

        setStatus("error");
        return;
      }

      trackEvent("contact_click", {
        method: "cta-form",
      });

      setStatus("success");
      setFeedback("Message sent. I will get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={onSubmit} className="mt-8 space-y-4 border-t border-zinc-700/60 pt-6">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Send a message</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-zinc-300">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                required
                className="w-full rounded-xl border border-zinc-600 bg-zinc-950/75 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/70"
              />
            </label>

            <label className="space-y-2 text-sm text-zinc-300">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={254}
                required
                className="w-full rounded-xl border border-zinc-600 bg-zinc-950/75 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/70"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-zinc-300">
            <span>Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={4000}
              required
              rows={5}
              className="w-full rounded-xl border border-zinc-600 bg-zinc-950/75 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/70"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="rounded-xl border border-amber-300/70 bg-amber-200/95 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send message"}
            </button>

            {status === "success" && feedback ? <p className="text-sm text-emerald-300">{feedback}</p> : null}
            {status === "error" && feedback ? <p className="text-sm text-rose-300">{feedback}</p> : null}
          </div>
        </form>
      </SurfaceCard>
    </section>
  );
}
