import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
    const cardsRef = useRef([]);

    useEffect(() => {
        cardsRef.current.forEach((card, index) => {
            if (card) {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                        delay: index * 0.1,
                    }
                );
            }
        });
    }, []);

    const steps = [
        {
            step: "1",
            image: "/index/svg 1.png",
            title: "SET UP A FUNNEL",
            description: "Using proprietary strategies proven to convert 30-50x more and eliminate wasteful ad spend.",
        },
        {
            step: "2",
            image: "/index/svg 2.png",
            title: "TEST AND VALIDATE",
            description: "Your product & product positioning for real customer demand.",
        },
        {
            step: "3",
            image: "/index/svg 3.png",
            title: "BUILD AN AUDIENCE",
            description: "Of real buyers and a campaign that speaks directly to them.",
        },
        {
            step: "4",
            image: "/index/svg 4.png",
            title: "LAUNCH",
            description: `And get funded in less than 24 hours. *Our average time of funding once launched is 15 minutes.`,
        },
    ];

    return (
        <section className="bg-white py-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h2 className="highlight-underline text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative z-10">
                    WHAT IF WE HELD HANDS?
                </h2>

                <p className="text-gray-600 max-w-2xl mb-12">
                    The point of using lorem ipsum is that it has a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years — sometimes by accident, sometimes on purpose.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                if (el) cardsRef.current[index] = el;
                            }}
                            className="bg-gray-50 p-6 rounded-xl shadow-sm flex flex-col items-center text-center h-full opacity-0"
                        >
                            <div className="text-yellow-500 text-3xl font-bold mb-2">{step.step}</div>
                            <div className="w-24 h-24 mb-4 relative">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
