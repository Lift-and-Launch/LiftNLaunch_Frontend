import React from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import SuccessStories from "../components/SuccessStories";
import Testimonials from "../components/Testimonials";
import Partnership from "../components/Partnership";
import Founder from "../components/Founder";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <SuccessStories />
      <Testimonials />
      <Partnership />
      <Founder />
    </>
  );
}
