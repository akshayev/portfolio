"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SlideInProps = {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
};

export function SlideIn({ children, className, from = "left", delay = 0 }: SlideInProps) {
  const reduced = useReducedMotion();
  const delta = from === "left" ? -28 : 28;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: reduced ? 0 : delta }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
