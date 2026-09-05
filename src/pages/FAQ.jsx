import React from 'react';
import { Link } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import Seo from '../seo/Seo';
import { pageSeo } from '../seo/seoConfig';
import { mockFaqs } from '../data/staticData';

const FAQ = () => {
  const seo = pageSeo.faq;

  return (
    <div className="bg-white min-h-screen py-10">
      <Seo
        {...seo}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: mockFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <FAQSection />

      <section className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="bg-yellow-400/10 rounded-3xl p-10 border border-yellow-400/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Fill out our contact form — it takes less than a minute — or book a
            free strategy call. We&apos;re here whenever you need us.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all shadow-md"
          >
            Book a Free Strategy Call
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
