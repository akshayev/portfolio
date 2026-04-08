import { useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

export default function Loader({ progress }) {
  const { progress: sceneProgress } = useProgress();
  const currentProgress = Math.max(
    0,
    Math.min(100, Number.isFinite(progress) ? progress : sceneProgress),
  );

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#355C7D]"
    >
      <div className="flex flex-1 items-center justify-center px-6">
        <motion.div
          aria-label="Loading portfolio"
          className="relative flex h-28 w-28 items-center justify-center"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 rounded-[1.75rem] border border-white/25 bg-white/8 backdrop-blur-md" />
          <div className="absolute h-14 w-14 rotate-45 rounded-2xl border-2 border-[#FF7582] shadow-[0_0_40px_rgba(255,117,130,0.45)]" />
          <div className="absolute h-4 w-4 rounded-full bg-[#FF7582]" />
        </motion.div>
      </div>

      <div className="w-full px-6 pb-8 sm:px-10">
        <div className="mx-auto h-1 w-full max-w-xl overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-[#FF7582]"
            initial={{ width: '0%' }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
