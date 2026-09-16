import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import OptimizedImage from "./OptimizedImage";

const imagesLeftColumn = ["/images/hero-1.webp", "/images/hero-3.webp"];
const imagesRightColumn = ["/images/hero-2.webp", "/images/hero-4.webp"];

export default function Hero() {
  const leftTextRef = useRef(null);
  const imagesRefs = useRef([]);
  imagesRefs.current = [];

  const addToImagesRefs = (el) => {
    if (el && !imagesRefs.current.includes(el)) {
      imagesRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (leftTextRef.current) {
      gsap.fromTo(
        leftTextRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }

    if (imagesRefs.current.length > 0) {
      gsap.fromTo(
        imagesRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.5,
        }
      );
    }
  }, []);

  const handleMouseEnter = (index) => {
    if (imagesRefs.current[index]) {
      gsap.to(imagesRefs.current[index], {
        scale: 0.95,
        rotation: -2,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  const handleMouseLeave = (index) => {
    if (imagesRefs.current[index]) {
      gsap.to(imagesRefs.current[index], {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  };

  return (
    <section className="w-full border-b-2 border-amber-200 overflow-x-hidden">
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-10 md:gap-12 md:min-h-[85vh]">
        <div
          ref={leftTextRef}
          className="max-w-xl w-full text-center md:text-left shrink-0"
        >
          <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">
            Lift &amp; Launch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            The Fastest Way to Fund, Launch or Scale Your Next Business Venture.
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            Turn your business idea, product, or big launch into a venture
            everyone&apos;s talking about. From idea to income — our crowdfunding
            system turns dreamers into funded founders.
          </p>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Launch smarter, scale faster, and raise with a system that&apos;s
            already worked hundreds of times — across Kickstarter, Indiegogo,
            Lift &amp; Launch Seed Ventures, and other major platforms.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/agency?consult=1"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-full text-sm text-center"
            >
              Chat With a Crowdfunding Expert
            </Link>
            <Link
              to="/services"
              className="inline-block border border-gray-300 hover:border-gray-900 text-gray-900 font-medium py-3 px-6 rounded-full text-sm text-center"
            >
              Explore the Platform
            </Link>
          </div>
        </div>

        <div className="flex w-full md:w-1/2 justify-center gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            {imagesLeftColumn.map((src, idx) => (
              <div
                key={idx}
                ref={(el) => addToImagesRefs(el)}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className={`cursor-pointer overflow-hidden rounded-lg shadow-md ${
                  idx === 0 ? "md:-mt-8" : ""
                } w-[160px] sm:w-[200px] md:w-[240px] ${
                  idx === 0
                    ? "h-[210px] sm:h-[260px] md:h-[300px]"
                    : "h-[180px] sm:h-[220px] md:h-[250px]"
                }`}
              >
                <OptimizedImage
                  alt={`Lift & Launch campaign success visual ${idx + 1}`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "low"}
                  width={300}
                  height={400}
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
                  className="w-full h-full object-cover"
                  src={src}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 md:mt-10">
            {imagesRightColumn.map((src, idx) => {
              const imageIndex = idx + imagesLeftColumn.length;
              return (
                <div
                  key={idx}
                  ref={(el) => addToImagesRefs(el)}
                  onMouseEnter={() => handleMouseEnter(imageIndex)}
                  onMouseLeave={() => handleMouseLeave(imageIndex)}
                  className={`cursor-pointer overflow-hidden rounded-lg shadow-md w-[160px] sm:w-[200px] md:w-[240px] ${
                    idx === 0
                      ? "h-[180px] sm:h-[220px] md:h-[250px]"
                      : "h-[210px] sm:h-[260px] md:h-[300px]"
                  }`}
                >
                  <OptimizedImage
                    alt={`Lift & Launch campaign success visual ${imageIndex + 1}`}
                    loading="lazy"
                    fetchPriority="low"
                    width={300}
                    height={400}
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
                    className="w-full h-full object-cover"
                    src={src}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}
