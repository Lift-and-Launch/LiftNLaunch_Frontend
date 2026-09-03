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
            More Than a Launch. A Partner for the Long Run.
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl text-left">
            This was never just about hitting a funding number. It's about building something that outlasts the campaign — and we're invested in getting you there.
            <br /><br />
            When you work with us, our team will:
            <ul className="list-disc pl-5 mt-2">
              <li>Get to know your goals and build a strategy shaped around your specific business.</li>
              <li>Walk you through every stage of our proven system, step by step.</li>
              <li>Stay with you after launch day, helping you turn one-time backers into loyal, repeat customers.</li>
            </ul>
            <br />
            We don't disappear once the confetti settles. We help you scale. Let's build something great — together.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition"
          >
            Chat With a Crowdfunding Expert
          </a>
        </div>
      </div>

      {/* How To Raise Section */}
      <div className="mt-28 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-primary">
          Ready to Launch & Get Funded?
        </h2>

        {/* YouTube iframe */}
        {/* <div className="relative w-full h-0 pb-[56.25%] mb-8">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-md"
            src="https://www.youtube.com/embed/k7o9R6eaSes?si=sUSPSDcL2hgVWtWd"
            title="Crowdfunding Training Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div> */}

        <p className="text-gray-700 mb-8">
          You've got the vision. We've got the roadmap. Let's turn your next venture into a fully funded campaign.<br /><br />
          Here’s how we add value:<br />
          • Proven strategies that maximize both funding and backer count.<br />
          • Hands-on guidance from pre-launch to all the way through post-campaign growth.<br />
          • A community of creators building real, lasting businesses alongside you.
        </p>

        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition"
        >
          Book a Free Strategy Call
          <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
}
