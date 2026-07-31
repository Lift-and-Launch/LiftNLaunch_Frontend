import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Clients from "../components/Clients";

gsap.registerPlugin(ScrollTrigger);

const tabContent = {
  "Be Your Evangelists": {
    text: "In Year 1, We Put Up Merchandise Sales Of Almost $750,000. Our Community Owners Want All Of Our Merch So That They Can Go Out And Say, This Is Something I'm A Part Of.",
    author: "Wes Burdine",
    subtitle: "Co-Founder, Minnesota Women's Soccer\nRaised $1,000,000 From 3,081 Investors",
    img: "/index/Ellipse 7.png"
  },
  "Join Your Team": {
    text: "Empower talented individuals to join your mission and bring unique skills to your venture.",
    author: "Jane Doe",
    subtitle: "Head of Growth, Startup Inc.",
    img: "/index/Ellipse 8.png"
  },
  "Refer Your Customers": {
    text: "Your loyal audience can refer new customers and help expand your market reach.",
    author: "Mike Johnson",
    subtitle: "Marketing Strategist, ReferMe",
    img: "/index/Ellipse 9.png"
  },
  "Become Customers": {
    text: "Let your evangelists experience your product directly as loyal customers.",
    author: "Sara Lee",
    subtitle: "Customer Success Head, SaaS Co",
    img: "/index/Ellipse 7.png"
  },
  "Enhance Perception": {
    text: "Boost your brand credibility by showing organic community participation.",
    author: "Tom Ray",
    subtitle: "Founder, BrandBuild",
    img: "/index/Ellipse 8.png"
  },
};

