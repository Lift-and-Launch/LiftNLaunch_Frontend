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
                    Crowdfunding isn’t just about launching—it’s about launching the right way. Our battle-tested system is designed to help creators like you raise funds, grow a brand, and build a thriving business.
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
                    We use data-driven strategies, expert marketing, and high-converting funnels to give you the best chance of success—right from day one.
                </p>

                {/* Paragraph 3 */}
                <p className="md:text-base text-sm text-gray-900/60 w-full mx-auto text-center md:w-4/5 md:mt-6 mt-4 font-semibold">
                    The result? More funding. More backers. More momentum. Let’s launch your idea the smart way.
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
