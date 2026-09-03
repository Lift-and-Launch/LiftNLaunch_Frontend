import React from "react";
import { Link } from "react-router-dom";

export default function Partnership() {
    return (
        <div className="w-full bg-yellow-400/10 border-b-2 border-amber-200">
            <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center relative">
                    <h2 className="md:text-4xl text-2xl text-gray-900 font-semibold uppercase relative inline-block">
                        Backed by Strategy, Built for Success
                        <div className="absolute md:bottom-1 bottom-1 md:right-[15%] right-1 md:w-64 w-36 h-2 bg-yellow-400/75 -rotate-2 -z-10" />
                    </h2>
                </div>

                {/* Paragraph 1 */}
                <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-6 mt-4">
                    Crowdfunding isn’t just hitting “publish” on a campaign page—it’s about launching the right way. Our tested funnel system is built to help business owners and creators raise the funds they need to scale their businesses, launch new products, or turn their ideas into reality.
                </p>

                {/* Image Grid */}
                <div className="w-full max-w-6xl mx-auto md:mt-8 mt-4">
                    <img
                        src="/index/group.webp"
                        alt="Group Illustration"
                        className="w-full h-auto object-contain"
                    />
                </div>

                {/* Paragraph 2 */}
                <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-8 mt-6">
                    Because the launch doesn’t end in a day—it’s the beginning of a strategy designed to build momentum, grow your brand, and support your business long after the campaign goes live. We combine data, smart marketing, and high-converting funnels to stack the odds in your favor from day one.
                </p>

                {/* Paragraph 3 */}
                <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-6 mt-4 font-semibold">
                    The payoff? More funding. More backers. More momentum. Let’s Turn What You’re Building Into a Smart Launch.
                </p>

                {/* CTA Button */}
                <div className="mt-8 text-center">
                    <Link
                        to="/contact"
                        className="inline-block px-12 py-3 bg-yellow-400 text-gray-900 hover:bg-yellow-400/90 uppercase font-semibold rounded-full transition duration-300"
                    >
                        Chat with an expert to learn more
                    </Link>
                </div>
            </section>
        </div>
    );
}
