import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
} from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer>
      <div className="bg-yellow-400 text-center py-10 px-4">
        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 max-w-4xl mx-auto">
          Ready to Launch &amp; Get Funded?
        </h3>
        <p className="text-gray-800 mb-4 text-base md:text-lg">
          You&apos;ve got the vision. We&apos;ve got the roadmap. Speak with a
          crowdfunding expert and take the first step toward funding.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition"
        >
          Book a Free Strategy Call
        </Link>
      </div>

      <div className="bg-gray-900 text-white pt-10 pb-5 px-4 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="/index/logo.webp"
                alt="Lift & Launch"
                className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 mt-3">
              Full-service crowdfunding strategy and marketing to help you fund,
              launch, and scale — with LaunchVault tools exclusive to Lift &amp;
              Launch clients.
            </p>
          </div>

          <div className="md:text-center">
            <div className="flex space-x-4 justify-start md:justify-center mb-2">
              <a href="#" className="text-white hover:text-yellow-400 transition" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition" aria-label="Twitter">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition" aria-label="LinkedIn">
                <LinkedinIcon size={20} />
              </a>
            </div>
            <a
              href="mailto:hello@liftnlaunch.com"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              hello@liftnlaunch.com
            </a>
          </div>

          <div className="flex justify-start md:justify-end">
            <nav className="flex flex-col space-y-2 text-sm text-gray-400 md:items-end" aria-label="Footer">
              <Link to="/services" className="hover:text-yellow-400 transition">
                LaunchVault
              </Link>
              <Link to="/process" className="hover:text-yellow-400 transition">
                Process
              </Link>
              <Link to="/campaigns" className="hover:text-yellow-400 transition">
                Campaigns
              </Link>
              <Link to="/blog" className="hover:text-yellow-400 transition">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">
                Contact
              </Link>
              <Link to="/faq" className="hover:text-yellow-400 transition">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 bg-gray-800 py-4">
        © {year ?? ""} Lift &amp; Launch. All rights reserved.
      </div>
    </footer>
  );
}
