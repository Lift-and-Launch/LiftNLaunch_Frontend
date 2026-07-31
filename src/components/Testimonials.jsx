import React from 'react';
import Clients from './Clients';

const Testimonials = () => {
  return (
    <div className='pb-24 bg-white'>
      {/* Testimonials Title (Optional additional heading if needed) */}
      <div className="text-center pt-20 mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase">
          Client <span className="text-blue-900">Voices</span>
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main carousel */}
      <Clients />

      {/* Featured Quote Section */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full md:w-5/12 relative group">
            <div className="absolute -inset-4 bg-yellow-400/20 rounded-[2.5rem] -rotate-3 scale-95 group-hover:rotate-0 group-hover:scale-100 transition-all duration-500"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/index/image (5).png"
                alt="Featured Partner"
                className="object-cover w-full h-[300px] md:h-[400px] transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
          <div className="w-full md:w-7/12">
            <div className="text-yellow-400 mb-6">
                <svg width="60" height="45" viewBox="0 0 60 45" fill="currentColor">
                    <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27H18V36C18 40.9706 13.9706 45 9 45H7.5V45L7.5 45V45.0045L7.5 45.009L7.5 45.0135L7.5 45.018L7.5 45.0225L7.5 45.027L7.5 45.0315L7.5 45.036V45.0405V45.045C7.5 45.045 13.125 45 22.5 31.5V13.5C22.5 6.04416 16.4558 0 9 0H13.5Z" opacity="0.2"/>
                    <path d="M51 0C43.5442 0 37.5 6.04416 37.5 13.5C37.5 20.9558 43.5442 27 51 27H55.5V36C55.5 40.9706 51.4706 45 46.5 45H45V45L45 45V45.0045L45 45.009L45 45.0135L45 45.018L45 45.0225L45 45.027L45 45.0315L45 45.036V45.0405V45.045C45 45.045 50.625 45 60 31.5V13.5C60 6.04416 53.9558 0 46.5 0H51Z" opacity="0.2"/>
                </svg>
            </div>
            <p className="text-gray-900 text-xl md:text-2xl font-bold leading-relaxed italic">
              "Turn your ideas into reality with expert crowdfunding support. From campaign strategy to marketing, we guide you every step of the way to achieve your funding goals."
            </p>
            <div className="mt-8">
              <p className="text-gray-900 font-black text-lg">Sarah Jenkins</p>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Co-Founder, Impact Ventures</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
