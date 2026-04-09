import { Download } from 'lucide-react';

export default function CVButton() {
  return (
    <a
      id="cv-download-button"
      href="/Akshay_EV_Resume.pdf"
      download
      aria-label="Download CV"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full px-5 py-3 font-sans text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(255,117,130,0.45)] active:scale-95"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 117, 130, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Download
        size={18}
        className="text-[#FF7582] transition-transform duration-300 group-hover:translate-y-[2px]"
      />
      <span className="text-[#FF7582]">Download CV</span>
    </a>
  );
}
