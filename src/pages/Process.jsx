import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Clients from "../components/Clients";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    title: "Just Have an Idea?",
    text: "You don't need a finished product to run a successful campaign — you need the right strategy. Whether you're working from a sketch, a rough prototype, or a polished product, our system meets you where you are and walks you toward launch day with confidence.",
  },
  {
    title: "Have a Working Prototype?",
    text: "Great — now it's time to turn that prototype into a funded product. We specialize in positioning strong products for maximum crowdfunding impact: a high-converting campaign, a loyal backer audience, and a launch strategy built to gain real traction.",
  },
  {
    title: "Running a Growing Business, Ready for Investors?",
    text: "You've already got customers, traction, and a vision for what's next. We help growing businesses navigate equity crowdfunding — positioning your company, attracting the right investors, and turning your community into stakeholders. Whether you're headed to Republic, Wefunder, StartEngine, or Lift & Launch Seed Ventures, we'll help you build a campaign that fuels your next chapter.",
  },
];

const sixSteps = [
  {
    id: 1,
    title: "Lay a Solid Business Foundation",
    description:
      "Before you raise a single dollar, your business needs a foundation that can hold the weight. We help you sharpen your strategy using business model or lean-startup principles, financial projections, and the legal groundwork investors expect to see.",
  },
  {
    id: 2,
    title: "Build a Superfan Funnel",
    description:
      "Think of this as your pre-launch engine. We build you a high-converting landing page that collects emails and builds a waitlist of supporters — people who are excited to back you the moment you go live.",
  },
  {
    id: 3,
    title: "Identify the Audience That Loves Your Brand",
    description:
      "There are people out there already looking to invest in what you're building. We help you find them, craft a message that resonates, and map out the ad budget it'll take to reach them.",
  },
  {
    id: 4,
    title: "Scale Quickly and Profitably",
    description:
      "Using the data from your pre-launch, we fine-tune your ad spend to reach only your most engaged, ready-to-buy backers — keeping costs down and returns high.",
  },
  {
    id: 5,
    title: "Launch With Confidence",
    description:
      "No guesswork, no cold feet. By the time launch day arrives, you'll have a tested strategy and an engaged audience ready to fund your campaign fast.",
  },
  {
    id: 6,
    title: "Maximize the Power of a Quick Funding Start",
    description:
      "A strong opening isn't just about the money — it boosts your ranking on crowdfunding platforms, attracts free organic traffic, and opens doors to bigger opportunities down the line.",
  },
];

const methodology = [
  {
    step: "1. Education",
    title: "Learn What Actually Works",
    text: "Help you understand how crowdfunding works and build realistic expectations before you commit — including readiness, network mapping, and the four crowdfunding models.",
  },
  {
    step: "2. Strategy",
    title: "Assessment & Roadmap",
    text: "Choose your path (CrowdStarter, CrowdValidator, CrowdScaler, CrowdPatron, or CrowdFinisher), crowdfunding type, goals, and get a personalized roadmap package with a strategy session.",
  },
  {
    step: "3. Training",
    title: "Marketing & Network Preparation",
    text: "Strengthen business fundamentals, story & brand, marketing systems, community, and team — plus crowdfunding-specific training on email, rewards, and compliance.",
  },
  {
    step: "4. Support",
    title: "Campaign Page & Beyond",
    text: "Story flow, conversion-focused structure, and copyediting so your page tells your story, builds trust, and turns interest into action.",
  },
];

const Process = () => {
  const heroRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power2.out",
      });
    }
    if (stepsRef.current?.children) {
      gsap.from(stepsRef.current.children, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const seo = pageSeo.process;

  return (
    <div className="bg-white text-black">
      <Seo {...seo} />

      <section
        ref={heroRef}
        className="text-center py-16 px-4 bg-gradient-to-r from-white to-gray-50"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Success Starts Before You Launch
        </h1>
        <p className="mb-4 text-gray-700 max-w-3xl mx-auto text-lg">
          Want to get funded fast? It all comes down to what happens before launch
          day. The pre-launch phase is where the real momentum gets built — so when
          your campaign finally goes live, you&apos;re not crossing your fingers for
          backers. You&apos;re opening the floodgates to people already waiting to
          support your vision.
        </p>
        <p className="mb-10 text-gray-900 font-semibold max-w-2xl mx-auto">
          Fund Your Campaign. From Day One. Your Launch. Your Momentum. Your Next
          Move.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-yellow-400 px-10 py-4 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-lg"
        >
          Chat With a Crowdfunding Expert
        </Link>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">
          Your Pre-Launch Partner for Crowdfunding Success
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-center mb-12">
          The pre-launch stage is where most creators get stuck. With the right
          partner, it becomes your biggest advantage instead. Since 2015, we&apos;ve
          focused on one thing: perfecting pre-launch strategy. With 30+ years of
          combined team experience, we know what moves the needle in crowdfunding —
          and what&apos;s a waste of your time and budget.
        </p>

        <h3 className="text-2xl font-bold text-center mb-10">
          Wherever You&apos;re Starting From
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {stages.map((s) => (
            <article
              key={s.title}
              className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
            >
              <h4 className="font-extrabold text-xl mb-4 text-gray-900">
                {s.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight md:w-1/2">
            A Proven, Six-Step Process for Crowdfunding Growth
          </h2>
          <p className="text-gray-500 md:w-1/2 text-lg leading-relaxed">
            Raising funds isn&apos;t just about launching a page — it&apos;s about
            building a business that attracts backers and investors alike. Our
            step-by-step system makes sure you&apos;re not just crowdfunding —
            you&apos;re building something scalable and profitable.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sixSteps.map((step) => (
            <article
              key={step.id}
              className="bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-gray-100"
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-8 shadow-md">
                {step.id}
              </div>
              <h3 className="text-gray-900 font-extrabold text-xl mb-4">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-yellow-400 font-semibold uppercase tracking-widest mb-3 text-center">
            Our Methodology
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            The Lift &amp; Launch Process
          </h2>
          <p className="text-gray-300 text-center max-w-3xl mx-auto mb-4">
            Most crowdfunding campaigns never reach their funding goal. Fewer than
            one in three campaigns reach full funding, while more than half struggle
            to reach even 10% of their target.
          </p>
          <p className="text-gray-400 text-center max-w-3xl mx-auto mb-14">
            Our four-step process exists to change those odds — guiding
            entrepreneurs, small businesses, nonprofits, and community groups from a
            rough idea to a campaign that&apos;s ready to succeed.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodology.map((m) => (
              <article
                key={m.step}
                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10"
              >
                <p className="text-yellow-400 font-bold mb-2">{m.step}</p>
                <h3 className="font-bold text-xl mb-3">{m.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-black mb-6">
          Where Are You on Your Crowdfunding Journey?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          That was a lot to take in — but you don&apos;t have to map it out alone.
          Tell us where you are in the process, what your strengths and weaknesses
          are, what your USP is, and what kind of backers you&apos;re looking for,
          and we&apos;ll help you chart the best path forward.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full"
        >
          Book a Free Strategy Call &amp; Map Out Your Next Move
        </Link>
      </section>

      <Clients />
    </div>
  );
};

export default Process;
