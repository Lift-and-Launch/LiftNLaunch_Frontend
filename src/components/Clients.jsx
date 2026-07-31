import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Founder, Green Neighborhood",
    photo: "/index/Ellipse 7.png",
    quote:
      "This platform empowered us to raise the funds we needed to bring clean parks to our community. The process was simple and the support was incredible!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Local Artist",
    photo: "/index/Ellipse 8.png",
    quote:
      "I launched my first art project here and reached more backers than I ever imagined. Truly a game-changer for creative people.",
    rating: 4,
  },
  {
    name: "Maria Lopez",
    role: "Small Business Owner",
    photo: "/index/Ellipse 9.png",
    quote:
      "Thanks to the support from this community, I was able to expand my business and hire more locals. Highly recommend it!",
    rating: 5,
  },
];

export default function Clients() {
  const [activeIndex, setActiveIndex] = useState(0);

  const photoRefs = [useRef(null), useRef(null), useRef(null)];
  const contentRef = useRef(null);
  const sectionRef = useRef(null);

  const renderStars = (count) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`w-5 h-5 ${i < count ? "text-yellow-400" : "text-gray-300"}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.26 3.885a1 1 0 00.95.69h4.1c.969 0 1.371 1.24.588 1.81l-3.32 2.413a1 1 0 00-.364 1.118l1.26 3.885c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.32 2.413c-.784.57-1.838-.197-1.539-1.118l1.26-3.885a1 1 0 00-.364-1.118L2.717 9.312c-.783-.57-.38-1.81.588-1.81h4.1a1 1 0 00.95-.69l1.26-3.885z" />
      </svg>
    ));

  const getNeighborIndex = (offset) =>
    (activeIndex + offset + testimonials.length) % testimonials.length;

  const animatePhotos = useCallback(() => {
    const angles = [-70, 0, 70];
    const radius = 120;

    photoRefs.forEach((ref, i) => {
      if (!ref.current) return;

      const angleRad = (angles[i] * Math.PI) / 180;
      const x = Math.sin(angleRad) * radius;
      const y = -Math.cos(angleRad) * radius;

      const isActive = i === 1;

      gsap.to(ref.current, {
        duration: 0.5,
        x,
        y,
        scale: isActive ? 1.1 : 0.9,
        borderColor: isActive ? "#fbbf24" : "transparent",
        opacity: isActive ? 1 : 0.7,
        zIndex: isActive ? 10 : 1,
        ease: "power2.out",
      });
    });
  }, [activeIndex]);

  const animateContent = useCallback(() => {
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      duration: 0.3,
      opacity: 0,
      onComplete: () => {
        gsap.to(contentRef.current, {
          duration: 0.3,
          opacity: 1,
        });
      },
    });
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      animatePhotos();
      animateContent();
    }
  }, [activeIndex, isVisible, animatePhotos, animateContent]);

  const changeIndex = (dir) => {
    const next =
      dir === "next"
        ? (activeIndex + 1) % testimonials.length
        : (activeIndex - 1 + testimonials.length) % testimonials.length;
    setActiveIndex(next);
  };

  return (
    <div className="bg-gray-50 pt-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-6xl mx-auto gap-6 px-4 sm:px-0 mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight md:w-3/5 break-words whitespace-normal">
          FEEDBACK FROM OUR <br className="hidden md:block" />
          HAPPY CLIENTS
        </h2>
        <p className="text-gray-600 md:w-2/5">
          Various versions have evolved over the years, sometimes by accident,
          sometimes on purpose (injected humour and the like).
        </p>
      </div>

      <section
        ref={sectionRef}
        className="py-20 px-4 md:px-16 bg-gray-50 max-w-7xl mx-auto overflow-x-hidden"
      >
        <div className="flex flex-col md:flex-row gap-12 mt-10">
          <div className="flex flex-col items-center">
            <div className="relative w-64 sm:w-72 md:w-96 h-36 sm:h-40 md:h-48">
              {[getNeighborIndex(-1), activeIndex, getNeighborIndex(1)].map(
                (index, i) => (
                  <div
                    key={i}
                    ref={photoRefs[i]}
                    className="w-20 h-20 rounded-full overflow-hidden border-4 absolute top-1/2 left-1/2"
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    <img
                      src={testimonials[index].photo}
                      alt={testimonials[index].name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex gap-6">
              <button
                onClick={() => changeIndex("prev")}
                className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => changeIndex("next")}
                className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <div
              ref={contentRef}
              className="flex-1 rounded-xl opacity-100 mb-10"
              key={activeIndex}
            >
              <div className="flex mb-2">
                {renderStars(testimonials[activeIndex].rating)}
              </div>
              <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
                “{testimonials[activeIndex].quote}”
              </p>
              <div>
                <p className="font-semibold text-gray-900 text-xl">
                  {testimonials[activeIndex].name}
                </p>
                <p>{testimonials[activeIndex].role}</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="px-10 mt-10 font-bold py-2 bg-yellow-400 rounded-full inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
