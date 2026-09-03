import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const imagesLeftColumn = ["/index/image (1).png", "/index/image (3).png"];
const imagesRightColumn = ["/index/image (2).png", "/index/image (4).png"];

export default function Hero() {
  const leftTextRef = useRef(null);
  const numberRef = useRef(null);

  // Refs for all image wrappers in both columns
  const imagesRefs = useRef([]);

  // Clear refs on each render
  imagesRefs.current = [];

  // Add each image wrapper ref to imagesRefs
  const addToImagesRefs = (el) => {
    if (el && !imagesRefs.current.includes(el)) {
      imagesRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Animate left text: fade in + slide up
    if (leftTextRef.current) {
      gsap.fromTo(
        leftTextRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }

    // Animate number count up for "140+"
    if (numberRef.current) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 140,
        duration: 2,
        ease: "power1.out",
        onUpdate() {
          if (numberRef.current) {
            numberRef.current.textContent = Math.floor(obj.val) + "+";
          }
        },
      });
    }

    // Animate images reveal: fade + slide up only (no scale)
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

  // GSAP hover animation handlers for images
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
    <section className="w-screen border-b-2 border-amber-200">
      <section className="max-w-7xl mx-auto md:h-[90vh] overflow-hidden px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* Left text content */}
        <div
          ref={leftTextRef}
          className="max-w-xl w-full text-center md:text-left md:pt-10"
        >
          <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">
            Works across Kickstarter, Indiegogo, Lift & Launch Seed Ventures, and more
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            The Fastest Way to Fund, Launch or Scale Your Next Business Venture.
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Turn Your Business Idea, Product, or Big Launch Into a Venture That Makes Waves. Our proven system takes you from first spark to fully funded — and beyond.
          </p>
          <ul className="mt-4 text-gray-700 text-md list-disc list-inside space-y-1">
            <li>From idea to income — our crowdfunding system turns dreamers into funded founders.</li>
            <li>Launch smarter, scale faster, and build a brand people actually want to back.</li>
            <li>Raise the funds, find the backers, and build the business.</li>
          </ul>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-full text-sm"
            >
              Chat With a Crowdfunding Expert
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center md:justify-start text-center md:text-left">
            <div>
              <p ref={numberRef} className="text-2xl font-bold text-gray-900">
                0+
              </p>
              <p className="text-sm text-gray-600">Total Currencies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">$1.2B</p>
              <p className="text-sm text-gray-600">Revenue Generated</p>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-2 text-center md:text-left">
              We've Been Featured In:
            </p>
            <div className="flex justify-center md:justify-start">
              <img
                src="/index/logos.png"
                alt="Featured logos"
                className="h-auto max-w-full"
              />
            </div>
          </div>
        </div>

        {/* Right images */}
        <div className="flex w-full md:w-1/2 justify-center gap-4">
          {/* Left column images */}
          <div className="flex flex-col gap-4 md:gap-6">
            {imagesLeftColumn.map((src, idx) => (
              <div
                key={idx}
                ref={(el) => addToImagesRefs(el)}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className={`cursor-pointer inline-block ${
                  idx === 0 ? "-mt-6" : ""
                }`}
              >
                <img
                  alt={`Image ${idx + 1}`}
                  loading="lazy"
                  className="rounded-lg w-[250px] md:w-[300px]"
                  src={src}
                />
              </div>
            ))}
          </div>

          {/* Right column images */}
          <div className="flex flex-col gap-4 md:gap-6">
            {imagesRightColumn.map((src, idx) => {
              const imageIndex = idx + imagesLeftColumn.length;
              return (
                <div
                  key={idx}
                  ref={(el) => addToImagesRefs(el)}
                  onMouseEnter={() => handleMouseEnter(imageIndex)}
                  onMouseLeave={() => handleMouseLeave(imageIndex)}
                  className="cursor-pointer inline-block"
                >
                  <img
                    alt={`Image ${imageIndex + 1}`}
                    loading="lazy"
                    className="rounded-lg w-[250px] md:w-[300px]"
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
