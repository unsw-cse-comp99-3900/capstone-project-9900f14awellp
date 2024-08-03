"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
import Link from "@mui/material/Link"; // Importing MUI's Link component
import Create from "../../assets/welcomePage/Create.png";
import Dashboard from "../../assets/welcomePage/Dashboard.png";
import Draft from "../../assets/welcomePage/Draft.png";
import GUI from "../../assets/welcomePage/GUI.png";
import Profile from "../../assets/welcomePage/Profile.png";
import Send from "../../assets/welcomePage/Send.png";
import Validation from "../../assets/welcomePage/Validation.png";
import companyInformation from "../../assets/welcomePage/companyInformation.png";
import congratulate from "../../assets/welcomePage/congratulate.png";
import invoiceView from "../../assets/welcomePage/invoiceView.png";
import management from "../../assets/welcomePage/management.png";
import userManagement from "../../assets/welcomePage/userManagement.png";

export const HeroParallaxDemo = ()=> {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "congratulate",
    thumbnail: congratulate,
  },
  {
    title: "Dashboard",
    thumbnail: Dashboard
  },
  {
    title: "GUI",
    thumbnail: GUI
  },
  {
    title: "Draft",
    thumbnail: Draft
  },
  {
    title: "Profile",
    thumbnail: Profile
  },
  {
    title: "Send",
    thumbnail: Send
  },
  {
    title: "Validation",
    thumbnail: Validation
  },
  {
    title: "Send",
    thumbnail: Send
  },
  {
    title: "Create",
    thumbnail: Create
  },
  {
    title: "invoiceView",
    thumbnail: invoiceView
  },
  {
    title: "management",
    thumbnail: management
  },
  {
    title: "userManagement",
    thumbnail: userManagement
  },
  {
    title: "invoiceView",
    thumbnail: invoiceView
  },
  {
    title: "Draft",
    thumbnail: Draft
  },
  {
    title: "companyInformation",
    thumbnail: companyInformation
  },
];

export const HeroParallax = ({
  products
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);
  return (
    (<div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="">
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>)
  );
};

export const Header = () => {
  return (
    (<div
      className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-6xl font-bold dark:text-white">
       One-stop solution for invoicing <br />  Create, Validate, Send, and Manage
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
      Generate e-invoices with one click, quickly enhancing financial efficiency.
      </p>
    </div>)
  );
};

export const ProductCard = ({
  product,
  translate
}) => {
  return (
    (<motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0">
      <Link href={product.link} className="block group-hover/product:shadow-2xl ">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title} />
      </Link>
      <div
        className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2
        className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>)
  );
};
