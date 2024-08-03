"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HeroHighlight = ({ children, className, containerClassName }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800  pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500   absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

// export const Highlight = ({ children, className }) => {
//   return (
//     <motion.span
//       initial={{
//         backgroundSize: "0% 100%",
//       }}
//       animate={{
//         backgroundSize: "100% 100%",
//       }}
//       transition={{
//         duration: 2,
//         ease: "linear",
//         delay: 0.5,
//       }}
//       style={{
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "left center",
//         display: "inline",
//       }}
//       className={cn(
//         `relative inline-block pb-1   px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
//         className
//       )}
//     >
//       {children}
//     </motion.span>
//   );
// };

export const Highlight = ({ children, className, startColor, endColor }) => {
  // 默认颜色
  const defaultStartColor = "rgba(129, 140, 248, 0.6)"; // indigo-400 with opacity
  const defaultEndColor = "rgba(167, 139, 250, 0.6)"; // purple-400 with opacity

  // 创建渐变背景样式
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${startColor || defaultStartColor}, ${endColor || defaultEndColor})`,
  };

  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        ...gradientStyle,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn("relative inline-block pb-1 px-1 rounded-lg", className)}
    >
      {children}
    </motion.span>
  );
};
export const TagHighlight = ({
  children,
  className,
  lightBgColor,
  lightTextColor,
  darkBgColor,
  darkTextColor,
}) => {
  // 默认颜色
  const defaultLightBg = "rgb(209, 250, 229)"; // emerald-100
  const defaultLightText = "rgb(4, 120, 87)"; // emerald-700
  const defaultDarkBg = "rgba(6, 78, 59, 0.2)"; // emerald-700 with 0.2 opacity
  const defaultDarkText = "rgb(16, 185, 129)"; // emerald-500

  // 创建样式对象
  const style = {
    "--light-bg": lightBgColor || defaultLightBg,
    "--light-text": lightTextColor || defaultLightText,
    "--dark-bg": darkBgColor || defaultDarkBg,
    "--dark-text": darkTextColor || defaultDarkText,
  };

  return (
    <span
      className={cn(
        "font-bold px-1 py-0.5",
        "bg-[var(--light-bg)] text-[var(--light-text)]",
        "dark:bg-[var(--dark-bg)] dark:text-[var(--dark-text)]",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
};
