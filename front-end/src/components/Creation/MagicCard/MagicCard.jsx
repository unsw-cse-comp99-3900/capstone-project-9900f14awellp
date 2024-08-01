"use client";
import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export function MagicCard({
  children,
  className = "",
  gradientSize = 250,
  gradientColor = "#D6D6D6",
  selected = false,
  onClick,
  ...props
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const finalGradientColor = selected ? "#000" : gradientColor;

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      onClick={onClick}
      className={cn(
        "group relative flex overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${finalGradientColor}, transparent 100%)
            `,
        }}
      />
    </div>
  );
}
