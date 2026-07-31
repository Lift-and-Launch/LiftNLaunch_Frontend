import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    image: "/index/image (5).png",
    description: `Turn your ideas into reality with expert crowdfunding support.
from campaign strategy to marketing,
we guide you every step of the way to achieve your funding goals.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. proin at ligula ut nisi
volutpat vehicula, sed facilisis,`,
  },
  {
    image: "/index/image (6).png",
    description: `Turn your ideas into reality with expert crowdfunding support.
from campaign strategy to marketing.
we guide you every step of the way to achieve your funding goals.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. proin at ligula ut nisi volutpat vehicula, sed facilisis,`,
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
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="relative text-3xl md:text-5xl font-black text-center text-gray-900 mb-20 md:w-4/5 mx-auto leading-tight z-10">
          WE'VE HELPED CREATORS RAISE <br className="hidden md:block" />
          MILLIONS FOR THEIR DREAM JOBS
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
                        alt={`Success story ${index + 1}`}
                        className="w-full h-[300px] md:h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line border-l-4 border-yellow-400 pl-6 md:pl-8 py-2">
                    {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
