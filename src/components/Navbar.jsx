import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { isSuperAdmin } from "../utils/roles";
import { canAccessPremiumFeatures } from "../utils/subscription";

const PRODUCT_LINKS = [
  {
    id: "launchvault",
    to: "/services",
    name: "LaunchVault",
    blurb: "Campaigns, funnels & launch tools",
  },
  {
    id: "venturecoach",
    name: "VentureCoach",
    blurb: "Guided coaching for founders",
    isNew: true,
  },
  {
    id: "ventureproof",
    name: "VentureProof",
    blurb: "Venture validator",
    comingSoon: true,
  },
];

function NewBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-400 px-1.5 py-px text-[8px] font-black uppercase tracking-wider text-black">
      <Sparkles size={8} aria-hidden />
      New
    </span>
  );
}

export default function Navbar() {
  const { user, logout, needsAdminOtp } = useAuth();
  const showAuthUser = user && !needsAdminOtp;
  const navigate = useNavigate();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  let dropdownTimeout;

  const handleMouseEnter = (key) => {
    clearTimeout(dropdownTimeout);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => setActiveDropdown(null), 300);
  };

  const closeMenus = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
  };

  const getUserInitial = (name) => {
    if (!name) return "";
    return name?.charAt(0).toUpperCase() ?? "";
  };

  const handleSignOut = () => {
    logout();
    closeMenus();
    navigate("/");
  };

  const dashboardHref =
    isSuperAdmin(user?.role) && !user?.adminOtpVerified
      ? "/admin/verify-otp"
      : isSuperAdmin(user?.role)
        ? "/admin/dashboard"
        : "/dashboard";

  const ventureCoachHref = canAccessPremiumFeatures(user)
    ? "/dashboard/coach"
    : "/pricing";

  const onProductClick = (item, e) => {
    if (item.comingSoon) {
      e.preventDefault();
      toast("VentureProof is coming soon.");
      closeMenus();
      return;
    }
    closeMenus();
  };

  const productHref = (item) => {
    if (item.comingSoon) return "#";
    if (item.id === "venturecoach") return ventureCoachHref;
    return item.to;
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center" onClick={closeMenus}>
          <img
            src="/index/logo.webp"
            alt="Lift & Launch"
            className="w-40 sm:w-48 md:w-56 lg:w-60 h-auto"
          />
        </Link>

        <nav className="hidden md:flex space-x-6 items-center relative">
          <Link to="/" className="hover:text-yellow-500">
            Home
          </Link>
          <Link to="/campaigns" className="hover:text-yellow-500">
            Campaigns
          </Link>

          <div
            className="relative flex items-center space-x-1"
            onMouseEnter={() => handleMouseEnter("products")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center hover:text-yellow-500" type="button">
              Products <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <div
              className={`absolute top-full left-0 mt-2 py-2 w-72 z-50 bg-white shadow-md rounded-xl border border-gray-100 transition-opacity duration-300 ${
                activeDropdown === "products"
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {PRODUCT_LINKS.map((item) => (
                <Link
                  key={item.id}
                  to={productHref(item)}
                  onClick={(e) => onProductClick(item, e)}
                  className={`block px-4 py-3 hover:bg-yellow-50 ${
                    item.comingSoon ? "opacity-80" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold text-gray-900">
                    {item.name}
                    {item.isNew ? <NewBadge /> : null}
                    {item.comingSoon ? (
                      <span className="rounded-full bg-gray-100 px-2 py-px text-[9px] font-black uppercase tracking-wider text-gray-500">
                        Coming soon
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">{item.blurb}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link to="/agency" className="hover:text-yellow-500">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-yellow-500">
            Contact Us
          </Link>

          <div className="ml-4 relative">
            {!showAuthUser ? (
              <div className="space-x-3">
                <Link to="/signup">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 px-5 py-1 rounded-full text-sm border border-yellow-400 text-black"
                    type="button"
                  >
                    Join
                  </button>
                </Link>
                <Link to="/signin">
                  <button
                    className="hover:bg-yellow-500 px-5 py-1 rounded-full text-sm border hover:border-yellow-400 text-black"
                    type="button"
                  >
                    Sign in
                  </button>
                </Link>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("profile")}
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
                  className={`absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 transition-opacity duration-300 ${
                    activeDropdown === "profile"
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  role="menu"
                >
                  <Link
                    to={dashboardHref}
                    onClick={closeMenus}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={closeMenus}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
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

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white shadow" role="menu">
          <Link to="/" className="block" role="menuitem" onClick={closeMenus}>
            Home
          </Link>
          <Link to="/campaigns" className="block" role="menuitem" onClick={closeMenus}>
            Campaigns
          </Link>
          <button
            type="button"
            className="flex w-full items-center justify-between font-medium"
            onClick={() => setMobileProductsOpen((open) => !open)}
          >
            Products
            <ChevronDown
              className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileProductsOpen && (
            <div className="pl-3 space-y-2">
              {PRODUCT_LINKS.map((item) => (
                <Link
                  key={item.id}
                  to={productHref(item)}
                  className="block"
                  role="menuitem"
                  onClick={(e) => onProductClick(item, e)}
                >
                  <span className="inline-flex items-center gap-2">
                    {item.name}
                    {item.isNew ? <NewBadge /> : null}
                    {item.comingSoon ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Coming soon
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/agency" className="block" role="menuitem" onClick={closeMenus}>
            About Us
          </Link>
          <Link to="/contact" className="block" role="menuitem" onClick={closeMenus}>
            Contact Us
          </Link>

          {!showAuthUser ? (
            <div className="pt-2 space-y-2">
              <Link to="/signup" onClick={closeMenus}>
                <button
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-full text-sm"
                  type="button"
                >
                  Join
                </button>
              </Link>
              <Link to="/signin" onClick={closeMenus}>
                <button className="block w-full border px-5 py-2 text-sm rounded-full" type="button">
                  Sign in
                </button>
              </Link>
            </div>
          ) : (
            <div className="pt-4 space-y-2 border-t mt-3">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-semibold">
                    {getUserInitial(user.name)}
                  </div>
                )}
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <Link
                to={dashboardHref}
                className="block text-sm text-gray-700 hover:underline"
                role="menuitem"
                onClick={closeMenus}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/profile"
                className="block text-sm text-gray-700 hover:underline"
                role="menuitem"
                onClick={closeMenus}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
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
    </header>
  );
}
