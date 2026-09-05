import React, { useState } from 'react';
import { mockFaqs } from '../data/staticData';

export default function FAQSection() {
  const [faqs] = useState(mockFaqs);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto md:px-8 px-4 md:py-14 py-8">
      <div className="relative w-fit mx-auto">
        <h1 className="md:text-4xl text-2xl text-gray-900 font-semibold uppercase relative z-10">
          Frequently Asked Questions
        </h1>
        <div className="absolute md:bottom-1 bottom-0 md:right-2 left-1 md:w-64 w-36 h-2 bg-[#ffad19] -rotate-2 z-0"></div>
      </div>

      <p className="md:w-[590px] w-full md:mt-8 mt-6 text-gray-600 mx-auto text-center">
        Find answers to the most common questions about launching and funding your next venture with Lift & Launch.
      </p>

      <div className="md:mt-12 mt-8 max-w-5xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="shadow-sm border border-gray-200 rounded-lg md:px-6 px-4 py-4 mb-5"
          >
            <h4
              onClick={() => toggleFAQ(index)}
              className="text-gray-900 font-semibold md:text-base text-sm cursor-pointer inline-flex items-center justify-between w-full"
            >
              {faq.question}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="29"
                viewBox="0 0 30 29"
                fill="none"
                className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
              >
                <path
                  d="M21.2068 11.5L14.9999 17.5L8.79297 11.5"
                  stroke="#6D6D6D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </h4>
            {openIndex === index && (
              <p className="text-gray-500 mt-4 md:text-base text-xs">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
