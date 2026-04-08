import { create } from 'zustand';
import timelineSchema from '../../files/portfolio-timeline-schema.json';

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const normalizeScrollProgress = (value) => {
  const clamped = clamp01(Number(value) || 0);
  return Math.round(clamped * 1000) / 1000;
};

const initialProjectData = timelineSchema;

const useStore = create((set, get) => ({
  isLoaded: false,
  scrollProgress: 0,
  projectData: initialProjectData,

  setIsLoaded: (isLoaded) => {
    if (get().isLoaded === Boolean(isLoaded)) {
      return;
    }

    set({ isLoaded: Boolean(isLoaded) });
  },

  onReady: () => {
    if (get().isLoaded) {
      return;
    }

    set({ isLoaded: true });
  },

  setScrollProgress: (scrollProgress) => {
    const nextScrollProgress = normalizeScrollProgress(scrollProgress);

    if (get().scrollProgress === nextScrollProgress) {
      return;
    }

    set({ scrollProgress: nextScrollProgress });
  },

  setProjectData: (projectData) => {
    set({ projectData: projectData || initialProjectData });
  },

  loadProjectData: () => {
    set({ projectData: timelineSchema });
  },
}));

export default useStore;
