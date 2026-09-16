import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import ConsultationIntakeModal from "../components/ConsultationIntakeModal";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

const supportLevels = [
  {
    id: "foundational",
    number: "01",
    name: "Foundational",
    subtitle: "Strategy, Coaching & Business Development",
    forWho: "For entrepreneurs who need clarity, structure, and expert guidance.",
    description:
      "Get personalized coaching and practical tools to help you build your business foundation or prepare for crowdfunding.",
    includes: [
      "Crowdfunding strategy and education",
      "Business model development",
      "Personalized coaching sessions",
      "Action-based curriculum",
      "Templates and strategic tools",
      "Campaign planning",
      "Marketing and network preparation",
      "Campaign page guidance",
      "Business-model and funding-readiness support",
    ],
    note:
      "The Foundational service is designed around two paths: Crowdfunding Strategy & Support or Business Model Development Support.",
    cta: "Explore Foundational Support",
  },
  {
    id: "momentum",
    number: "02",
    name: "Momentum",
    subtitle: "Strategy + Hands-On Launch Support",
    forWho: "For entrepreneurs who are ready to move from planning into execution.",
    description:
      "Momentum combines strategic guidance with more hands-on support to help you prepare your business and campaign for launch.",
    includes: [
      "Crowdfunding strategy",
      "Business model development",
      "MVP design and validation",
      "Campaign strategy sessions",
      "Launch planning",
      "Content and promotional guidance",
      "Funnel development",
      "Advertising setup",
      "Pre-launch support",
      "Ongoing campaign reviews",
    ],
    note:
      "This level combines crowdfunding and business-model development, with MVP design and testing support to help you validate your offer before scaling.",
    cta: "Explore Momentum Support",
  },
  {
    id: "pinnacle",
    number: "03",
    name: "Pinnacle",
    subtitle: "Full-Service Launch & Funding Support",
    forWho:
      "For businesses that want a team actively involved in bringing their campaign and growth strategy to life.",
    description:
      "Pinnacle provides comprehensive support across strategy, campaign execution, marketing, creative production, and launch activities.",
    includes: [
      "Full crowdfunding campaign strategy and execution",
      "Business model development",
      "MVP planning and testing",
      "Campaign messaging and storytelling",
      "Email, social and outreach materials",
      "Pre-launch and launch support",
      "Advertising management",
      "Creative production",
      "Promotional video production",
      "Branded photography",
      "Visual content production",
      "Weekly strategic sprints",
    ],
    note:
      "A comprehensive done-with-you program, including campaign strategy, business-model development, MVP testing, and visual production.",
    cta: "Explore Pinnacle Support",
  },
];

const helpAreas = [
  {
    title: "Crowdfunding Strategy",
    body:
      "Understand your funding options, define your campaign approach, and create a roadmap aligned with your goals.",
  },
  {
    title: "Business Model Development",
    body:
      "Build or refine your value proposition, customer segments, revenue model, cost structure, partnerships, and operating model — including Lean Canvas / Business Model Canvas work.",
  },
  {
    title: "MVP Strategy & Validation",
    body:
      "Turn your idea into a lean version that can be tested with real customers before committing significant resources. Define core features, choose low-cost validation methods, gather feedback, and align the MVP with your campaign or early-sales strategy.",
  },
  {
    title: "Campaign Development",
    body:
      "Develop your campaign strategy, messaging, storytelling, launch roadmap, and promotional materials.",
  },
  {
    title: "Marketing & Advertising",
    body:
      "Prepare your funnels, advertising setup, campaign content, and promotional strategy to help you reach the right audience.",
  },
  {
    title: "Creative & Visual Production",
    body:
      "Bring your brand and campaign to life through professional video, photography, and visual content — including promotional videos, campaign/social assets, branded photography, and storytelling materials.",
  },
];

const howWeWork = [
  {
    step: "01",
    title: "Assess",
    body:
      "We start by understanding your business, goals, audience, current stage, and what you need to accomplish.",
  },
  {
    step: "02",
    title: "Strategize",
    body:
      "We identify the right path — whether that's business-model development, crowdfunding preparation, MVP validation, campaign development, or launch support.",
  },
  {
    step: "03",
    title: "Build",
    body:
      "We work with you to develop the strategy, assets, systems, and materials required to move forward.",
  },
  {
    step: "04",
    title: "Validate",
    body:
      "Where appropriate, we help you test your offer, messaging, MVP, and campaign approach before scaling.",
  },
  {
    step: "05",
    title: "Launch & Support",
    body:
      "When you're ready, we help you execute your launch and provide the level of ongoing support you've selected.",
  },
];

