import React from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

export default function Partnership() {
  return (
    <div className="w-full bg-yellow-400/10 border-b-2 border-amber-200">
      <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="text-center relative">
          <h2 className="md:text-4xl text-2xl text-gray-900 font-semibold uppercase relative inline-block">
            Backed by Strategy, Built for Success
            <div className="absolute md:bottom-1 bottom-1 md:right-[15%] right-1 md:w-64 w-36 h-2 bg-yellow-400/75 -rotate-2 -z-10" />
          </h2>
        </div>

        <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-6 mt-4">
          Crowdfunding isn&apos;t just hitting &quot;publish&quot; on a campaign
          page—it&apos;s about launching the right way. Our tested funnel system
          is built to help business owners and creators raise the funds they need
          to scale their businesses, launch new products, or turn their ideas into
          reality.
        </p>

        <div className="w-full max-w-6xl mx-auto md:mt-8 mt-4 rounded-2xl overflow-hidden shadow-md">
          <OptimizedImage
            src="/images/team-group.webp"
            alt="Lift & Launch creators and crowdfunding community"
            className="w-full h-auto object-contain"
            width={1400}
            height={900}
            sizes="(max-width: 768px) 100vw, 1152px"
            loading="lazy"
          />
        </div>

        <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-8 mt-6">
          Because the launch doesn&apos;t end in a day—it&apos;s the beginning of
          a strategy designed to build momentum, grow your brand, and support your
          business long after the campaign goes live. We combine data, smart
          marketing, and high-converting funnels to stack the odds in your favor
          from day one.
        </p>

        <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-6 mt-4 font-semibold">
          The payoff? More funding. More backers. More momentum. Let&apos;s turn
          what you&apos;re building into a smart launch.
        </p>

        <div className="mt-8 text-center">
          <Link
            to="/agency?consult=1"
            className="inline-block px-12 py-3 bg-yellow-400 text-gray-900 hover:bg-yellow-400/90 uppercase font-semibold rounded-full transition duration-300"
          >
            Chat With a Crowdfunding Expert
          </Link>
        </div>
      </section>
    </div>
  );
}
