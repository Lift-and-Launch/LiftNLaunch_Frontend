import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            delay: index * 0.1,
          }
        );
      }
    });
  }, []);

  const steps = [
    {
      step: "1",
      image: "/index/svg 1.png",
      title: "Design a Business Built to Last",
      description:
        "We help you shape a business model that holds up long after the campaign ends — so you're not just launching, you're building something that lasts.",
    },
    {
      step: "2",
      image: "/index/svg 2.png",
      title: "Build a Funnel That Actually Converts",
      description:
        "Using tested strategies, we build you a funnel that turns curious visitors into committed backers — without burning your budget on ads that don't convert.",
    },
    {
      step: "3",
      image: "/index/svg 3.png",
      title: "Validate Demand With Real Customers",
      description:
        "Before you go live, we confirm real people want what you're selling — so your launch is backed by evidence, not hope.",
    },
    {
      step: "4",
      image: "/index/svg 4.png",
      title: "Grow an Audience Ready to Say Yes",
      description:
        "We don't just chase clicks. We build a warm, engaged community that's ready to support you from the moment you launch.",
    },
    {
      step: "5",
      image: "/index/svg 1.png",
      title: "Launch and Get Funded — Fast",
      description:
        "With the right groundwork in place, most of our campaigns hit their funding goal within 7 days.",
    },
  ];

  return (
    <section className="bg-white py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="highlight-underline text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative z-10">
          Let&apos;s Build More Than a Campaign
        </h2>

        <p className="text-gray-600 max-w-3xl mb-4 text-lg">
          Let&apos;s map what&apos;s next: Launch, Fund, or Scale.
        </p>
        <p className="text-gray-600 max-w-3xl mb-12">
          Launching a campaign can feel like a lot to carry alone. You won&apos;t
          have to. We walk beside you from first idea to long-term growth —
          here&apos;s how. Because real crowdfunding success isn&apos;t just about
          the money you raise. It&apos;s about the brand you build along the way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col items-center text-center h-full opacity-0"
            >
              <div className="text-yellow-500 text-3xl font-bold mb-2">
                {step.step}
              </div>
              <div className="w-24 h-24 mb-4 relative">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-contain w-full h-full"
                  width={96}
                  height={96}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/contact"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-full"
          >
            Chat With a Crowdfunding Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
