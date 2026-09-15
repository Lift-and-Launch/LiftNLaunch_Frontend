import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { canAccessPremiumFeatures, hasActiveSubscription } from "../utils/subscription";

function BusinessCoachNavLabel({ compact = false, showPro = false }) {
  return (
    <span className="group/coach relative inline-flex flex-col items-center">
      {/* “New” sits above the label so it reads as one control */}
      <span
        className={`absolute left-1/2 z-10 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 text-black font-black uppercase tracking-wider whitespace-nowrap animate-[coachBadgePulse_1.6s_ease-in-out_infinite] ${
          compact
            ? '-top-2.5 px-1.5 py-px text-[8px]'
            : '-top-3 px-1.5 py-px text-[9px]'
        }`}
      >
        <Sparkles
          size={compact ? 8 : 9}
          className="shrink-0 animate-[coachSpark_1.2s_ease-in-out_infinite]"
          aria-hidden
        />
        New
      </span>

      <span
        className={`relative font-bold tracking-tight transition-all duration-300 ease-out animate-[coachTextGlow_2.4s_ease-in-out_infinite] group-hover/coach:scale-105 group-hover/coach:tracking-wide ${
          compact ? 'text-sm pt-1.5' : 'text-[15px] pt-1'
        } text-amber-600 group-hover/coach:text-yellow-500`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg bg-yellow-300/0 blur-md transition-all duration-300 group-hover/coach:bg-yellow-300/45 group-hover/coach:blur-lg"
        />
        <span className="relative">Business Coach</span>
        {showPro ? (
          <span className="relative ml-1 text-[9px] font-black uppercase tracking-widest text-yellow-700/80 group-hover/coach:text-yellow-600">
            Pro
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  let dropdownTimeout;

  const handleMouseEnter = (key) => {
    clearTimeout(dropdownTimeout);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => setActiveDropdown(null), 300);
  };

  const getUserInitial = (name) => {
    if (!name) return '';
    return name?.charAt(0).toUpperCase() ?? '';
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/index/logo.webp"
            alt="Lift and Lunch Logo"
            className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center relative">
          <Link to="/" className="hover:text-yellow-500">Home</Link>
          <Link to="/process" className="hover:text-yellow-500">Our Process</Link>

          {/* Explore Dropdown */}
          <div
            className="relative flex items-center space-x-1"
            onMouseEnter={() => handleMouseEnter('results')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center hover:text-yellow-500" type="button">
              Results <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <div
              className={`absolute top-full left-0 mt-2 py-2 w-40 z-50 bg-white shadow-md rounded transition-opacity duration-300 ${activeDropdown === 'results'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
                }`}
            >
              <Link to="#" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">Review</Link>
              <Link to="/campaigns" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">Campaigns</Link>
              <Link to="/blog" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">Blogs</Link>
            </div>
          </div>

          {/* Fundraise Dropdown */}
          <div
            className="relative flex items-center space-x-1"
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center hover:text-yellow-500" type="button">
              About Us <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <div
              className={`absolute top-full left-0 mt-2 py-2 w-40 z-50 bg-white shadow-md rounded transition-opacity duration-300 ${activeDropdown === 'about'
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
                }`}
            >
              <Link to="#" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">Team</Link>
              <Link to="#" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">Tech</Link>
              <Link to="/faq" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 hover:bg-gray-100">FAQs</Link>
            </div>
          </div>

          <Link to="/services" className="hover:text-yellow-500">Our Service</Link>
          {user && (
            <Link
              to={canAccessPremiumFeatures(user) ? "/dashboard/coach" : "/pricing"}
              className="relative inline-flex items-center px-1 py-1 -my-1 rounded-lg transition-transform duration-300 hover:-translate-y-0.5"
            >
              <BusinessCoachNavLabel
                showPro={!hasActiveSubscription(user) && !canAccessPremiumFeatures(user)}
              />
            </Link>
          )}
          <Link to="/contact" className="hover:text-yellow-500">Contact Us</Link>

          {/* Auth / Avatar */}
          <div className="ml-4 relative">
            {!user ? (
              <div className="space-x-3">
                <Link to="/signup">
                  <button className="bg-yellow-400 hover:bg-yellow-500 px-5 py-1 rounded-full text-sm border border-yellow-400 text-black" type="button">
                    Join
                  </button>
                </Link>
                <Link to="/signin">
                  <button className="hover:bg-yellow-500 px-5 py-1 rounded-full text-sm border hover:border-yellow-400 text-black" type="button">
                    Sign in
                  </button>
                </Link>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold focus:outline-none"
                  type="button"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    getUserInitial(user.name)
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 transition-opacity duration-300 ${activeDropdown === 'profile'
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
                  role="menu"
                >
                  <Link
                    to={user?.role === 'superadmin' ? '/admin/dashboard' : '/dashboard'}
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setActiveDropdown(null)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      handleSignOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    type="button"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white shadow" role="menu">
          <Link to="#" className="block" role="menuitem">About</Link>

          <div>
            <p className="font-semibold text-gray-700">Explore</p>
            <div className="ml-3 space-y-1">
              <Link to="/campaigns" className="block" role="menuitem">All Campaigns</Link>
              <Link to="#" className="block" role="menuitem">Categories</Link>
              <Link to="#" className="block" role="menuitem">Success Stories</Link>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Fundraise</p>
            <div className="ml-3 space-y-1">
              <Link to="#" className="block" role="menuitem">Start Campaign</Link>
              <Link to="/process" className="block" role="menuitem">How It Works</Link>
            </div>
          </div>

          <Link to="/faq" className="block" role="menuitem">Help Center</Link>
          {user && (
            <Link
              to={canAccessPremiumFeatures(user) ? "/dashboard/coach" : "/pricing"}
              className="block pt-2"
              role="menuitem"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BusinessCoachNavLabel compact />
            </Link>
          )}

          {!user ? (
            <div className="pt-2 space-y-2">
              <Link to="/signup">
                <button className="block w-full bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-full text-sm" type="button">
                  Join
                </button>
              </Link>
              <Link to="/signin">
                <button className="block w-full border px-5 py-2 text-sm rounded-full" type="button">
                  Sign in
                </button>
              </Link>
            </div>
          ) : (
            <div className="pt-4 space-y-2 border-t mt-3">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-semibold">
                    {getUserInitial(user.name)}
                  </div>
                )}

                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <Link to="/dashboard" className="block text-sm text-gray-700 hover:underline" role="menuitem">
                Dashboard
              </Link>
              <Link to="/dashboard/profile" className="block text-sm text-gray-700 hover:underline" role="menuitem">
                Profile
              </Link>
              <button
                onClick={() => handleSignOut()}
                className="text-left text-sm text-red-600 hover:underline"
                type="button"
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes coachBadgePulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 0 8px rgba(250,204,21,0.7), 0 0 16px rgba(251,191,36,0.35);
          }
          50% {
            transform: translateX(-50%) scale(1.08);
            box-shadow: 0 0 14px rgba(250,204,21,1), 0 0 28px rgba(251,191,36,0.65);
          }
        }
        @keyframes coachTextGlow {
          0%, 100% {
            text-shadow: 0 0 6px rgba(250,204,21,0.4), 0 0 14px rgba(251,191,36,0.25);
            filter: brightness(1);
          }
          50% {
            text-shadow: 0 0 12px rgba(250,204,21,0.85), 0 0 26px rgba(251,191,36,0.5);
            filter: brightness(1.08);
          }
        }
        @keyframes coachSpark {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 1; }
          50% { transform: rotate(18deg) scale(1.15); opacity: 0.85; }
        }
      `}</style>
    </header>
  );
}
