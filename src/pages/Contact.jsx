import React from "react";
import InquiryFormMultiStep from "../components/InquiryFormMultiStep";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";

const Contact = () => {
  const seo = pageSeo.contact;

  return (
    <section className="bg-gray-50 min-h-screen">
      <Seo {...seo} />
      <div className="max-w-7xl mx-auto md:px-8 px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="md:text-5xl text-3xl text-gray-900 font-extrabold uppercase relative inline-block">
            Book a Free Strategy Call
            <div className="absolute -bottom-2 right-0 w-2/3 h-3 bg-yellow-400 -rotate-1 -z-10 rounded-full opacity-60"></div>
          </h1>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Tell us where you are in your crowdfunding journey. Fill out the form
            below — it takes less than a minute — and our team will help you map
            your next move.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-16">
          <div className="md:col-span-3">
            <InquiryFormMultiStep />
          </div>

          <div className="md:col-span-2 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform">
                    <svg height="24" width="24" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
                      <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:hello@liftnlaunch.com"
                      className="text-gray-900 font-bold text-lg hover:text-yellow-600"
                    >
                      hello@liftnlaunch.com
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">
                    What to expect
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We&apos;ll talk through your stage (idea, prototype, or
                    scaling business), your USP, and the backers or investors
                    you&apos;re aiming for — then chart a clear path with Lift
                    &amp; Launch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