const Process = () => {
  const [selectedTab, setSelectedTab] = useState("Be Your Evangelists");

  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const tabsRef = useRef(null);
  const stepsRef = useRef(null);
  const videoRef = useRef(null);
  const benefitsRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    gsap.from(heroRef.current, {
      opacity: 0,
      y: -40,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (tabsRef.current) {
      gsap.from(tabsRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tabsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (benefitsRef.current) {
      gsap.from(benefitsRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (faqRef.current) {
      gsap.from(faqRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (stepsRef.current?.children) {
      gsap.from(stepsRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    if (videoRef.current?.children) {
      gsap.from(videoRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
        delay: 0.5,
        scrollTrigger: {
          trigger: videoRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const tabs = Object.keys(tabContent);

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section ref={heroRef} className="text-center py-16 bg-gradient-to-r from-white to-gray-50">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Let’s get you <br className="md:hidden" />
          <span className="text-blue-900">funded in minutes</span>
        </h1>
        <p className="mb-10 text-gray-600 max-w-2xl mx-auto px-4">
          Empowering communities through transparent and accessible funding solutions. Our streamlined approach bridges the gap between vision and reality.
        </p>
        <div className="flex justify-center gap-12 mb-10">
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">140+</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">$1.2B</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Revenue Generated</p>
          </div>
        </div>
        <button className="bg-yellow-400 px-10 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Discover opportunities
        </button>
      </section>

      {/* Cards Section */}
      <section ref={cardsRef} className="w-full max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-12">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex items-center justify-center p-4 hover:shadow-2xl transition-shadow"
          >
            <img
              src={`/process/0${item}.png`}
              alt={`Process step ${item}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </section>

      {/* Capital Raise Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase">
          More than just a <span className="text-blue-900 underline decoration-yellow-400">capital raise</span>
        </h2>
        <p className="text-gray-500 mb-16 max-w-2xl mx-auto">
          We build lasting ecosystems where backers become lifelong advocates for your mission.
        </p>

        <div ref={tabsRef} className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
          {/* Tab List */}
          <div className="w-full md:w-1/3">
            <ul className="space-y-3">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`cursor-pointer px-6 py-4 rounded-xl text-left font-bold transition-all ${
                    selectedTab === tab 
                    ? "bg-gray-900 text-white shadow-lg translate-x-3" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <div className="bg-yellow-50/50 p-10 rounded-3xl border border-yellow-100 shadow-sm flex flex-col md:flex-row gap-10 items-center w-full">
            <div className="flex-1 text-left">
              <p className="text-gray-800 text-xl font-medium leading-relaxed mb-8">"{tabContent[selectedTab].text}"</p>
              <div>
                <p className="text-gray-900 font-black text-lg">{tabContent[selectedTab].author}</p>
                <p className="text-gray-500 text-sm whitespace-pre-line leading-snug">{tabContent[selectedTab].subtitle}</p>
              </div>
            </div>
            <div className="w-32 h-32 flex-shrink-0">
               <img
                src={tabContent[selectedTab].img}
                alt="testimonial visual"
                className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proven Process Section */}
      <section ref={stepsRef} className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase leading-tight relative">
              FOLLOW A PROVEN PROCESS FOR GROWTH
              <div className="absolute -bottom-2 left-0 w-32 h-2 bg-yellow-400 rounded-full"></div>
            </h2>
          </div>
          <p className="text-gray-500 w-full md:w-1/2 text-lg leading-relaxed">
            Raising funds isn’t just about launching a campaign—it’s about building a business that attracts backers and investors. Our step-by-step system ensures you’re not just crowdfunding, but creating a scalable company.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              title: "Solid Business Foundation",
              description: "Refine your strategy using Lean Startup Methodology and financial projections.",
              img: "/index/svg 1.png",
            },
            {
              id: 2,
              title: "Build a Superfan Funnel",
              description: "Create a high-converting landing page to build a waiting list of superfans.",
              img: "/index/svg 2.png",
            },
            {
              id: 3,
              title: "Identify Your Audience",
              description: "Find people already looking for your product and craft the perfect message.",
              img: "/index/svg 3.png",
            },
            {
              id: 4,
              title: "Scale Profitably",
              description: "Using data from pre-launch, optimize ads to reach only the most engaged backers.",
              img: "/index/svg 4.png",
            },
            {
              id: 5,
              title: "Launch with Confidence",
              description: "Hit launch with a proven strategy and an engaged audience ready to fund.",
              img: "/index/svg 1.png",
            },
            {
              id: 6,
              title: "Maximize Quick Funding",
              description: "Boost your ranking on platforms and attract free organic traffic through momentum.",
              img: "/index/svg 2.png",
            },
          ].map((step) => (
            <div
              key={step.id}
              className="bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-100 group"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-8 group-hover:scale-110 transition-transform shadow-md">
                {step.id}
              </div>
              <h4 className="text-gray-900 font-extrabold text-xl mb-4 leading-tight">{step.title}</h4>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="py-24 bg-gray-900 text-white text-center px-6">
        <h3 className="text-3xl font-black mb-16 uppercase tracking-widest">
          The <span className="text-yellow-400">Neighborhood</span> Edge
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Save Time", desc: "Automate your pre-launch and donor tracking." },
            { title: "Fully Secure", desc: "Enterprise-grade encryption for all transactions." },
            { title: "24/7 Support", desc: "Expert guidance whenever you need it most." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-2xl mb-4 text-yellow-400">{item.title}</h4>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <Clients />

      {/* FAQ */}
      <section ref={faqRef} className="py-24 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-black text-center mb-16 uppercase">
              Frequently <span className="text-blue-900">asked questions</span>
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <details key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer group open:bg-yellow-50/30 transition-all">
                  <summary className="font-bold text-lg list-none flex justify-between items-center">
                    What are the requirements for starting a campaign?
                    <span className="text-yellow-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-gray-500 mt-6 leading-relaxed">
                    We look for projects that have a clear community impact, a detailed budget plan, and a committed leadership team. Our experts will review your application and provide guidance on next steps within 48 hours.
                  </p>
                </details>
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="text-gray-900 font-bold hover:underline">View all FAQs →</button>
            </div>
          </div>
      </section>

      {/* Video Section */}
      <section ref={videoRef} className="py-24 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/_TVCx0m6Omg"
              title="Success Story 1"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/5GG-VUvruzE"
              title="Success Story 2"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
