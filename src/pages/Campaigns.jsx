import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Globe,
  HeartHandshake,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";
import OptimizedImage from "../components/OptimizedImage";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";
import { useAuth } from "../context/AuthContext";

const LIVE_STATUSES = new Set(["active", "published", "live"]);
const PAST_STATUSES = new Set([
  "ended",
  "completed",
  "expired",
  "inactive",
  "archived",
  "closed",
]);
const HIDDEN_STATUSES = new Set(["draft", "pending", "cancelled", "denied", "rejected"]);
const FALLBACK_COVER = "/images/campaign-success.webp";
const TYPE_FILTERS = [
  { id: "all", label: "All types" },
  { id: "donation", label: "Donations" },
  { id: "reward", label: "Rewards" },
  { id: "investment", label: "Investment" },
];

function extractCampaignList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.campaigns)) return payload.campaigns;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data?.campaigns)) return payload.data.campaigns;
  return [];
}

function firstText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstImage(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() && !value.includes("undefined")) {
      return value.trim();
    }
    if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
      return value[0].trim();
    }
  }
  return FALLBACK_COVER;
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function formatMoney(amount) {
  const n = toNumber(amount);
  if (!n) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n);
}

function formatType(type) {
  const key = String(type || "").toLowerCase();
  if (key === "donation" || key === "donations") return "Donations";
  if (key === "reward" || key === "rewards") return "Rewards";
  if (key === "investment" || key === "equity") return "Investment";
  return type ? String(type) : "Campaign";
}

function normalizeType(type) {
  const key = String(type || "").toLowerCase();
  if (key === "donations") return "donation";
  if (key === "rewards") return "reward";
  if (key === "equity") return "investment";
  return key;
}

