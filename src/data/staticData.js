export const mockCampaigns = [
  {
    id: '1',
    title: 'Clean Water for Rural Communities',
    description: 'Providing sustainable clean water solutions to over 50 villages.',
    logoUrl: '/campaign/image (13).png',
    galleryImages: ['/campaign/water-1.jpg', '/campaign/water-2.jpg'],
    amountRaised: 45000,
    fundingTarget: 100000,
    investorCount: 120,
    equityOffered: 10,
    preMoneyValuation: 900000,
    sharePrice: 10,
    status: 'active',
    categories: ['Environment', 'Health'],
    deadline: '2026-12-31',
    valueHighlights: ['Sustainable Technology', 'Proven Impact'],
    sections: [
      { title: 'The Problem', description: 'Lack of clean water leads to diseases.' },
      { title: 'Our Solution', description: 'Solar-powered filtration systems.' }
    ]
  },
  {
    id: '2',
    title: 'Urban Education Initiative',
    description: 'Empowering city youth with modern coding and design skills.',
    logoUrl: '/campaign/image (16).png',
    galleryImages: ['/campaign/edu-1.jpg'],
    amountRaised: 75000,
    fundingTarget: 80000,
    investorCount: 250,
    equityOffered: 5,
    preMoneyValuation: 1500000,
    sharePrice: 20,
    status: 'active',
    categories: ['Education', 'Technology'],
    deadline: '2026-10-15',
    valueHighlights: ['High Demand Skills', 'Direct Community Support'],
    sections: [
      { title: 'Mission', description: 'Bridging the digital divide.' }
    ]
  }
];

export const mockServices = [
  {
    id: 's1',
    title: 'Community Fundraising',
    description: 'We help you set up and manage fundraising campaigns.',
    icon: 'layout'
  },
  {
    id: 's2',
    title: 'Mentor Matching',
    description: 'Connect with experts who can guide your project.',
    icon: 'users'
  }
];

export const mockBlogs = [
  {
    id: 'b1',
    title: 'The Future of Community Crowdfunding',
    excerpt: 'How blockchain and local networks are changing the game.',
    content: '<p>Crowdfunding is evolving...</p>',
    author: 'Admin',
    date: '2026-04-01',
    imageUrl: '/blog/1.png'
  }
];

export const mockFaqs = [
  {
    id: 'f1',
    question: 'How much does Lift & Launch cost?',
    answer:
      'Pricing is tailored to your goals, campaign, and growth stage. Whether you’re launching a product, service, or equity round, choose from flexible packages designed to fit your needs—including founder-friendly payment plans. Tell us what you’re building, and we’ll create a custom quote for your campaign.',
  },
  {
    id: 'f2',
    question: 'What is a Reservation Funnel, and do you need one?',
    answer:
      'A Reservation Funnel helps you capture early interest before your campaign goes live, so you launch with a list of supporters already primed to back you. It’s not required, but it’s one of the most effective ways to validate demand and build early momentum—and if it’s not the right fit, we have other funnel types to match your goals.',
  },
  {
    id: 'f3',
    question: 'How do you know if you need a Reservation Funnel?',
    answer:
      'If you need to prove demand, build a waitlist, or collect early commitments before launch day, a Reservation Funnel is usually the right move. If you’re already sitting on a warm audience or running a different model (equity, ongoing pre-sales), we’ll recommend another funnel type that matches your goal.',
  },
  {
    id: 'f4',
    question: 'How do you decide what funnel type matches your goal?',
    answer:
      'We map your campaign type (product, service, or equity), timeline, and audience maturity to the funnel that converts best—reservation, waitlist, deposit, or investor-focused. You’ll leave with a clear recommendation, not a one-size-fits-all page.',
  },
  {
    id: 'f5',
    question: 'What kind of analytics will you get?',
    answer:
      'Real-time reporting on funnel performance, traffic sources, conversion rates, A/B test results, and ad performance—all in one dashboard.',
  },
  {
    id: 'f6',
    question: 'Is the platform easy to use, even if you are not a marketer?',
    answer:
      'Yes. LaunchVault is built for beginners and experienced marketers alike—an intuitive dashboard, drag-and-drop tools, and clear guides make it easy to set up and manage. And if you get stuck, our support team is a message away.',
  },
  {
    id: 'f7',
    question: 'Do you need a finished prototype to get started?',
    answer:
      'Nope. You can start ad testing with renders before your prototype is even finished—in fact, starting earlier gives you real feedback from real customers while there’s still time to improve. Our program runs on your timeline. That said, a prototype matters more for product-based campaigns; for equity or service-based campaigns, a strong business model and proof of concept carry more weight.',
  },
  {
    id: 'f8',
    question: 'How much should you expect to spend on ads?',
    answer:
      'Your actual budget depends on your goals, audience, and platform, and we’ll help you land on the right figure using your own results. For the testing phase, plan on somewhere between $1,000–$2,000. We only recommend scaling spend once the data shows a likely return—a gradual, stair-step approach rather than throwing money at the wall and hoping.',
  },
  {
    id: 'f9',
    question: 'How much will you actually raise?',
    answer:
      'There’s no one-size-fits-all number—but our process helps you find the right investment for your campaign. By testing during the pre-launch phase and using your own campaign data, we can forecast performance, identify what’s working, and build a clearer picture of what it will take to reach your funding goal.',
  },
  {
    id: 'f10',
    question: 'What do you need to get started — what creatives are required?',
    answer:
      'Just renders or basic photography of your product to begin—nothing expensive required. Many of our creators’ best-performing images were shot on a smartphone. Beyond visuals, you’ll want a clear campaign message, a compelling landing page, and a plan for building your audience—and we’ll help you put all of it together.',
  },
  {
    id: 'f11',
    question: 'What’s the timeline to launch?',
    answer:
      'It depends on how long it takes to build a strong enough email list. Based on a decade of launching campaigns, we’ve found pre-launch needs at least two months to get the best results. In general, expect 6–12 weeks of preparation covering audience-building, testing, and content creation.',
  },
  {
    id: 'f12',
    question: 'Can you pause if something delays your launch?',
    answer:
      'Yes. Our program covers one full product launch with no fixed time limit. If you hit a delay, pause and pick back up whenever you’re ready—we’ll help you adjust, pivot, or refine your strategy as needed.',
  },
  {
    id: 'f13',
    question: 'Which platform should you launch on?',
    answer:
      'It depends on your campaign type: Kickstarter and Indiegogo work well for product-based crowdfunding; Wefunder, StartEngine, Republic, and Lift & Launch Seed Ventures suit equity crowdfunding; and self-hosted platforms are a strong fit for ongoing pre-sales or independent fundraising. We’ll help you match the right platform to your goals.',
  },
  {
    id: 'f14',
    question: 'Can you work alongside other agencies?',
    answer:
      'Absolutely—we’re happy to collaborate with other marketing or ad agencies you’re already working with. Our goal is your success no matter what the team looks like.',
  },
  {
    id: 'f15',
    question: 'Is Lift & Launch a course?',
    answer:
      'No. Lift & Launch is a full-service crowdfunding strategy and marketing partner, not a course you work through alone. We provide hands-on guidance, proven tools, and expert strategy to help you raise funds successfully—whether through rewards-based or equity crowdfunding.',
  },
  {
    id: 'f16',
    question: 'What’s the best way to get in touch?',
    answer:
      'Fill out our contact form—it takes less than a minute—or reach us directly for quick questions. You can also book a free strategy call. We’re here whenever you need us.',
  },
];

export const mockTestimonials = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    role: 'Local Founder',
    text: 'This platform helped us raise the funds we needed in record time!',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  }
];
