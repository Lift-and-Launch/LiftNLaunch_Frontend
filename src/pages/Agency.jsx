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
  const styles = `inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm transition cursor-pointer ${className}`;
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
  const styles = `inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 font-medium text-sm transition cursor-pointer bg-white ${className}`;
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
    document
      .getElementById("agency-services")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-gray-900">
      <Seo {...seo} />
      <ConsultationIntakeModal open={consultOpen} onClose={closeConsult} />

      {/* Hero */}
      <section className="w-full border-b-2 border-amber-200 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">
            Lift &amp; Launch Agency
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl leading-tight">
            Need More Than a Platform? Let&apos;s Build It Together.
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg max-w-3xl leading-relaxed">
            Expert strategy, coaching, and hands-on support for entrepreneurs who want help
            turning their business or funding opportunity into action.
          </p>
          <p className="mt-3 text-gray-600 text-sm md:text-base max-w-3xl leading-relaxed">
            The Lift &amp; Launch platform gives you the tools to move forward on your own. But
            sometimes you need an experienced team beside you — whether that&apos;s refining your
            business model, preparing a crowdfunding campaign, validating your MVP, building your
            launch strategy, or creating the content needed to tell your story.
          </p>
          <p className="mt-3 font-semibold text-gray-900">
            That&apos;s where our Agency Services come in.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={scrollToServices}>Explore Our Services</PrimaryButton>
            <SecondaryButton onClick={openConsult}>Book a Consultation</SecondaryButton>
          </div>
        </div>
      </section>

      {/* Support levels */}
      <section id="agency-services" className="scroll-mt-24 py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl">
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

          <div className="mt-12 space-y-12">
            {supportLevels.map((level) => (
              <article
                key={level.id}
                id={level.id}
                className="scroll-mt-28 border-b border-gray-100 pb-12 last:border-0 last:pb-0"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
                  <div className="shrink-0">
                    <span className="text-4xl font-bold text-yellow-500">{level.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{level.name}</h3>
                    <p className="mt-1 text-yellow-700 font-semibold">{level.subtitle}</p>
                    <p className="mt-4 text-gray-700 font-medium">{level.forWho}</p>
                    <p className="mt-3 text-gray-600 leading-relaxed">{level.description}</p>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">
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

          <div className="mt-12 rounded-2xl bg-[#001d59] text-white p-8 md:p-10 text-center">
            <h3 className="text-2xl font-bold">Not sure what level of support you need?</h3>
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
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200 bg-yellow-400/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Can We Help You With?
          </h2>
          <p className="mt-3 text-gray-700">From Business Model to Campaign Launch</p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpAreas.map((area) => (
              <div key={area.title} className="border-b border-gray-100 pb-6 last:border-0">
                <h3 className="text-lg font-bold text-gray-900">{area.title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How We Work</h2>
          <p className="mt-3 text-gray-700">You Bring the Vision. We Help Build the Path.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {howWeWork.map((item) => (
              <div key={item.step}>
                <span className="text-2xl font-bold text-yellow-500">{item.step}</span>
                <h3 className="mt-2 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform vs Agency */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200 bg-yellow-400/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl">
            SaaS When You Want to Do It Yourself.
            <br />
            Agency When You Want Expert Support.
          </h2>
          <p className="mt-4 text-gray-700">Two Ways to Work With Lift &amp; Launch</p>

          <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Use the Platform</h3>
              <p className="mt-2 text-sm font-semibold text-yellow-700">
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
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Work With Our Agency</h3>
              <p className="mt-2 text-sm font-semibold text-yellow-700">
                For entrepreneurs who want expert guidance or hands-on support.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Get personalized consulting, coaching, strategy, creative support, or campaign
                assistance from the Lift &amp; Launch team.
              </p>
              <div className="mt-6">
                <SecondaryButton onClick={scrollToServices}>
                  Explore Agency Services
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey stages */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built for Different Stages of the Journey
          </h2>
          <p className="mt-3 text-gray-700">
            Wherever You Are, There&apos;s a Way Forward.
          </p>
          <div className="mt-10 space-y-0 divide-y divide-gray-100 border-t border-b border-gray-100">
            {journeyStages.map((stage) => (
              <div
                key={stage.title}
                className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
              >
                <h3 className="font-bold text-gray-900 shrink-0 sm:min-w-[240px]">
                  {stage.title}
                </h3>
                <p className="text-gray-600">
                  <span className="text-yellow-600 font-semibold mr-2">→</span>
                  {stage.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
