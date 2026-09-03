import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    image: "/index/image (5).png",
    description: `Step 1: Education — Learn What Actually Works
Goal: Help you understand how crowdfunding works and build realistic expectations before you commit. We start by exploring whether crowdfunding is genuinely the right move for you.

Step 2: Strategy — Assessment & Roadmap
Once we understand your readiness, willingness, and the value you're after, we build your roadmap together. Choosing your strategy, type, and setting your goals.`,
  },
  {
    image: "/index/image (6).png",
    description: `Step 3: Training — Marketing & Network Preparation
This phase equips you with the strategy, marketing skills, and network-activation tools you'll need for a strong campaign. Strengthen your business fundamentals, sharpen your story, and build a community.

Step 4: Support — Campaign Page & Beyond
Your campaign page needs to do more than look good—it needs to tell your story, build trust, and turn interest into action. We bring strategy, storytelling, and precision together to create a page built to convert.`,
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
          OUR METHODOLOGY <br className="hidden md:block" />
          <span className="text-xl md:text-2xl mt-4 block text-gray-600 font-medium normal-case">The Lift & Launch Process: A Step-by-Step System Built for Real Results</span>
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
