"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
};

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
