import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import FAQSection from "../components/FAQSection";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

const features = [
  {
    title: "Power Your Campaign With LaunchVault",
    description:
      "LaunchVault is our all-in-one toolkit built to help creators, startups, and growing businesses launch, fund, and scale — whether you’re launching a new venture, funding a product, or expanding an existing business.",
    items: [
      "Build and warm up your audience before you ever go live.",
      "Get more out of every ad dollar with smarter optimization.",
      "Track the metrics that actually matter, in real time.",
      "Turn backers and investors into believers with data-backed messaging.",
    ],
    cta: "Use LaunchVault for Your Launch",
    highlight: "Available exclusively to Lift & Launch clients.",
  },
  {
    title: "Your Pre-Launch Funnel — No Tech Skills Needed",
    description:
      "Whether you’re launching a product, a service, or an equity round, Launch Vault helps you build a high-converting funnel that attracts the right backers and investors—and gets them ready to take action.",
    items: [
      "Start from proven, high-converting templates.",
      "Customize everything with a simple drag-and-drop builder.",
      "Collect pre-launch deposits and build your community before day one.",
    ],
    cta: "Start Building Your Pre-Launch Funnel",
  },
  {
    title: "Reach Audiences That Are Already Looking for You",
    description:
      "Instead of building an audience from zero, we connect you to pre-qualified backers who are already active and engaged in your category.",
    items: [
      "Target proven, high-converting audiences across crowdfunding categories.",
      "Sync audience data seamlessly with your Meta Ads & Google Ads account.",
      "Stay privacy-compliant while getting the most from every ad.",
    ],
    cta: "Start Targeting the Right Audience",
    highlight: "Skip the trial and error. Reach the right people faster, spend smarter, and scale quicker.",
  },
  {
    title: "Analytics That Actually Make Sense",
    description:
      "You don’t need to be a data scientist to run a high-performing campaign. Our dashboard gives you clear, actionable insight into what’s working, what isn’t, and where to focus next.",
    items: [
      "Track and analyze your funnel’s performance.",
      "Get detailed, easy-to-read campaign insights.",
      "Monitor every traffic source with custom tracking links.",
    ],
    cta: "Take Control of Your Analytics",
    highlight: "No spreadsheets, no guesswork — just the numbers you need to raise more, faster.",
  },
  {
    title: "Test What Works With Built-In A/B Testing",
    description:
      "Not sure which headline, image, or call-to-action will convert best? Test it and find out. LaunchVault makes it easy to run A/B tests so you know exactly what resonates with your audience.",
    items: [
      "Set up tests in minutes — no coding required.",
      "Watch real-time performance as it happens.",
      "Pick the winner and keep optimizing from there.",
    ],
    cta: "Supercharge Your Campaign With A/B Testing",
    highlight: "Stop guessing. Start testing, improving, and converting.",
  },
  {
    title: "AI-Powered. Human-Refined. Built to Convert.",
    description:
      "Tired of staring at a blank page trying to write ads and landing page copy? Let AI do the heavy lifting. Share a few details about your product, click a button, and get persuasive, ready-to-use copy in seconds.",
    items: [
      "Enter a few key details about your product or service.",
      "Generate landing page and campaign copy instantly.",
      "Get multiple ad variations built for different audiences.",
    ],
    cta: "Supercharge Your Campaign With AI-Powered Copy",
    highlight: "No more writer’s block — just messaging built to convert.",
  },
  {
    title: "Full Ownership of Your Campaign",
    description:
      "With Lift & Launch, you’re always in the driver’s seat — never a platform’s passenger. Everything about your campaign, your audience, and your revenue stays yours.",
    items: [
      "Build and host your funnel on your own domain.",
      "Connect your own payment processor with ease.",
      "Sync directly with your email marketing platform.",
    ],
    cta: "Own Your Entire Crowdfunding Journey",
    highlight: "No middlemen, no platform restrictions — just full control.",
  },
  {
    title: "The Smartest Way to Maximize Your ROI",
    description:
      "A successful campaign isn’t only about how much you raise — it’s about optimizing every step to get the most out of what you invest.",
    items: [
      "Attract more engaged backers and investors through precision targeting.",
      "Optimize your ad spend and focus on what works.",
      "Fine-tune every part of your campaign with live analytics and A/B testing.",
    ],
    cta: "Use LaunchVault for Your Launch",
    highlight: "Raise more, spend smarter, and scale faster.",
  },
];

export default function Services() {
  const seo = pageSeo.services;

  return (
    <div className="bg-white text-black">
      <Seo {...seo} />

      <section className="max-w-screen-xl mx-auto px-4 pt-10 md:pt-20 pb-8">
        <p className="text-sm font-semibold text-yellow-600 uppercase mb-2">
          Our Tech
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#001d59]">
          Power Your Campaign With the Lift &amp; Launch LaunchVault
        </h1>
        <p className="text-gray-600 max-w-3xl text-lg mb-6">
          Without the right tools, crowdfunding feels like guesswork. LaunchVault
          gives you the clarity and insight to launch with confidence and get the
          most out of every dollar you spend.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full"
        >
          Get the Right Tools for Your Launch
        </Link>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        {features.map((feature, i) => (
          <article
            key={feature.title}
            className="grid md:grid-cols-2 gap-10 items-center mb-20 border-b border-gray-100 pb-16 last:border-0"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <img
                src="/service/image.png"
                alt={feature.title}
                className="rounded-lg w-full md:w-4/5 h-auto object-cover"
                loading="lazy"
                width={560}
                height={360}
              />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h2>
              <p className="text-sm text-gray-700 mb-4">{feature.description}</p>
              {feature.highlight && (
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  {feature.highlight}
                </p>
              )}
              <div className="space-y-2 text-sm text-black mb-6">
                {feature.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      className="text-yellow-500 mt-[2px] shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                className="inline-block bg-yellow-400 text-black text-sm px-6 py-2 rounded-full hover:bg-yellow-500 transition font-semibold"
              >
                {feature.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="relative w-full bg-white mb-[120px]">
        <div className="relative w-full h-96 md:h-[420px]">
          <img
            src="/service/banner.webp"
            alt="Lift & Launch crowdfunding support"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 z-10 w-[90%] md:w-auto">
          <div className="rounded-2xl md:px-20 px-5 py-7 md:py-12 text-center bg-[radial-gradient(ellipse_at_50%_50%,#ffffff,#FFD700_90%)] shadow-lg">
            <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
              With Lift &amp; Launch, you&apos;re not just preparing for a
              campaign — you&apos;re setting yourself up to actually get funded.
            </h2>
            <p className="text-gray-700 mt-4 md:text-base text-sm max-w-2xl mx-auto">
              Our system is built to help you raise more, spend smarter, and scale
              faster — whatever kind of campaign you&apos;re running.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-black text-white px-12 py-2 rounded-full hover:bg-black/90 transition-all duration-300 text-center mt-6"
            >
              Book a Free Strategy Call
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

    </div>
  );
}
