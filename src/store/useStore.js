import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';
import { normalizeScrollProgress } from '../utils/mathUtils';

/* ─────────────────────────────────────────────────────────────
 * Local JSON fallback — used only when Supabase is unreachable
 * or env vars are missing.
 * ─────────────────────────────────────────────────────────── */
import timelineSchemaFallback from '../../files/portfolio-timeline-schema.json';

/**
 * Detects a performance tier at startup using navigator.hardwareConcurrency.
 * - 'low'  : <= 4 logical cores  → reduce geometry, disable AA, fewer particles.
 * - 'high' : > 4 logical cores   → full quality.
 *
 * Falls back to 'low' in environments where the API is unavailable (e.g., some
 * privacy-hardened browsers) so we never over-commit on unknown hardware.
 */
const detectPerformanceTier = () => {
  const cores = navigator?.hardwareConcurrency ?? 0;
  return cores > 4 ? 'high' : 'low';
};

/* ─────────────────────────────────────────────────────────────
 * Supabase data fetcher
 * Aggregates all tables into the same shape as the local JSON,
 * so downstream components (TimelineStops, TimelineContent,
 * CaseStudy, etc.) require zero changes.
 * ─────────────────────────────────────────────────────────── */
async function fetchPortfolioData() {
  if (!supabase) {
    console.warn('[Store] No Supabase client — using local JSON fallback.');
    return timelineSchemaFallback;
  }

  try {
    // The user populated a single, flattened table 'timeline_stops'
    // We fetch it and map it to our internal arrays so the components don't need changes.
    const { data: stopsRow, error } = await supabase
      .from('timeline_stops')
      .select('*')
      .order('z_index', { ascending: true });

    if (error) {
      console.error('[Store] Supabase query error:', error.message);
      console.warn('[Store] Falling back to local JSON.');
      return timelineSchemaFallback;
    }

    if (!stopsRow || stopsRow.length === 0) {
      console.warn('[Store] Supabase table empty or missing, using local JSON.');
      return timelineSchemaFallback;
    }

    const education = [];
    const projects = [];
    const experience = [];
    const creative = [];
    const timeline_stops = [];

    stopsRow.forEach((row) => {
      // 1. Determine base source_type
      let sourceType = 'experience';
      if (row.type === 'project' || row.category === 'AI Agent' || row.category === 'Project') sourceType = 'project';
      else if (row.category === 'Education' || row.type === 'major_milestone') sourceType = 'education';
      else if (row.category === 'Creative') sourceType = 'creative';

      // 2. Build the timeline stop
      timeline_stops.push({
        id: `stop-${row.id}`,
        source_type: sourceType,
        source_id: row.id,
        type: row.type || 'standard',
        label: row.title || 'Untitled',
        z_index: row.z_index || 0,
      });

      // 3. Build the underlying content item
      if (sourceType === 'education') {
        education.push({
          id: row.id,
          title: row.title,
          institution: row.category,
          description: row.description,
          date_range: '',
          type: row.type,
        });
      } else if (sourceType === 'project') {
        projects.push({
          id: row.id,
          title: row.title,
          description: row.description,
          tech_stack: row.tech_stack || [],
          github_link: row.github_url || '',
          category: row.category || 'Project',
        });
      } else if (sourceType === 'creative') {
        creative.push({
          id: row.id,
          role: row.title,
          organization: row.category,
          date_range: '',
          description: row.description,
        });
      } else {
        // Experience
        experience.push({
          id: row.id,
          role: row.title,
          company: row.category,
          date_range: '',
          description: row.description,
        });
      }
    });

    return {
      meta: {
        name: 'Portfolio Timeline (Supabase)',
        version: '2.0.0',
        purpose: 'Live data from Supabase — flattened schema adapter.',
      },
      education,
      projects,
      experience,
      creative,
      timeline_stops,
    };
  } catch (err) {
    console.error('[Store] Failed to fetch from Supabase:', err);
    console.warn('[Store] Falling back to local JSON.');
    return timelineSchemaFallback;
  }
}

/* ─────────────────────────────────────────────────────────────
 * Zustand Store
 * ─────────────────────────────────────────────────────────── */
const useStore = create((set, get) => ({
  isLoaded: false,
  scrollProgress: 0,
  projectData: null,          // starts null — filled by initializeProjectData
  dataSource: 'pending',      // 'supabase' | 'local' | 'pending'

  /**
   * 'low' | 'high'
   * Determined once at module load time — never changes at runtime.
   * Components should read this once (e.g., in useMemo) and not subscribe
   * to updates, as it is static for the lifetime of the session.
   */
  performanceTier: detectPerformanceTier(),

  setIsLoaded: (isLoaded) => {
    if (get().isLoaded === Boolean(isLoaded)) return;
    set({ isLoaded: Boolean(isLoaded) });
  },

  onReady: () => {
    if (get().isLoaded) return;
    set({ isLoaded: true });
  },

  setScrollProgress: (scrollProgress) => {
    const nextScrollProgress = normalizeScrollProgress(scrollProgress);
    if (get().scrollProgress === nextScrollProgress) return;
    set({ scrollProgress: nextScrollProgress });
  },

  setProjectData: (projectData) => {
    set({ projectData: projectData || timelineSchemaFallback });
  },

  /**
   * Async initializer — called once from App on mount.
   * Tries Supabase first, falls back to local JSON.
   */
  initializeProjectData: async () => {
    // Don't re-fetch if we already have data
    if (get().projectData !== null) return;

    const data = await fetchPortfolioData();
    const source = data?.meta?.version === '2.0.0' ? 'supabase' : 'local';
    set({ projectData: data, dataSource: source });

    console.log(`[Store] Portfolio data loaded from: ${source}`);
  },

  /** Legacy sync loader — kept for compatibility */
  loadProjectData: () => {
    set({ projectData: timelineSchemaFallback, dataSource: 'local' });
  },
}));

export default useStore;
