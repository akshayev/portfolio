import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const lerp = (start, end, amount) => start + (end - start) * amount;

const getScrollProgress = () => {
  const documentElement = document.documentElement;
  const scrollTop = window.scrollY || documentElement.scrollTop || 0;
  const scrollHeight = Math.max(
    documentElement.scrollHeight,
    document.body?.scrollHeight || 0,
  );
  const viewportHeight = window.innerHeight || documentElement.clientHeight || 1;
  const maxScroll = Math.max(scrollHeight - viewportHeight, 1);

  return clamp01(scrollTop / maxScroll);
};

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

      if (delta < 0.001) {
        progressRef.current = target;
        setScrollProgress(target);
        stopLoop();
        return;
      }

      progressRef.current = lerp(current, target, 0.14);
      setScrollProgress(progressRef.current);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (runningRef.current) {
        return;
      }

      runningRef.current = true;
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      targetRef.current = getScrollProgress();
      startLoop();
    };

    const onResize = () => {
      targetRef.current = getScrollProgress();
      progressRef.current = targetRef.current;
      setScrollProgress(targetRef.current);
      stopLoop();
    };

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
