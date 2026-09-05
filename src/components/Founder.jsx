import React from "react";
import { Link } from "react-router-dom";

export default function Founder() {
  return (
    <section className="py-20 px-4 md:px-16 bg-white max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-md">
          <img
            src="/index/image (12).png"
            alt="Lift & Launch crowdfunding partnership"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="text-center md:text-left flex flex-col justify-center items-center md:items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            More Than a Launch. A Partner for the Long Run.
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl">
            This was never just about hitting a funding number. It&apos;s about
            building something that outlasts the campaign — and we&apos;re invested
            in getting you there.
          </p>
          <ul className="text-gray-700 mb-8 max-w-xl space-y-3 text-left list-disc pl-5">
            <li>
              Get to know your goals and build a strategy shaped around your
              specific business.
            </li>
            <li>
              Walk you through every stage of our proven system, step by step.
            </li>
            <li>
              Stay with you after launch day, helping you turn one-time backers
              into loyal, repeat customers.
            </li>
          </ul>
          <p className="text-gray-700 mb-6 max-w-xl">
            We don&apos;t disappear once the confetti settles. We help you scale.
            Let&apos;s build something great — together.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition"
          >
            Chat With a Crowdfunding Expert
          </Link>
        </div>
      </div>

      <div className="mt-28 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to Launch &amp; Get Funded?
        </h2>
        <p className="text-gray-700 mb-6">
          You&apos;ve got the vision. We&apos;ve got the roadmap. Let&apos;s turn
          your next venture into a fully funded campaign.
        </p>
        <ul className="text-gray-600 text-left max-w-xl mx-auto mb-8 space-y-2 list-disc pl-5">
          <li>
            Proven strategies that maximize both funding and backer count.
          </li>
          <li>
            Hands-on guidance from pre-launch all the way through post-campaign
            growth.
          </li>
          <li>
            A community of creators building real, lasting businesses alongside
            you.
          </li>
        </ul>
        <Link
          to="/contact"
          className="inline-block px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition"
        >
          Book a Free Strategy Call &amp; Take the First Step Toward Funding
        </Link>

        <div className="relative w-full h-0 pb-[56.25%] mb-8 mt-16">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-md"
            src="https://www.youtube.com/embed/k7o9R6eaSes?si=sUSPSDcL2hgVWtWd"
            title="How to raise funds with Lift & Launch crowdfunding strategy"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
