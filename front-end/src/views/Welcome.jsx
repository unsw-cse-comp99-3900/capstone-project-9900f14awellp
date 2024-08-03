import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/HoverNavbar";
import { HeroParallaxDemo } from "@/components/ui/hero-parallax";

export default function Welcome() {
  return (
    <div>
      <Navbar></Navbar>
      <HeroParallaxDemo></HeroParallaxDemo>
    </div>
  );
}
