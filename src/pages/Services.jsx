import React from "react";
import { CheckCircle } from "lucide-react";
import FAQSection from "../components/FAQSection";

export default function Services() {
  return (
    <div className="bg-white text-black font-sans pb-20">
      
      {/* HEADER SECTION */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase text-gray-900 leading-tight">
            Our Tech — Power Your Campaign <span className="text-blue-900 block mt-2">With the Lift & Launch Launch Vault</span>
          </h2>
          <p className="mb-6 text-gray-700 text-xl leading-relaxed font-medium">
            LaunchVault is our all-in-one toolkit built to help creators, startups, and growing businesses launch, fund, and scale — whether you’re launching a new venture, funding a product, or expanding an existing business
          </p>
          <ul className="text-left text-gray-700 text-lg space-y-3 mb-8 max-w-2xl mx-auto list-disc list-inside">
            <li>Build and warm up your audience before you ever go live.</li>
            <li>Get more out of every ad dollar with smarter optimization.</li>
            <li>Track the metrics that actually matter, in real time.</li>
            <li>Turn backers and investors into believers with data-backed messaging.</li>
          </ul>
          <p className="mb-10 text-gray-700 text-lg font-bold">
            Whether you're running a product launch, a service-based campaign, or raising capital through equity crowdfunding, LaunchVault gives you the edge to get it done.
          </p>
          <button className="bg-yellow-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            👉 Use LaunchVault for Your Launch
          </button>
          <p className="mt-4 text-sm text-gray-500 italic">Available exclusively to Lift & Launch clients.</p>
        </div>
      </section>

      {/* WITHOUT THE RIGHT TOOLS */}
      <section className="py-20 px-6 bg-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase text-yellow-400 leading-tight">
            Without the Right Tools, Crowdfunding Feels Like Guesswork
          </h2>
          <p className="text-xl leading-relaxed mb-6 font-light">
            How do you know you're on the right track? Without solid data behind you, you're left asking:
          </p>
          <ul className="text-left text-gray-200 text-lg space-y-3 mb-8 max-w-xl mx-auto list-disc list-inside">
            <li>Which strategy will actually get me results?</li>
            <li>How do I find and reach the right backers or investors?</li>
            <li>What do these numbers even mean — and what do I do about them?</li>
          </ul>
          <p className="text-lg leading-relaxed text-gray-200 font-bold mb-8">
            You don't have to figure it out solo. LaunchVault gives you the clarity and insight to launch with confidence and get the most out of every dollar you spend.
          </p>
          <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            👉 Get the Right Tools for Your Launch
          </button>
        </div>
      </section>

      {/* FEATURES SECTIONS */}
      <section className="max-w-screen-xl mx-auto px-6 py-24 space-y-24">

        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">Your Pre-Launch Funnel, Built Specially for You <span className="text-blue-900 block">— No Tech Skills Needed</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">Whether you’re launching a product, a service, or an equity round, Launch Vault helps you build a high-converting funnel that attracts the right backers and investors—and gets them ready to take action.</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Start from proven, high-converting templates.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Customize everything with a simple drag-and-drop builder.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Collect pre-launch deposits and build your community before day one.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">With Lift & Launch, you're not just preparing for a campaign — you're setting yourself up to actually get funded.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Start Building Your Pre-Launch Funnel</button>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="Funnel" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="Audience" className="w-full h-full object-cover rounded-3xl" />
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">Reach Audiences That Are <span className="text-blue-900">Already Looking for You!</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">Imagine starting your campaign with a built-in head start. Instead of building an audience from zero, we connect you to pre-qualified backers who are already active and engaged in your category. Here’s how we make it happen:-</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> We target proven, high-converting audiences across crowdfunding categories.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> We sync audience data seamlessly with your Meta Ads & Google Ads account.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> We stay privacy-compliant while getting the most from every ad.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">Skip the trial and error. Reach the right people faster, spend smarter, and scale quicker.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Start Targeting the Right Audience</button>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">Analytics That <span className="text-blue-900">Actually Make Sense</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">You don't need to be a data scientist to run a high-performing campaign. Our dashboard gives you clear, actionable insight into what's working, what isn't, and where to focus next.</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Track and analyze your funnel's performance.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Get detailed, easy-to-read campaign insights.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Monitor every traffic source with custom tracking links.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">No spreadsheets, no guesswork — just the numbers you need to raise more, faster.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Take Control of Your Analytics</button>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="Analytics" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>

        {/* Feature 4 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="A/B Testing" className="w-full h-full object-cover rounded-3xl" />
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">Test What Works With <span className="text-blue-900">Built-In A/B Testing</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">Not sure which headline, image, or call-to-action will convert best? Test it and find out. LaunchVault makes it easy to run A/B tests so you know exactly what resonates with your audience.</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Set up tests in minutes — no coding required.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Watch real-time performance as it happens.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Pick the winner and keep optimizing from there.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">Stop guessing. Start testing, improving, and converting.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Supercharge Your Campaign With A/B Testing</button>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">AI-Powered. Human-Refined. <span className="text-blue-900">Built to convert.</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">Tired of staring at a blank page trying to write ads and landing page copy? Let AI do the heavy lifting. Just share a few details about your product, click a button, and get a persuasive, ready-to-use copy in seconds.</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Enter a few key details about your product or service.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Generate landing page and campaign copy instantly.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Get multiple ad variations built for different audiences.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">No more writer's block, no more wasted hours — just messaging built to convert.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Supercharge Your Campaign With AI-Powered Copy</button>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="AI Copy" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>

        {/* Feature 6 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="Ownership" className="w-full h-full object-cover rounded-3xl" />
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">Full Ownership of Your Campaign, <span className="text-blue-900">From Start to Finish</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">With Lift & Launch, you're always in the driver's seat — never a platform's passenger. Everything about your campaign, your audience, and your revenue stays yours.</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Build and host your funnel on your own domain.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Connect your own payment processor with ease.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Sync directly with your email marketing platform.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">No middlemen, no platform restrictions — just full control of your journey and your success.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Own Your Entire Crowdfunding Journey</button>
          </div>
        </div>

        {/* Feature 7 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight uppercase">The Smartest Way to <span className="text-blue-900">Maximize Your ROI</span></h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">A successful campaign isn't only about how much you raise — it's about optimizing every step to get the most out of what you invest. With Lift & Launch, you'll:</p>
            <ul className="text-gray-700 space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Attract more engaged backers and investors through precision targeting.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Optimize Your Ad Spend and focus on What Works.</li>
              <li className="flex items-start gap-3"><CheckCircle size={24} className="text-yellow-500 shrink-0 mt-1" /> Fine-tune every part of your campaign with live analytics and A/B testing.</li>
            </ul>
            <p className="font-bold text-gray-900 mb-6">Our system is built to help you raise more, spend smarter, and scale faster — whatever kind of campaign you're running.</p>
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-md">👉 Use LaunchVault for Your Launch</button>
          </div>
          <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center shadow-inner">
             <img src="/service/image.png" alt="ROI" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>

      </section>

      {/* FAQ SECTION */}
      <FAQSection />

    </div>
  );
}
