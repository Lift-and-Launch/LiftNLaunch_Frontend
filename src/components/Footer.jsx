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
    <footer className="">
      {/* Sub-Footer CTA */}
      <div className="bg-yellow-400 text-center py-10 px-4">
        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 max-w-4xl mx-auto">
          We have over a million members helping to drive growth & innovation
          for businesses across the continent
        </h3>
        <p className="text-gray-800 mb-4 text-base md:text-lg">
          Speak With One Of Our Crowdfunding Experts
        </p>
        <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition">
          TALK TO AN EXPERT TO LEARN MORE
        </button>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-white pt-10 pb-5 px-4 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand / Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="/index/logo.webp"
                alt="Lift and Lunch Logo"
                className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto"
              />
            </Link>
            <p className="text-sm text-gray-400">
              Empowering local communities through crowdfunding and opportunity.
            </p>
          </div>

          {/* Social Links & Email */}
          <div className="md:text-center">
            <div className="flex space-x-4 justify-start md:justify-center mb-2">
              <a href="#" className="text-white hover:text-yellow-400 transition">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-400 transition">
                <LinkedinIcon size={20} />
              </a>
            </div>
            <a
              href="mailto:demo@gmail.com"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              demo@gmail.com
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-start md:justify-end">
            <div className="flex flex-col space-y-2 text-sm text-gray-400 md:items-end">
              <Link to="/about" className="hover:text-yellow-400 transition">
                About
              </Link>
              <Link to="/process" className="hover:text-yellow-400 transition">
                How It Works
              </Link>
              <Link to="/campaigns" className="hover:text-yellow-400 transition">
                Campaigns
              </Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">
                Contact
              </Link>
              <Link to="/faq" className="hover:text-yellow-400 transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm text-gray-500 bg-gray-800 py-4">
        © {year ?? ""} Neighborhood Funds. All rights reserved.
      </div>
    </footer>
  );
}
