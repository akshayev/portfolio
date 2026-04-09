import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import TimelineContent from './components/TimelineContent';
import CVButton from './components/CVButton';
import CaseStudy from './pages/CaseStudy';
import useScrollTracker from './hooks/useScrollTracker';
import useStore from './store/useStore';

/**
 * React.lazy splits PortfolioCanvas (and its ~957kB Three.js/R3F chunk) into a
 * separate network request. The browser downloads and executes it only after the
 * initial page paint — the user sees the Loader immediately instead of a blank
 * screen while JS is being parsed.
 *
 * The dynamic import path must be a static string literal for Vite's bundler to
 * trace and split the chunk at build time.
 */
const PortfolioCanvas = lazy(() => import('./canvas/PortfolioCanvas'));

/* ─────────────────────────────────────────────
 * Home — the main timeline scroll experience
 * ───────────────────────────────────────────── */
function Home() {
  const isLoaded = useStore((state) => state.isLoaded);
  const projectData = useStore((state) => state.projectData);
  const stops = projectData?.timeline_stops || [];
  const initializeProjectData = useStore((state) => state.initializeProjectData);
  useScrollTracker();

  /* Kick off async Supabase fetch on first mount */
  useEffect(() => {
    initializeProjectData();
  }, [initializeProjectData]);

  /* Wait for data before rendering the 3D experience */
  if (!projectData) {
    return (
      <div className="relative min-h-screen bg-[#355C7D] text-white">
        <Loader key="data-loader" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#355C7D] text-white">
      {/*
       * AnimatePresence lets Loader play its exit animation before unmounting.
       * The <Suspense> fallback (Loader) fires while the Three.js chunk loads.
       * Once the chunk resolves AND PortfolioCanvas calls onReady(), isLoaded
       * flips to true and AnimatePresence triggers the exit transition.
       */}
      <AnimatePresence mode="wait">
        {!isLoaded ? <Loader key="loader" /> : null}
      </AnimatePresence>

      <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/*
         * Suspense boundary: while the lazy chunk is in-flight, Loader is shown
         * via AnimatePresence above. Once the chunk resolves, PortfolioCanvas
         * mounts and calls onReady() → isLoaded = true → Loader exits.
         */}
        <Suspense fallback={null}>
          <PortfolioCanvas />
        </Suspense>

        <TimelineContent />

        <main className="relative z-10 min-h-screen">
          <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/70">
                Innovative Software Developer
              </p>
              <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
                Agentic AI Systems
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                A procedural 3D portfolio experience for CityPulse AI, Job Seeker AI Agent, and future
                case studies.
              </p>
            </div>
          </section>
        </main>

        {/* Scroll spacer — creates the native scroll depth that drives the camera. */}
        <div
          aria-hidden="true"
          className="relative z-10 w-full"
          style={{ height: `${(stops.length + 1) * 100}vh` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * App — Router shell with global UI elements
 * ───────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <CVButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<CaseStudy />} />
      </Routes>
    </>
  );
}
