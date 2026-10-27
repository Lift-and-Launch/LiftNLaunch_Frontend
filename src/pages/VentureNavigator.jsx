import { Link } from "react-router-dom";
import { CheckCircle2, Compass, SearchCheck } from "lucide-react";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";
import { useAuth } from "../context/AuthContext";
import { canAccessPremiumFeatures } from "../utils/subscription";

const navigatorPoints = [
  {
    title: "Build your business model",
    body: "Define your customers, products, services, and how your business will make money.",
  },
  {
    title: "Develop your business strategy",
    body: "Explore opportunities, improve your plans, and identify practical next steps.",
  },
  {
    title: "Organize your business journey",
    body: "Work through important business decisions and development activities.",
  },
  {
    title: "Understand your customers",
    body: "Identify whom you serve and the problems your business solves.",
  },
  {
    title: "Work through challenges",
    body: "Receive detailed AI suggestions, explanations, and alternative approaches.",
  },
  {
    title: "Keep moving forward",
    body: "Develop action items that help you turn ideas into progress.",
  },
];

const validatorPoints = [
  {
    title: "Validate your business hypothesis",
    body: "Identify what you believe about your idea and what still needs to be tested.",
  },
  {
    title: "Evaluate your business model",
    body: "Examine whether your approach to creating value and earning revenue makes sense.",
  },
  {
    title: "Research your market",
    body: "Explore customer needs, industry conditions, and potential demand.",
  },
  {
    title: "Analyze competitors",
    body: "Understand existing alternatives and opportunities to stand out.",
  },
  {
    title: "Explore intellectual property",
    body: "Research relevant patents, trademarks, and other public information.",
  },
  {
    title: "Access government and public research",
    body: "Use available data to better understand your business opportunity.",
  },
  {
    title: "Identify risks and gaps",
    body: "Discover unanswered questions before making major decisions.",
  },
  {
    title: "Prepare for real-world testing",
    body: "Develop next steps for gathering feedback from potential customers.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell Us About Your Business",
    body: "Answer guided questions about your idea, product, customers, and goals.",
  },
  {
    step: "02",
    title: "Explore and Validate",
    body:
      "Use AI-powered research and analysis to examine your assumptions, understand your market, and identify opportunities and risks.",
  },
  {
    step: "03",
    title: "Build Your Business Model",
    body:
      "Develop your business strategy, organize important information, and work through practical business development activities.",
  },
  {
    step: "04",
    title: "Get Your Next Steps",
    body:
      "Receive detailed suggestions, recommended assignments, and action items to help you continue moving forward.",
  },
  {
    step: "05",
    title: "Keep Building and Improving",
    body:
      "Return as your business develops, update your information, explore new questions, and refine your plans.",
  },
];

const stages = [
  {
    title: "Just Have an Idea?",
    body: "Explore whether your idea is worth pursuing and learn what it takes to turn it into a business.",
  },
  {
    title: "Developing Your Business?",
    body: "Strengthen your business model, research your market, and organize your next steps.",
  },
  {
    title: "Already Running a Business?",
    body: "Revisit your assumptions, explore growth opportunities, and improve your strategy.",
  },
  {
    title: "Preparing to Launch?",
    body:
      "Get your business model and validation work in order before moving into marketing and launch preparation.",
  },
];

const btnPrimary =
  "inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm transition cursor-pointer";
const btnSecondary =
  "inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 font-medium text-sm transition cursor-pointer bg-white";

