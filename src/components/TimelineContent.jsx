import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import useStore from '../store/useStore';

const ACTIVE_THRESHOLD = 0.16;

const getZIndex = (stop, fallback = 0) => {
  const parsed = Number(stop?.z_index);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveStopRecord = (data, stop) => {
  if (!data || !stop) {
    return null;
  }

  const dataKey = stop.source_type === 'project' ? 'projects' : stop.source_type;
  const collection = data[dataKey] || [];
  return collection.find((item) => item.id === stop.source_id) || null;
};

const resolveTitle = (stop, record) => record?.title || stop?.label || record?.role || 'Timeline Stop';

const resolveSubtitle = (stop, record) => {
  if (stop?.source_type === 'project') {
    return record?.category || 'AI Project';
  }

  if (stop?.source_type === 'experience') {
    return [record?.role, record?.company].filter(Boolean).join(' at ');
  }

  if (stop?.source_type === 'creative') {
    return record?.organization || record?.role || 'Creative';
  }

  return record?.description || stop?.label || '';
};

const resolveTechStack = (stop, record) => {
  if (stop?.source_type === 'project') {
    return Array.isArray(record?.tech_stack) ? record.tech_stack : [];
  }

  if (stop?.source_type === 'experience') {
    return [record?.role, record?.company, record?.date_range].filter(Boolean);
  }

  if (stop?.source_type === 'creative') {
    return [record?.role, record?.organization, record?.date_range].filter(Boolean);
  }

  return [];
};

function ContentCard({ stop, record }) {
  const title = resolveTitle(stop, record);
  const subtitle = resolveSubtitle(stop, record);
  const stack = resolveTechStack(stop, record);

  return (
    <motion.div
      key={stop?.id}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 22, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="glassmorphism w-full max-w-md rounded-[1.75rem] p-5 shadow-glass backdrop-blur-xl sm:p-6"
    >
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/60">
        {stop?.source_type || 'timeline stop'}
      </p>

      <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-white/80 sm:text-[0.95rem]">
        {subtitle}
      </p>

      {stack.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/90"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export default function TimelineContent() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const projectData = useStore((state) => state.projectData);
  const rawStops = projectData?.timeline_stops || [];

  const stops = useMemo(
    () => [...rawStops].sort((a, b) => getZIndex(a) - getZIndex(b)),
    [rawStops],
  );

  const maxZIndexMagnitude = useMemo(() => {
    if (!stops.length) {
      return 1;
    }

    const maxValue = Math.max(...stops.map((stop, index) => Math.abs(getZIndex(stop, index))));
    return maxValue > 0 ? maxValue : 1;
  }, [stops]);

  const activeStop = useMemo(() => {
    if (!stops.length) {
      return null;
    }

    let bestMatch = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    stops.forEach((stop, index) => {
      const stopProgress = Math.abs(getZIndex(stop, index)) / Math.abs(maxZIndexMagnitude);
      const distance = Math.abs(scrollProgress - stopProgress);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = { stop, stopProgress };
      }
    });

    if (bestMatch && bestDistance <= ACTIVE_THRESHOLD) {
      return bestMatch;
    }

    return null;
  }, [maxZIndexMagnitude, scrollProgress, stops]);

  const record = activeStop ? resolveStopRecord(projectData, activeStop.stop) : null;

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-4 z-20 flex justify-center px-4 sm:bottom-auto sm:left-6 sm:top-1/2 sm:justify-start sm:px-0 sm:-translate-y-1/2 lg:left-10">
      <AnimatePresence mode="wait">
        {activeStop ? (
          <ContentCard key={activeStop.stop.id} stop={activeStop.stop} record={record} />
        ) : (
          <motion.div
            key="timeline-ghost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glassmorphism hidden w-full max-w-md rounded-[1.5rem] p-4 text-sm text-white/70 shadow-glass backdrop-blur-xl sm:block"
          >
            Scroll to lock onto the timeline stops.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