function getEndDate(raw, config) {
  const explicit = raw.endDate || raw.endsAt || raw.completedAt || config?.basics?.endDate;
  if (explicit) {
    const d = new Date(explicit);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const start = config?.basics?.startDate || raw.startDate || raw.publishedAt;
  const duration = Number(config?.basics?.duration);
  if (start && duration > 0 && duration < 36500) {
    const d = new Date(start);
    if (!Number.isNaN(d.getTime())) {
      d.setDate(d.getDate() + duration);
      return d;
    }
  }
  return null;
}

function isPastCampaign(raw, config) {
  const status = String(raw.status || "").toLowerCase();
  if (PAST_STATUSES.has(status)) return true;
  const end = getEndDate(raw, config);
  return Boolean(end && end.getTime() < Date.now());
}

function isLiveCampaign(raw, config) {
  const status = String(raw.status || "").toLowerCase();
  if (HIDDEN_STATUSES.has(status)) return false;
  if (isPastCampaign(raw, config)) return false;
  if (!status) return true;
  return LIVE_STATUSES.has(status);
}

function daysRemaining(endDate) {
  if (!endDate) return null;
  const diff = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 0;
  return diff;
}

function mapCampaign(raw, index) {
  const config = raw.campaignConfig || raw.configuration || {};
  const basics = config.basics || {};
  const business = raw.businessInfo || {};
  const endDate = getEndDate(raw, config);
  const goal = toNumber(
    basics.goal ||
      config.fundingTarget ||
      raw.fundingTarget ||
      raw.goal
  );
  const raised = toNumber(
    raw.amountRaised ||
      raw.totalRaised ||
      raw.raised ||
      raw.stats?.amountRaised ||
      raw.payments?.total
  );
  const id = raw._id || raw.id || `campaign-${index}`;

  return {
    id,
    title: firstText(raw.campaignName, basics.name, business.businessName, "Untitled campaign"),
    tagline: firstText(basics.tagline, basics.campaignGoals),
    description: firstText(
      raw.description,
      config.story,
      config.mission,
      config.problem,
      business.description
    ),
    category: firstText(basics.category, raw.category),
    type: normalizeType(raw.campaignType || raw.type),
    typeLabel: formatType(raw.campaignType || raw.type),
    image: firstImage(
      config.coverImage,
      business.galleryUrls,
      business.logoUrl,
      business.logo,
      raw.coverImage,
      raw.imageUrl
    ),
    logo: firstText(business.logoUrl, business.logo),
    businessName: firstText(business.businessName),
    raised,
    goal,
    backers: toNumber(raw.investorCount || raw.backers || raw.supporterCount || raw.stats?.backers),
    status: String(raw.status || "live").toLowerCase(),
    isPast: isPastCampaign(raw, config),
    isLive: isLiveCampaign(raw, config),
    endDate,
    daysLeft: daysRemaining(endDate),
    publishedAt: raw.publishedAt || raw.createdAt || null,
  };
}

function progressPercent(raised, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

function CampaignCard({ camp }) {
  const [imgSrc, setImgSrc] = useState(camp.image || FALLBACK_COVER);
  const percent = progressPercent(camp.raised, camp.goal);
  const blurb = camp.tagline || camp.description;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => {
            if (imgSrc !== FALLBACK_COVER) setImgSrc(FALLBACK_COVER);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {camp.isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>
          )}
          {camp.isPast && (
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              Completed
            </span>
          )}
          <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-black">
            {camp.typeLabel}
          </span>
        </div>
        {camp.category && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {camp.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-black leading-snug text-gray-900 line-clamp-2">
            {camp.title}
          </h3>
          {camp.businessName && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {camp.businessName}
            </p>
          )}
          <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-gray-600 line-clamp-2">
            {blurb || "A live Lift & Launch campaign. Open the page to see the full story."}
          </p>
        </div>

        {camp.goal > 0 ? (
          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <p className="text-sm font-black text-gray-900">
                {camp.raised > 0 ? formatMoney(camp.raised) : "Just launched"}
                {camp.raised > 0 && (
                  <span className="ml-1 text-xs font-semibold text-gray-500">raised</span>
                )}
              </p>
              <p className="text-xs font-bold text-gray-400">{percent}% of {formatMoney(camp.goal)}</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden>
              <div
                className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${Math.max(percent, camp.raised > 0 ? 4 : 0)}%` }}
              />
            </div>
          </div>
        ) : camp.raised > 0 ? (
          <p className="text-sm font-black text-gray-900">
            {formatMoney(camp.raised)} <span className="text-xs font-semibold text-gray-500">raised</span>
          </p>
        ) : (
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Live now · support this launch
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-semibold text-gray-500">
          <span>
            {typeof camp.daysLeft === "number"
              ? camp.daysLeft === 0
                ? "Last day"
                : `${camp.daysLeft} day${camp.daysLeft === 1 ? "" : "s"} left`
              : camp.isPast
                ? "Campaign closed"
                : "Open now"}
          </span>
          {camp.backers > 0 && (
            <span>
              {camp.backers} supporter{camp.backers === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/campaigns/${camp.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-500"
          >
            View details
          </Link>
          <Link
            to={`/live/${camp.id}`}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-2.5 text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-50"
            aria-label={`Open live landing page for ${camp.title}`}
          >
            <Globe size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm">
      <div className="h-52 animate-pulse bg-gray-100" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
        <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

const Campaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("live");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [retryToken, setRetryToken] = useState(0);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let list = [];
      try {
        const response = await api.get("/campaigns/public");
        list = extractCampaignList(response.data);
      } catch (publicErr) {
        // Deployed public route currently 500s on a bad populate.
        // Dashboard GET /campaigns works — use it as a signed-in fallback.
        if (!user?.token) throw publicErr;
        const fallback = await api.get("/campaigns");
        list = extractCampaignList(fallback.data);
      }
      const mapped = list
        .map(mapCampaign)
        .filter((camp) => camp.isLive || camp.isPast);
      setCampaigns(mapped);
    } catch (err) {
      console.error("Error fetching campaigns", err);
      setCampaigns([]);
      setError(
        err.response?.data?.message ||
          "We couldn’t load live campaigns right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns, retryToken]);

  const liveCampaigns = useMemo(
    () => campaigns.filter((c) => c.isLive),
    [campaigns]
  );
  const pastCampaigns = useMemo(
    () => campaigns.filter((c) => c.isPast),
    [campaigns]
  );

  useEffect(() => {
    if (activeTab === "past" && pastCampaigns.length === 0) {
      setActiveTab("live");
    }
  }, [activeTab, pastCampaigns.length]);

  const categories = useMemo(() => {
    const unique = [...new Set(campaigns.map((c) => c.category).filter(Boolean))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [campaigns]);

  const sourceList = activeTab === "past" ? pastCampaigns : liveCampaigns;

  const filteredCampaigns = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return sourceList.filter((camp) => {
      const matchesType = typeFilter === "all" || camp.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || camp.category === categoryFilter;
      const haystack = `${camp.title} ${camp.tagline} ${camp.description} ${camp.businessName} ${camp.category}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [sourceList, typeFilter, categoryFilter, searchTerm]);

  const startHref = user ? "/dashboard" : "/signup";
  const startLabel = user ? "Launch a campaign" : "Start your campaign";

  const scrollToGrid = () => {
    document.getElementById("campaign-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white text-black">
      <Seo {...pageSeo.campaigns} />

      <section className="relative overflow-hidden border-b border-amber-100 bg-gradient-to-b from-amber-50/70 via-white to-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
              <Sparkles size={12} />
              Live on Lift & Launch
            </p>
            <h1 className="text-4xl font-black leading-tight text-gray-900 md:text-5xl">
              Explore campaigns{" "}
              <span className="underline decoration-yellow-400 decoration-4 underline-offset-4">
                raising now
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              Real launches from founders using LaunchVault — not placeholder stories.
              Back a live campaign, or start yours and join this list.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToGrid}
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:bg-yellow-500"
              >
                Browse live campaigns
                <ArrowRight size={16} />
              </button>
              <Link
                to={startHref}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-black text-gray-800 transition hover:border-yellow-400 hover:bg-yellow-50"
              >
                {startLabel}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-gray-500">
              <span className="inline-flex items-center gap-2">
                <Rocket size={16} className="text-yellow-500" />
                {loading ? "Loading…" : error ? "Temporarily unavailable" : `${liveCampaigns.length} live`}
              </span>
              {pastCampaigns.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <HeartHandshake size={16} className="text-yellow-500" />
                  {pastCampaigns.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5">
            <OptimizedImage
              src="/images/campaign-success.webp"
              alt="Founders celebrating a successful campaign launch"
              className="h-full w-full object-cover"
              width={900}
              height={700}
              sizes="(max-width: 768px) 100vw, 560px"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section id="campaign-grid" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                {activeTab === "past" ? "Completed campaigns" : "Live campaigns"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {activeTab === "past"
                  ? "Campaigns that have already closed."
                  : "Only published, active campaigns appear here."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={activeTab === "live"}
                onClick={() => setActiveTab("live")}
                className={`rounded-full px-4 py-2 text-sm font-bold border transition ${
                  activeTab === "live"
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                }`}
              >
                Live ({liveCampaigns.length})
              </button>
              {pastCampaigns.length > 0 && (
                <button
                  type="button"
                  aria-pressed={activeTab === "past"}
                  onClick={() => setActiveTab("past")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition ${
                    activeTab === "past"
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                  }`}
                >
                  Completed ({pastCampaigns.length})
                </button>
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search campaigns</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, story, or business"
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-200"
              />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by campaign type">
              {TYPE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={typeFilter === filter.id}
                  onClick={() => setTypeFilter(filter.id)}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-wide border transition ${
                    typeFilter === filter.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-yellow-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {categories.length > 0 && (
              <label className="md:w-48">
                <span className="sr-only">Filter by category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-amber-200 bg-white px-6 py-16 text-center shadow-sm">
              <AlertCircle className="mx-auto mb-4 text-amber-500" size={36} />
              <h3 className="text-xl font-black text-gray-900">Campaigns are unavailable</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{error}</p>
              <button
                type="button"
                onClick={() => setRetryToken((n) => n + 1)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-black text-black hover:bg-yellow-500"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="rounded-[2rem] border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              {sourceList.length === 0 ? (
                <>
                  <Rocket className="mx-auto mb-4 text-yellow-500" size={36} />
                  <h3 className="text-xl font-black text-gray-900">
                    {activeTab === "past" ? "No completed campaigns yet" : "No live campaigns yet"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                    {activeTab === "past"
                      ? "When live campaigns finish, they will show up here."
                      : "Be the first founder on this page. Publish a campaign and it will appear for supporters."}
                  </p>
                  {activeTab !== "past" && (
                    <Link
                      to={startHref}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-black text-black hover:bg-yellow-500"
                    >
                      {startLabel}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Search className="mx-auto mb-4 text-gray-400" size={36} />
                  <h3 className="text-xl font-black text-gray-900">No matches</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                    Nothing matches that search or filter. Clear them to see every live campaign.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setTypeFilter("all");
                      setCategoryFilter("all");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm font-semibold text-gray-500">
                Showing {filteredCampaigns.length} campaign{filteredCampaigns.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCampaigns.map((camp) => (
                  <CampaignCard key={camp.id} camp={camp} />
                ))}
              </div>
            </>
          )}

          {!loading && !error && liveCampaigns.length > 0 && (
            <p className="mt-12 text-center text-sm text-gray-500">
              New published campaigns appear here automatically after they go live.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
