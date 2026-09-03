import React, { useState } from "react";

const tabContent = {
  "Just Have an Idea?": {
    text: "You don't need a finished product to run a successful campaign — you need the right strategy. Whether you're working from a sketch, a rough prototype, or a polished product, our system meets you where you are and walks you toward launch day with confidence.",
  },
  "Have a Working Prototype?": {
    text: "Great — now it's time to turn that prototype into a funded product. We specialize in positioning strong products for maximum crowdfunding impact: a high-converting campaign, a loyal backer audience, and a launch strategy built to gain real traction.",
  },
  "Ready for Investors?": {
    text: "You've already got customers, traction, and a vision for what's next. Now it's time to raise capital and scale. We help growing businesses navigate equity crowdfunding — positioning your company, attracting the right investors, and turning your community into stakeholders. Whether you're headed to Republic, Wefunder, StartEngine, or Lift & Launch Seed Ventures, we'll help you build a campaign that fuels your next chapter.",
  }
};

const Process = () => {
  const [selectedTab, setSelectedTab] = useState("Just Have an Idea?");
  const tabs = Object.keys(tabContent);

  return (
    <div className="bg-white text-black font-sans pb-20">
      
      {/* SECTION 1: HERO */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-gray-900">
            Success Starts Before <span className="text-blue-900">You Launch</span>
          </h1>
          <p className="mb-6 text-gray-600 text-lg md:text-xl font-medium">
            Want to get funded fast? It all comes down to what happens before launch day.
          </p>
          <p className="mb-10 text-gray-600 text-lg leading-relaxed">
            The pre-launch phase is where the real momentum gets built — so when your campaign finally goes live, you're not crossing your fingers for backers. You're opening the floodgates to backers who are already waiting to support your vision. People are ready to invest in your venture. Are you ready to accept it?
          </p>
          <p className="mb-10 text-xl font-bold text-gray-900">
            Do it right, and you can hit - or blow past your initial goal. Fund Your Campaign. From Day One. Your Launch. Your Momentum. Your Next Move.
          </p>
          <button className="bg-yellow-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Fund Your Campaign
          </button>
        </div>
      </section>

      {/* SECTION 2: PRE-LAUNCH PARTNER */}
      <section className="py-20 px-6 bg-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-wide text-yellow-400">
            Your Pre-Launch Partner for Crowdfunding Success
          </h2>
          <p className="text-xl leading-relaxed mb-6 font-light">
            The pre-launch stage is where most creators get stuck. With the right partner, it becomes your biggest advantage instead.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Since 2015, we've focused on one thing: perfecting pre-launch strategy. With 30+ years of combined team experience, we know what moves the needle in crowdfunding — and what's a waste of your time and budget. Let's take the guesswork out of your launch and turn your idea into a fully funded reality.
          </p>
        </div>
      </section>

      {/* SECTION 3: WHEREVER YOU'RE STARTING FROM */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase text-gray-900">
          Wherever You're <span className="text-blue-900 underline decoration-yellow-400">Starting From</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Tabs Navigation */}
          <div className="w-full md:w-1/3 text-left">
            <ul className="space-y-4">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`cursor-pointer px-6 py-5 rounded-2xl font-bold transition-all text-lg border-2 ${
                    selectedTab === tab 
                    ? "bg-blue-900 text-white border-blue-900 shadow-xl translate-x-2" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>

          {/* Tabs Content */}
          <div className="w-full md:w-2/3 bg-yellow-50 p-12 rounded-3xl border border-yellow-200 shadow-sm text-left min-h-[300px] flex items-center">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">{selectedTab}</h3>
              <p className="text-gray-700 text-xl leading-relaxed font-medium">
                {tabContent[selectedTab].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SIX-STEP PROCESS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase leading-tight mb-6">
              A Proven, Six-Step Process <span className="text-blue-900 block mt-2">for Crowdfunding Growth</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Raising funds isn't just about launching a page — it's about building a business that attracts backers and investors alike. Our step-by-step system makes sure you're not just crowdfunding — you're building something scalable and profitable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: "Lay a Solid Business Foundation",
                description: "Before you raise a single dollar, your business needs a foundation that can hold the weight. We help you sharpen your strategy using business model or lean-startup principles, financial projections, and the legal groundwork investors expect to see.",
              },
              {
                id: 2,
                title: "Build a Superfan Funnel",
                description: "Think of this as your pre-launch engine. We build you a high-converting landing page that collects emails and builds a waitlist of supporters — people who are excited to back you the moment you go live.",
              },
              {
                id: 3,
                title: "Identify the Audience That Loves Your Brand",
                description: "There are people out there already looking to invest in what you're building. We help you find them, craft a message that resonates, and map out the ad budget it'll take to reach them.",
              },
              {
                id: 4,
                title: "Scale Quickly and Profitably",
                description: "Using the data from your pre-launch, we fine-tune your ad spend to reach only your most engaged, ready-to-buy backers — keeping costs down and returns high.",
              },
              {
                id: 5,
                title: "Launch With Confidence",
                description: "No guesswork, no cold feet. By the time launch day arrives, you'll have a tested strategy and an engaged audience ready to fund your campaign fast.",
              },
              {
                id: 6,
                title: "Maximize the Power of a Quick Funding Start",
                description: "A strong opening isn't just about the money — it boosts your ranking on crowdfunding platforms, attracts free organic traffic, and opens doors to bigger opportunities down the line.",
              },
            ].map((step) => (
              <div key={step.id} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black font-black text-3xl mb-8 shadow-md">
                  {step.id}
                </div>
                <h4 className="text-gray-900 font-extrabold text-2xl mb-4 leading-tight">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR METHODOLOGY */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase leading-tight mb-6">
            OUR METHODOLOGY — <span className="text-blue-900 block mt-2">THE LIFT & LAUNCH PROCESS</span>
          </h2>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">A Step-by-Step System Built for Real Results</h3>
          <p className="text-2xl text-red-600 font-black mb-6">Most Crowdfunding Campaigns Never Reach Their Funding Goal.</p>
          <p className="text-gray-600 max-w-4xl mx-auto mb-6 text-xl leading-relaxed">
            Fewer than one in three campaigns reach full funding, while more than half struggle to reach even 10% of their target. Our four-step process exists to change those odds — guiding entrepreneurs, small businesses, nonprofits, and community groups from a rough idea to a campaign that's ready to succeed.
          </p>
        </div>

        <div className="space-y-16">
          {/* Step 1 */}
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-lg border-t-8 border-yellow-400">
            <h3 className="text-3xl font-black text-blue-900 uppercase mb-4">Step 1: Education — Learn What Actually Works</h3>
            <p className="text-xl font-bold text-gray-800 mb-4">Goal: Help you understand how crowdfunding works and build realistic expectations before you commit.</p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">We start by exploring whether crowdfunding is genuinely the right move for you — looking at your readiness to tap your network, your comfort with putting yourself out there, and the full value a campaign can bring beyond just the money raised.</p>
            <h4 className="font-bold text-xl mb-4 text-gray-900">What this stage covers:</h4>
            <ul className="list-disc list-inside text-gray-600 text-lg space-y-4">
              <li><strong>Map Your First Backers</strong> — Identify the people already in your network who can become your earliest supporters, advocates, and potential backers.</li>
              <li><strong>Are You Crowdfunding-Ready?</strong> — Assess your readiness to show up, tell your story, build an audience, and confidently make the ask.</li>
              <li><strong>Beyond the Money</strong> — Explore what crowdfunding can unlock beyond capital—from market validation and brand exposure to strategic partnerships and a loyal community.</li>
              <li><strong>The Crowdfunding Cheat Sheet</strong> — Quickly understand the four core crowdfunding models.</li>
              <li><strong>Crowdfunding 101</strong> — A concise video course covering how crowdfunding works, what to expect, and the key steps to building a campaign designed for success.</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-lg border-t-8 border-yellow-400">
            <h3 className="text-3xl font-black text-blue-900 uppercase mb-4">Step 2: Strategy — Assessment & Roadmap</h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">Once we understand your readiness, willingness, and the value you're after, we build your roadmap together.</p>
            
            <div className="grid md:grid-cols-2 gap-12 mb-10">
              <div>
                <h4 className="font-bold text-xl mb-6 text-gray-900 bg-gray-50 p-4 rounded-xl">Choosing Your Strategy:</h4>
                <ul className="list-none text-gray-600 text-lg space-y-4">
                  <li>🚀 <strong>CrowdStarter</strong> — Launching a brand-new idea, product, or service.</li>
                  <li>🔍 <strong>CrowdValidator</strong> — Testing a concept and validating market interest.</li>
                  <li>📈 <strong>CrowdScaler</strong> — Expanding or growing something that already exists.</li>
                  <li>🤝 <strong>CrowdPatron</strong> — Building ongoing support from your community.</li>
                  <li>🏁 <strong>CrowdFinisher</strong> — Carrying a project across the finish line.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-6 text-gray-900 bg-gray-50 p-4 rounded-xl">Choosing Your Crowdfunding Type:</h4>
                <ul className="list-none text-gray-600 text-lg space-y-4">
                  <li>💖 <strong>Donation-Based</strong> — Support given with no expectation of return.</li>
                  <li>🎁 <strong>Rewards-Based</strong> — Backers receive a product, service, or perk.</li>
                  <li>💸 <strong>Microlending</strong> — Supporters offer small loans, repaid over time.</li>
                  <li>📈 <strong>Investment-Based</strong> — Contributors receive equity or a financial return.</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h4 className="font-black text-xl mb-4 text-blue-900">Your Crowdfunding Roadmap Package Includes:</h4>
              <ul className="list-disc list-inside text-gray-700 text-lg space-y-3 font-medium">
                <li>An online readiness questionnaire to map your current position.</li>
                <li>A personalized 7–10 page "report card" covering your readiness chart, funding averages for similar campaigns, comparable campaign links, key insights, and 3–4 marketing focus areas.</li>
                <li>A 45-minute one-on-one strategy session to review your report and plan next steps together.</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-lg border-t-8 border-yellow-400">
            <h3 className="text-3xl font-black text-blue-900 uppercase mb-4">Step 3: Training — Marketing & Network Preparation</h3>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">This phase equips you with the strategy, marketing skills, and network-activation tools you'll need for a strong campaign.</p>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-xl mb-6 text-gray-900 border-b-2 border-gray-100 pb-2">Core Areas We Strengthen:</h4>
                <ul className="list-disc list-inside text-gray-600 text-lg space-y-4">
                  <li><strong>Solidify Your Business Fundamentals</strong> — Strengthen your business plan, financials, legal structure, and overall foundation.</li>
                  <li><strong>Sharpen Your Story & Brand</strong> — Build a compelling narrative, clear positioning, and content that gives people a reason to believe in what you’re building.</li>
                  <li><strong>Build Marketing That Works</strong> — Create outreach and conversion systems that consistently attract, engage, and move your audience toward action.</li>
                  <li><strong>Grow Your Community & Network</strong> — Build genuine relationships with potential backers, customers, partners, and advocates before you launch.</li>
                  <li><strong>Strengthen Your Team</strong> — Expand your team’s capabilities and close the skill gaps that could hold your campaign or business back.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-6 text-gray-900 border-b-2 border-gray-100 pb-2">Crowdfunding-Specific Training:</h4>
                <ul className="list-disc list-inside text-gray-600 text-lg space-y-4">
                  <li><strong>Network readiness</strong> — Organizing contacts by influence and identifying your "first 30%" of launch champions.</li>
                  <li><strong>Storytelling</strong> — Building modular story blocks for your page, video, emails, and social content.</li>
                  <li><strong>Email marketing</strong> — Building your list, sequence, and copy from proven templates.</li>
                  <li><strong>Social & content planning</strong> — A consistent, platform-tailored posting rhythm.</li>
                  <li><strong>Rewards strategy</strong> — Designing rewards that align with your funding goals and margins.</li>
                  <li><strong>Legal & financial compliance</strong> — Understanding Reg CF and platform-specific requirements.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-lg border-t-8 border-yellow-400">
            <h3 className="text-3xl font-black text-blue-900 uppercase mb-4">Step 4: Support — Campaign Page & Beyond</h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">Your campaign page needs to do more than look good—it needs to tell your story, build trust, and turn interest into action. We bring strategy, storytelling, and precision together to create a page built to convert.</p>
            <h4 className="font-bold text-xl mb-6 text-gray-900">Here's how we do it in three steps:</h4>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl flex gap-6 items-start border border-gray-100">
                <div className="bg-blue-900 text-white font-black w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-xl">1</div>
                <p className="text-gray-700 text-lg"><strong className="text-gray-900">Story Flow</strong> — Weave your mission, impact, and offer into one compelling narrative that moves people to act.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex gap-6 items-start border border-gray-100">
                <div className="bg-blue-900 text-white font-black w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-xl">2</div>
                <p className="text-gray-700 text-lg"><strong className="text-gray-900">Conversion-Focused Structure</strong> — Organize every section, visual, and call-to-action to guide visitors from curiosity to confidence—and ultimately, to backing.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex gap-6 items-start border border-gray-100">
                <div className="bg-blue-900 text-white font-black w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-xl">3</div>
                <p className="text-gray-700 text-lg"><strong className="text-gray-900">Copyediting & Proofreading</strong> — Refine every word for clarity, credibility, consistency, and persuasive impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-24 px-6 bg-yellow-400 text-black text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-8 uppercase leading-tight">
            Where Are You on Your <span className="text-blue-900 block mt-2">Crowdfunding Journey?</span>
          </h3>
          <p className="text-xl md:text-2xl font-medium mb-12 leading-relaxed opacity-90">
            That was a lot to take in, right? — But you don't have to map it out alone. Before you dive into a campaign, let's talk. Tell us where you are in the process, what your strengths and weaknesses are, what your USP is, and what kind of backers you are looking for, and we'll help you chart the best path forward. Whether you're still refining your business model, reassessing your venture's needs, growing your audience, or ready to hit launch, we will help you at each step.
          </p>
          <button className="bg-blue-900 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-2">
            Book a Free Strategy Call & Map Out Your Next Move
          </button>
        </div>
      </section>
    </div>
  );
};

export default Process;
