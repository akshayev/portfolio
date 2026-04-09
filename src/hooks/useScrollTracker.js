import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { lerp, getScrollProgress } from '../utils/mathUtils';

const LERP_FACTOR = 0.14; // Tune scroll lag here — lower = more cinematic trail.
const SNAP_THRESHOLD = 0.001; // RAF loop stops when delta is below this.

export default function useScrollTracker() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const frameRef = useRef(0);
  const mountedRef = useRef(false);
  const runningRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const stopLoop = () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      runningRef.current = false;
    };

    const tick = () => {
      if (!mountedRef.current) {
        stopLoop();
        return;
      }

      const current = progressRef.current;
      const target = targetRef.current;
      const delta = Math.abs(target - current);

      if (delta < SNAP_THRESHOLD) {
        progressRef.current = target;
        setScrollProgress(target);
        stopLoop();
        return;
      }

      // lerp is a pure function from mathUtils — no dependency on React state.
      progressRef.current = lerp(current, target, LERP_FACTOR);
      setScrollProgress(progressRef.current);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      // getScrollProgress is a pure DOM read from mathUtils.
      targetRef.current = getScrollProgress();
      startLoop();
    };

    const onResize = () => {
      targetRef.current = getScrollProgress();
      progressRef.current = targetRef.current;
      setScrollProgress(targetRef.current);
      stopLoop();
    };

    // Sync immediately on mount.
    targetRef.current = getScrollProgress();
    progressRef.current = targetRef.current;
    setScrollProgress(targetRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      mountedRef.current = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      stopLoop();
    };
  }, [setScrollProgress]);
}
