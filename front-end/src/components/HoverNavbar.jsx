"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "@mui/material/Link"; // Importing MUI's Link component
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import AnimatedGradientText from "./AnimatedGradientText";
import miniCreate from "../assets/welcomePage/miniCreate.jpg";
import miniSend from "../assets/welcomePage/miniSend.jpg";
import miniValidation from "../assets/welcomePage/miniValidate.jpg";
import minimanagement from "../assets/welcomePage/minimanagement.jpg";

export const Navbar = ({ className }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const goLogin = () => {
    navigate("/login");
  };
  const goRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-lg mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <AnimatedGradientTextDemo content="Invoice Creation" />
            <AnimatedGradientTextDemo content="Invoice Validation" />
            <AnimatedGradientTextDemo content="Invoice Sending" />
            <AnimatedGradientTextDemo content="Invoice Management" />
            <AnimatedGradientTextDemo content="Users Management" />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Create"
              src= {miniCreate}
              description="Generate invoices through a GUI form, or upload your own invoices."
            />
            <ProductItem
              title="Validation"
              src= {miniValidation}
              description="Seven rules to validate your invoices, ensuring perfection."
            />
            <ProductItem
              title="Sending"
              src={miniSend}
              description="Select one or multiple invoices and send them to your customers' emails with one click."
            />
            <ProductItem
              title="Management"
              src={minimanagement}
              description="Invoice management: View error reports, validate, and send invoices at any time."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Join us now">
          <div className="flex flex-col space-y-4 text-sm">
            <AnimatedGradientTextDemo onClick={goLogin} content="Log in" />
            <AnimatedGradientTextDemo onClick={goRegister} content="Sign up" />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-xl" // Updated border color
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black shadow-input flex justify-center space-x-4 px-8 py-6" // Updated border color
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <Link href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl border border-gray-300 dark:border-gray-700" // Updated border color
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, onClick }) => {
    return (
      <Link
        onClick={onClick}
        className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:border-gray-700" // Updated border color
      >
        {children}
      </Link>
    );
};


export const AnimatedGradientTextDemo = ({ onClick, content }) => {
    return (
      <div className="z-10 flex min-h-[1rem] items-center justify-center">
        <AnimatedGradientText onClick={onClick}>
          🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
          <span
            className={cn(
              "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
            )}
          >
            {content}
          </span>
        </AnimatedGradientText>
      </div>
    );
  };