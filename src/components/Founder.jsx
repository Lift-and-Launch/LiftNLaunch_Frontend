import React from "react";
import { ArrowRight } from "lucide-react";

export default function Founder() {
  return (
    <section className="py-20 px-4 md:px-16 bg-white max-w-7xl mx-auto">
      {/* Founder Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Image */}
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md">
          <img
            src="/index/image (12).png"
            alt="Founder"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Content */}
        <div className="text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-primary">
            ABOUT FOUNDER
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl">
            When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of letterset sheets containing Lorem Ipsum passages, and more recently with desktop publishing.
            <br /><br />
            When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition"
          >
            GET IN TOUCH
          </a>
        </div>
      </div>

      {/* How To Raise Section */}
      <div className="mt-28 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-primary">
          HOW TO RAISE $100k – $1M+ ON KICKSTARTER OR INDIEGOGO
        </h2>

        {/* YouTube iframe */}
        <div className="relative w-full h-0 pb-[56.25%] mb-8">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-md"
            src="https://www.youtube.com/embed/k7o9R6eaSes?si=sUSPSDcL2hgVWtWd"
            title="Crowdfunding Training Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-700 mb-8">
          In this <strong>FREE</strong> step-by-step video you'll learn the six simple 
          activities I've used to raise <strong>$23M+</strong> in revenue for my clients, 
          and how to go from scratch to a successful 6–7 figure crowdfunding launch.
        </p>

        <a
          href="/free-training"
          className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition"
        >
          SHOW ME THE FREE TRAINING
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
}
