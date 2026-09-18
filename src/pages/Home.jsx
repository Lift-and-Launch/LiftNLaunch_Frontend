import React from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import SuccessStories from "../components/SuccessStories";
import Testimonials from "../components/Testimonials";
import Partnership from "../components/Partnership";
import Founder from "../components/Founder";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

export default function Home() {
  const seo = pageSeo.home;

  return (
    <>
      <Seo
        {...seo}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Lift & Launch",
          url: "https://www.liftandlaunch.co/",
          description: seo.description,
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.liftandlaunch.co/blog?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Hero />
      <HowItWorks />
      <SuccessStories />
      <Testimonials />
      <Partnership />
      <Founder />
    </>
  );
}
