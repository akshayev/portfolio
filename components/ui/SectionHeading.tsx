type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300/85">{eyebrow}</p>
      <h2 className="font-serif text-3xl leading-tight text-zinc-50 sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-zinc-300">{description}</p> : null}
    </div>
  );
}
