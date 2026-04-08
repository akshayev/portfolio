import { AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import TimelineContent from './components/TimelineContent';
import useScrollTracker from './hooks/useScrollTracker';
import useStore from './store/useStore';
import PortfolioCanvas from './canvas/PortfolioCanvas';

export default function App() {
  const isLoaded = useStore((state) => state.isLoaded);
  const stops = useStore((state) => state.projectData?.timeline_stops || []);
  useScrollTracker();

  return (
    <div className="relative min-h-screen bg-[#355C7D] text-white">
      <AnimatePresence mode="wait">
        {!isLoaded ? <Loader key="loader" /> : null}
      </AnimatePresence>

      <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <PortfolioCanvas />
        <TimelineContent />

        <main className="relative z-10 min-h-screen">
          <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-16">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/70">Innovative Software Developer</p>
              <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
                Agentic AI Systems
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                A procedural 3D portfolio experience for CityPulse AI, Job Seeker AI Agent, and future case studies.
              </p>
            </div>
          </section>
        </main>

        <div
          aria-hidden="true"
          className="relative z-10 w-full"
          style={{ height: `${(stops.length + 1) * 100}vh` }}
        />
      </div>
    </div>
  );
}
