export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[8%] top-[-8%] h-96 w-96 rounded-full bg-amber-500/12 blur-[120px]" />
      <div className="absolute right-[5%] top-[22%] h-[28rem] w-[28rem] rounded-full bg-sky-500/8 blur-[140px]" />
      <div className="absolute bottom-[-16%] left-[36%] h-[26rem] w-[26rem] rounded-full bg-zinc-300/6 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.1),transparent_40%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
    </div>
  );
}
