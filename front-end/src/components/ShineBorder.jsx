"use client";

import React from 'react';
import { cn } from "@/lib/utils";

// for the numbers of invoices card in the dashboard 
function ShineBorder({
  borderRadius = 8,
  borderWidth = 2,
  duration = 14,
  color = "#000000",
  className,
  children,
  padding = 2,
}) {
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
        "--border-width": `${borderWidth}px`,
        "--padding": `${padding}px`, 
      }}
      className={cn(
        "relative w-full h-full rounded-[--border-radius]",
        className
      )}
    >
      <div
        style={{
          "--shine-pulse-duration": `${duration}s`,
          "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color},transparent,transparent)`,
        }}
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:w-full before:h-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`}
      ></div>
      <div className="relative z-10 w-full h-full" style={{ padding: 'var(--padding)' }}>
        {children}
      </div>
    </div>
  );
}

export default ShineBorder;
