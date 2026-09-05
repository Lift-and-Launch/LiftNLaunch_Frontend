import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    image: "/index/image (5).png",
    title: "You've Built It. We'll Help You Scale It.",
    description: `We've guided enough campaigns to know what's running through your mind right now: "I've been sitting on this idea for years — can it really become a business?" "I know I need marketing, but what actually works for a product like mine?" "Other launches seem to take off overnight — why does mine feel so hard?"`,
  },
  {
    image: "/index/image (6).png",
    title: "Crowdfunding Works — With the Right Foundation",
    description: `Here's the truth: crowdfunding works brilliantly — but only when it's built on the right foundation. That's the part most people get stuck on, and it's exactly where we step in. From idea to income, we turn dreamers into funded founders.`,
  },
];

export default function SuccessStories() {
  const storyRefs = useRef([]);

  useEffect(() => {
    storyRefs.current.forEach((el, index) => {
      if (!el) return;
      const direction = index % 2 === 0 ? -100 : 100;
      gsap.fromTo(
        el,
        { opacity: 0, x: direction },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="relative text-3xl md:text-5xl font-black text-center text-gray-900 mb-20 md:w-4/5 mx-auto leading-tight z-10">
          You&apos;ve Built It. We&apos;ll Help You Scale It.
          <span className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-48 md:w-80 h-3 bg-yellow-400/60 -rotate-1 -z-10 rounded-full"></span>
        </h2>

        <div className="space-y-32">
          {stories.map((story, index) => (
            <div
              key={index}
              ref={(el) => (storyRefs.current[index] = el)}
              className={`flex flex-col md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } items-center gap-12 md:gap-20`}
            >
              <div className="w-full md:w-1/2 group">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-[300px] md:h-[450px] object-cover"
                    width={640}
                    height={450}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {story.title}
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {story.description}
                </p>
                {index === 1 && (
                  <Link
                    to="/contact"
                    className="inline-block mt-8 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-full"
                  >
                    Chat With a Crowdfunding Expert
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