function PointList({ points }) {
  return (
    <ul className="mt-4 space-y-4">
      {points.map((p) => (
        <li key={p.title} className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-yellow-500 mt-0.5 shrink-0" />
          <span className="text-gray-600 leading-relaxed">
            <strong className="text-gray-900">{p.title}:</strong> {p.body}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function VentureNavigator() {
  const { user } = useAuth();

  // Premium users go straight into the tool; signed-in users without a plan go to pricing;
  // visitors create an account first (sign-up continues to /pricing).
  const startHref = canAccessPremiumFeatures(user)
    ? "/dashboard/coach"
    : user
      ? "/pricing"
      : "/signup";

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-gray-900">
      <Seo {...pageSeo.ventureNavigator} />

      {/* Hero */}
      <section className="w-full border-b-2 border-amber-200 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">
            Venture Navigator &amp; Venture Validator
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 max-w-4xl leading-tight">
            Validate Your Vision. Navigate Your Business. Launch With Confidence.
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg max-w-3xl leading-relaxed">
            Your AI-powered business coach, validator, and guide — all in one place.
          </p>
          <p className="mt-3 text-gray-600 text-sm md:text-base max-w-3xl leading-relaxed">
            Every successful business starts with an idea. But turning that idea into a real
            business takes more than inspiration. It takes research, planning, validation, and the
            right direction.
          </p>
          <p className="mt-3 text-gray-600 text-sm md:text-base max-w-3xl leading-relaxed">
            That&apos;s where Venture Navigator &amp; Venture Validator come in. Whether
            you&apos;re exploring a new business idea, developing your business model, or
            preparing to bring a product to market, our AI-powered platform helps you understand
            where you are, what you need, and what steps to take next.
          </p>
          <p className="mt-3 font-semibold text-gray-900">
            You bring the vision. We help you navigate the journey.
          </p>
          <div className="mt-6">
            <Link to={startHref} className={btnPrimary}>
              Start Your Business Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Two capabilities */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl">
            Two Powerful Capabilities. One Connected Experience.
          </h2>

          <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-12">
            <article id="navigator" className="scroll-mt-28 rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                  <Compass className="text-yellow-600" size={22} aria-hidden />
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Venture Coach</h3>
              </div>
              <p className="mt-2 text-yellow-700 font-semibold">
                Your AI Business Coach &amp; Business Case Manager
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Building a business can feel overwhelming when you&apos;re unsure what to do next.
                Venture Navigator helps you move forward with guidance tailored to your business,
                goals, and stage of development.
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">
                It helps you
              </p>
              <PointList points={navigatorPoints} />
              <p className="mt-6 text-gray-700 leading-relaxed">
                Think of Venture Navigator as your{" "}
                <strong>personal AI business guide</strong> — helping you find direction while you
                stay in control.
              </p>
            </article>

            <article id="validator" className="scroll-mt-28 rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                  <SearchCheck className="text-yellow-600" size={22} aria-hidden />
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Venture Validator</h3>
              </div>
              <p className="mt-2 text-yellow-700 font-semibold">
                Your AI Business Research &amp; Validation Partner
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Before investing time and money into a business idea, you need to understand
                whether it makes sense. Venture Validator helps you investigate your idea,
                challenge your assumptions, and gather information to support better business
                decisions.
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-400">
                It helps you
              </p>
              <PointList points={validatorPoints} />
              <p className="mt-6 text-gray-700 leading-relaxed">
                Venture Validator doesn&apos;t simply tell you whether your idea is good or bad.
                It helps you <strong>understand the evidence</strong>, identify what still needs
                to be proven, and decide what to do next.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200 bg-yellow-400/10"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            From Business Idea to Business Direction
          </h2>
          <p className="mt-3 text-gray-700">
            You don&apos;t need to have everything figured out before getting started.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {steps.map((item) => (
              <div key={item.step}>
                <span className="text-2xl font-bold text-yellow-500">{item.step}</span>
                <h3 className="mt-2 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-gray-700 max-w-3xl leading-relaxed">
            Your business journey doesn&apos;t have to follow a straight line. Venture Navigator
            &amp; Venture Validator help you learn, adjust, and keep moving.
          </p>
        </div>
      </section>

      {/* Stages */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built for Entrepreneurs at Every Stage
          </h2>
          <div className="mt-10 divide-y divide-gray-100 border-t border-b border-gray-100">
            {stages.map((stage) => (
              <div
                key={stage.title}
                className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
              >
                <h3 className="font-bold text-gray-900 shrink-0 sm:min-w-[260px]">
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

      {/* You're in control */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b-2 border-amber-200 bg-yellow-400/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your Business. Your Decisions. Your Direction.
          </h2>
          <p className="mt-6 text-gray-700 font-semibold">
            Our AI doesn&apos;t take control of your business.
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">
            It provides research, detailed explanations, suggestions, and alternatives to help you
            make more informed decisions. You decide what to accept, what to change, and what
            direction to take.
          </p>
          <p className="mt-6 text-gray-900 font-bold">
            You&apos;re the entrepreneur. You&apos;re in control. We&apos;re here to help you
            navigate.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#001d59] text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl font-bold">Ready to Take the Next Step?</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what to do next and start building with greater clarity. Whether
            you&apos;re validating a new idea or developing an existing business, Venture
            Navigator &amp; Venture Validator give you the guidance and tools to move forward.
          </p>
          <p className="mt-4 font-semibold text-yellow-400">
            Validate Your Vision. Navigate Your Business. Launch With Confidence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={startHref} className={btnPrimary}>
              Get Started
            </Link>
            <button type="button" onClick={scrollToHowItWorks} className={btnSecondary}>
              Explore How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
