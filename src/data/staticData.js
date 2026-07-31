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
    question: 'How do I start a campaign?',
    answer: 'Simply sign up and click on "Create Campaign" in your dashboard.'
  },
  {
    id: 'f2',
    question: 'Is my donation tax-deductible?',
    answer: 'It depends on your local laws and the project status.'
  }
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