const journeyStages = [
  {
    title: "I have an idea.",
    body: "Start with business-model development and validation.",
  },
  {
    title: "I have a business.",
    body: "Refine your model, validate your offer, and prepare for growth or funding.",
  },
  {
    title: "I'm preparing to raise funds.",
    body: "Develop your crowdfunding strategy and campaign.",
  },
  {
    title: "I'm getting ready to launch.",
    body: "Get hands-on support with your funnel, marketing, advertising, and launch preparation.",
  },
  {
    title: "I want someone to handle more of it.",
    body: "Explore full-service campaigns and creative support.",
  },
];

function PrimaryButton({ children, onClick, to, className = "" }) {
  const styles = `inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm transition cursor-pointer ${className}`;
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, to, className = "" }) {
  const styles = `inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 font-semibold text-sm transition cursor-pointer bg-white ${className}`;
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

function DarkButton({ children, onClick, to, className = "" }) {
  const styles = `inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#001d59] hover:bg-[#002a7a] text-white font-bold text-sm transition cursor-pointer ${className}`;
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={styles}>
      {children}
    </button>
  );
}

export default function Agency() {
  const seo = pageSeo.agency;
  const [searchParams, setSearchParams] = useSearchParams();
  const [consultOpen, setConsultOpen] = useState(false);

  const openConsult = useCallback(() => {
    setConsultOpen(true);
    const next = new URLSearchParams(searchParams);
    next.set("consult", "1");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const closeConsult = useCallback(() => {
    setConsultOpen(false);
    const next = new URLSearchParams(searchParams);
    next.delete("consult");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get("consult") === "1") {
      setConsultOpen(true);
    }
  }, [searchParams]);

  const scrollToServices = () => {
    document.getElementById("agency-services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-gray-900">
      <Seo {...seo} />
      <ConsultationIntakeModal open={consultOpen} onClose={closeConsult} />

      {/* Hero */}
      <section className="border-b border-amber-100 bg-gradient-to-b from-yellow-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <p className="text-sm font-semibold text-yellow-600 uppercase tracking-widest mb-3">
            Lift &amp; Launch Agency
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#001d59] max-w-4xl leading-tight">
            Need More Than a Platform? Let&apos;s Build It Together.
          </h1>
          <p className="mt-5 text-lg text-gray-700 max-w-3xl leading-relaxed">
            Expert strategy, coaching, and hands-on support for entrepreneurs who want help
            turning their business or funding opportunity into action.
          </p>
          <p className="mt-5 text-gray-600 max-w-3xl leading-relaxed">
            The Lift &amp; Launch platform gives you the tools to move forward on your own. But
            sometimes you need an experienced team beside you — whether that&apos;s refining your
            business model, preparing a crowdfunding campaign, validating your MVP, building your
            launch strategy, or creating the content needed to tell your story.
          </p>
          <p className="mt-4 font-semibold text-gray-900">
            That&apos;s where our Agency Services come in.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={scrollToServices}>Explore Our Services</PrimaryButton>
            <SecondaryButton onClick={openConsult}>Book a Consultation</SecondaryButton>
          </div>
        </div>
      </section>

      {/* Support levels */}
      <section id="agency-services" className="scroll-mt-24 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001d59] max-w-3xl">
            Expert Support. Built Around Your Stage.
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl leading-relaxed">
            Every business doesn&apos;t need the same level of support. Some entrepreneurs need a
            clear strategy and an expert to guide them. Others need hands-on help preparing for
            launch. And some want a team that can take a campaign from strategy through execution.
          </p>
          <p className="mt-3 font-semibold text-gray-900">
            Choose the level of support that fits where you are today.
          </p>

          <div className="mt-12 space-y-10">
            {supportLevels.map((level) => (
              <article
                key={level.id}
                id={level.id}
                className="scroll-mt-28 rounded-[2rem] border border-gray-100 bg-gray-50/70 p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  <div className="shrink-0">
                    <span className="text-4xl font-black text-yellow-500">{level.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                      {level.name}
                    </h3>
                    <p className="mt-1 text-yellow-700 font-bold">{level.subtitle}</p>
                    <p className="mt-4 text-gray-700 font-medium">{level.forWho}</p>
                    <p className="mt-3 text-gray-600 leading-relaxed">{level.description}</p>
                    <p className="mt-6 text-sm font-black uppercase tracking-widest text-gray-400">
                      Support can include
                    </p>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                      {level.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-sm text-gray-500 leading-relaxed">{level.note}</p>
                    <div className="mt-6">
                      <PrimaryButton onClick={openConsult}>{level.cta}</PrimaryButton>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] bg-[#001d59] text-white p-8 md:p-10 text-center">
            <h3 className="text-2xl font-extrabold">Not sure what level of support you need?</h3>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              Start with a consultation. We&apos;ll help you identify the right path.
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={openConsult}>Book a Consultation</PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* What can we help with */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001d59]">
            What Can We Help You With?
          </h2>
          <p className="mt-3 text-lg font-semibold text-gray-800">
            From Business Model to Campaign Launch
          </p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
              >
                <h3 className="text-lg font-extrabold text-gray-900">{area.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001d59]">How We Work</h2>
          <p className="mt-3 text-lg font-semibold text-gray-800">
            You Bring the Vision. We Help Build the Path.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {howWeWork.map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <span className="text-2xl font-black text-yellow-500">{item.step}</span>
                <h3 className="mt-2 font-extrabold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform vs Agency */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-yellow-50/50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001d59] max-w-3xl">
            SaaS When You Want to Do It Yourself.
            <br />
            Agency When You Want Expert Support.
          </h2>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Two Ways to Work With Lift &amp; Launch
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">Use the Platform</h3>
              <p className="mt-2 text-sm font-bold text-yellow-700">
                For entrepreneurs who want to take the lead.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Use Lift &amp; Launch&apos;s tools, resources, guided workflows, and educational
                content to build your business and prepare for your campaign at your own pace.
              </p>
              <div className="mt-6">
                <PrimaryButton to="/services">Explore the Platform</PrimaryButton>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-gray-900">Work With Our Agency</h3>
              <p className="mt-2 text-sm font-bold text-yellow-700">
                For entrepreneurs who want expert guidance or hands-on support.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Get personalized consulting, coaching, strategy, creative support, or campaign
                assistance from the Lift &amp; Launch team.
              </p>
              <div className="mt-6">
                <SecondaryButton onClick={scrollToServices}>Explore Agency Services</SecondaryButton>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white border border-gray-100 p-8 text-center">
            <h3 className="text-xl font-extrabold text-gray-900">
              Need Help With Something Specific?
            </h3>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              You don&apos;t necessarily need a full agency engagement. If you have a specific
              challenge, question, or area where you need expert guidance, you can book a
              consultation separately.
            </p>
            <div className="mt-6">
              <PrimaryButton onClick={openConsult}>Book a Consultation</PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Journey stages */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#001d59]">
            Built for Different Stages of the Journey
          </h2>
          <p className="mt-3 text-lg font-semibold text-gray-800">
            Wherever You Are, There&apos;s a Way Forward.
          </p>
          <div className="mt-10 space-y-4">
            {journeyStages.map((stage) => (
              <div
                key={stage.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
              >
                <h3 className="font-extrabold text-gray-900 shrink-0 sm:min-w-[240px]">
                  {stage.title}
                </h3>
                <p className="text-gray-600">
                  <span className="text-yellow-600 font-bold mr-2">→</span>
                  {stage.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#001d59] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to Move From Planning to Action?
          </h2>
          <p className="mt-5 text-white/80 leading-relaxed">
            Whether you need a strategic conversation, structured coaching, or a team to help
            execute your launch, we&apos;re here to meet you where you are.
          </p>
          <p className="mt-4 font-semibold text-yellow-300">
            Start with the Lift &amp; Launch platform. Add expert support when you need it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <PrimaryButton to="/services">Explore the Platform</PrimaryButton>
            <SecondaryButton onClick={openConsult} className="!bg-transparent !text-white !border-white/40 hover:!border-white hover:!bg-white/10">
              Book a Consultation
            </SecondaryButton>
            <DarkButton
              onClick={openConsult}
              className="!bg-white !text-[#001d59] hover:!bg-yellow-400"
            >
              Talk to Our Agency Team
            </DarkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
