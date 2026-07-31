import React from 'react';
import FAQSection from '../components/FAQSection';

const FAQ = () => {
  return (
    <div className="bg-white min-h-screen py-10">
        <FAQSection />
        
        {/* Additional FAQ CTA */}
        <section className="max-w-4xl mx-auto px-4 mt-20 text-center">
          <div className="bg-yellow-400/10 rounded-3xl p-10 border border-yellow-400/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8">
              If you couldn't find the answer you were looking for, feel free to reach out to our support team.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all shadow-md"
            >
              Contact Support
            </a>
          </div>
        </section>
    </div>
  );
};

export default FAQ;
