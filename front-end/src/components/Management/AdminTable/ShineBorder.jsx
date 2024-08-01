"use client";

import { cn } from "@/lib/utils";

/**
 * @name Shine Border
 * @description It is an animated background border effect component with easy to use and configurable props.
 * @param {number} [borderRadius=8] - defines the radius of the border.
 * @param {number} [borderWidth=1] - defines the width of the border.
 * @param {number} [duration=14] - defines the animation duration to be applied on the shining border.
 * @param {string|string[]} [color="#000000"] - a string or string array to define border color.
 * @param {string} [className] - defines the class name to be applied to the component.
 * @param {React.ReactNode} children - contains react node elements.
 */
export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#333",
  className,
  children,
  onClick,
}) {
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
      }}
      className={cn(
        "relative grid min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white",
        className
      )}
      onClick={onClick}
    >
      <div
        style={{
          "--border-width": `${borderWidth}px`,
          "--border-radius": `${borderRadius}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${Array.isArray(color) ? color.join(",") : color},transparent,transparent)`,
        }}
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`}
      ></div>
      {children}
    </div>
  );
}
