"use client";

import type { ReactNode } from "react";

import { trackExternalClick } from "@/utils/analytics";

type ExternalLinkProps = {
  href: string | null;
  label: string;
  section: string;
  className?: string;
  children: ReactNode;
};

export function ExternalLink({ href, label, section, className, children }: ExternalLinkProps) {
  if (!href) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackExternalClick(section, label, href)}
    >
      {children}
    </a>
  );
}
