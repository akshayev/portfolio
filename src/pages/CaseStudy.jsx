import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

/* ── animation presets ── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function CaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectData = useStore((state) => state.projectData);

  /* ── resolve record from JSON schema ── */
  const record =
    projectData?.projects?.find((p) => p.id === id) ||
    projectData?.experience?.find((e) => e.id === id) ||
    projectData?.education?.find((e) => e.id === id) ||
    projectData?.creative?.find((c) => c.id === id) ||
    null;

  const stop = projectData?.timeline_stops?.find((s) => s.source_id === id) || null;

  const title = record?.title || record?.role || id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const category = record?.category || stop?.source_type || 'Project';
  const description = record?.description || 'Details coming soon.';
  const techStack = record?.tech_stack || [];
  const githubLink = record?.github_link || null;
  const dateRange = record?.date_range || null;
  const institution = record?.institution || record?.company || record?.organization || null;

  return (
    <motion.div
      id="case-study-page"
      className="relative min-h-screen text-white"
      style={{ background: 'linear-gradient(180deg, #355C7D 0%, #2a4a66 50%, #1e3650 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 px-6 py-5 sm:px-10 lg:px-16"
        style={{
          background: 'rgba(53, 92, 125, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          id="back-to-timeline"
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to Timeline
        </button>
      </div>

      {/* ── Hero section ── */}
      <motion.div
        className="mx-auto max-w-4xl px-6 pt-12 pb-8 sm:px-10 sm:pt-16 lg:px-16"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.p {...fadeUp} className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF7582]">
          {category}
        </motion.p>

        <motion.h1
          {...fadeUp}
          className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>

        {(dateRange || institution) && (
          <motion.p {...fadeUp} className="mt-4 text-sm text-white/60">
            {[institution, dateRange].filter(Boolean).join(' · ')}
          </motion.p>
        )}

        {/* ── Action buttons ── */}
        {githubLink && (
          <motion.div {...fadeUp} className="mt-6 flex flex-wrap gap-3">
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Code size={16} />
              View Source
            </a>
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 117, 130, 0.15)',
                border: '1px solid rgba(255, 117, 130, 0.4)',
                color: '#FF7582',
              }}
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          </motion.div>
        )}
      </motion.div>

      {/* ── Content Card ── */}
      <motion.div
        className="mx-auto max-w-4xl px-6 pb-20 sm:px-10 lg:px-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className="rounded-2xl p-8 sm:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 18px 60px rgba(0, 0, 0, 0.22)',
          }}
        >
          {/* Description */}
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Overview
          </h2>
          <p className="text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#C56C86]/30 bg-[#C56C86]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#C56C86]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for future content */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Deep Dive
            </h2>
            <div className="space-y-3">
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/8" />
              <div className="h-3 w-full animate-pulse rounded bg-white/8" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-white/8" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-white/8" />
            </div>
            <p className="mt-6 text-xs text-white/40">
              Full case study content will be loaded from the CMS once the data layer is connected.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
