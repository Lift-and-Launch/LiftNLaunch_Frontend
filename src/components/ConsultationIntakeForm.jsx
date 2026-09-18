import React, { useRef, useState } from "react";
import { Check, Loader2, Upload, X } from "lucide-react";
import api from "../api/axios";
import {
  EMAIL_REGEX,
  sanitizeBusinessText,
  sanitizeDescription,
  sanitizePhone,
} from "../utils/formInput";

const BUSINESS_STAGES = [
  "I have an idea and am exploring it",
  "I am developing my business",
  "I have an existing business",
  "I am preparing to launch",
  "I am preparing to raise funding",
  "I have already launched a crowdfunding campaign",
  "I am looking to scale an existing business",
  "Other",
];

const HELP_TOPICS = [
  "Business Model Development",
  "Business Strategy",
  "Crowdfunding Strategy",
  "Campaign Preparation",
  "Campaign Messaging & Storytelling",
  "MVP Strategy & Validation",
  "Customer / Market Validation",
  "Marketing Strategy",
  "Funnel Strategy",
  "Advertising Strategy",
  "Pre-Launch Strategy",
  "Launch Planning",
  "Content Strategy",
  "Brand / Creative Strategy",
  "General Business Coaching",
  "Funding Readiness",
  "Other",
];

const PRIMARY_GOALS = [
  "Validate my business idea",
  "Strengthen my business model",
  "Validate my product/service",
  "Prepare for crowdfunding",
  "Build my campaign",
  "Prepare for launch",
  "Generate customers / leads",
  "Improve marketing",
  "Raise capital",
  "Scale my business",
  "Determine my next steps",
  "Other",
];

const PREVIOUS_CAMPAIGN = [
  "Yes",
  "No",
  "Currently preparing my first campaign",
];

const CROWDFUNDING_TYPES = [
  "Reward-based",
  "Investment / Equity",
  "Donation-based",
  "Revenue-share",
  "Not sure yet",
];

const COMPLETED_ITEMS = [
  "Business concept",
  "Business model",
  "Market research",
  "Customer validation",
  "MVP / prototype",
  "Branding",
  "Website / landing page",
  "Marketing strategy",
  "Audience building",
  "Crowdfunding campaign page",
  "Campaign content",
  "Advertising setup",
  "None of the above",
  "Other",
];

const AVAILABLE_RESOURCES = [
  "Website",
  "Product / prototype",
  "Existing customers",
  "Email list",
  "Social media audience",
  "Brand assets",
  "Marketing materials",
  "Campaign materials",
  "Existing advertising accounts",
  "Other",
];

const SUPPORT_TYPES = [
  "Expert advice on a specific problem",
  "Help creating a strategy or roadmap",
  "Ongoing coaching",
  "Someone to work alongside me",
  "Hands-on execution support",
  "Full-service support",
  "Not sure yet",
];

const INVOLVEMENT_LEVELS = [
  {
    id: "Guidance",
    label: "Guidance",
    hint: "I want to do the work, but need an expert to guide me.",
  },
  {
    id: "Collaborative Support",
    label: "Collaborative Support",
    hint: "I want to work alongside an expert/team.",
  },
  {
    id: "Hands-On Support",
    label: "Hands-On Support",
    hint: "I want the Lift & Launch team to take responsibility for specific areas of execution.",
  },
  {
    id: "Not Sure",
    label: "Not Sure",
    hint: "I'd like to discuss the right level of support during the consultation.",
  },
];

const HEAR_ABOUT = [
  "Google / Search",
  "Social Media",
  "Referral",
  "Crowdfunding Community",
  "Event / Networking",
  "Lift & Launch Platform",
  "Other",
];

const emptyForm = () => ({
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  websiteUrl: "",
  location: "",
  businessStage: "",
  businessStageOther: "",
  industry: "",
  businessDescription: "",
  targetAudience: "",
  helpTopics: [],
  helpOther: "",
  mainChallenge: "",
  consultationOutcome: "",
  primaryGoals: [],
  primaryGoalOther: "",
  previousCampaign: "",
  crowdfundingType: "",
  targetFundingAmount: "",
  targetLaunchDate: "",
  crowdfundingPlatform: "",
  completedItems: [],
  completedOther: "",
  availableResources: [],
  resourcesOther: "",
  supportTypes: [],
  involvementLevel: "",
  linkWebsite: "",
  linkCampaign: "",
  pitchDeck: null,
  mvpInfo: null,
  otherDocs: null,
  reviewNotes: "",
  discussSpecifics: "",
  hearAbout: "",
  hearAboutOther: "",
  deadlineMilestone: "",
  confirmGuidance: false,
  confirmSeparateServices: false,
  confirmTerms: false,
  signatureName: "",
  signatureDate: new Date().toISOString().split("T")[0],
});

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function SectionTitle({ children }) {
  return (
    <div className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#001d59]">{children}</h2>
      <div className="mt-2 h-[3px] w-full max-w-full bg-[#F5C518] rounded-full" />
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-sm font-bold text-gray-900 mb-2">
      {children}
      {required ? <span className="text-[#001d59]">*</span> : null}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-md border border-gray-300 bg-white text-gray-900 text-sm sm:text-base font-medium outline-none focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/25 ${className}`}
    />
  );
}

function TextArea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-md border border-gray-300 bg-white text-gray-900 text-sm sm:text-base font-medium outline-none focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]/25 resize-y min-h-[96px] sm:min-h-[110px] ${className}`}
    />
  );
}

function CheckboxGrid({ options, values, onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-400 accent-[#F5C518]"
            checked={values.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          <span className="text-sm text-gray-800 leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGrid({ name, options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            className="mt-1 h-4 w-4 border-gray-400 accent-[#F5C518]"
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <span className="text-sm text-gray-800 leading-snug">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function FileUploadField({ label, fileMeta, onPick, onClear, inputRef }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
        onChange={onPick}
      />
      {fileMeta ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-gray-300 bg-white">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{fileMeta.name}</p>
            <p className="text-xs text-gray-500">{Math.round(fileMeta.size / 1024)} KB</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer p-2 rounded-md text-red-600 hover:bg-red-50"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer w-full border border-dashed border-gray-300 rounded-md px-4 py-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:border-[#F5C518] hover:text-[#001d59] bg-white"
        >
          <Upload size={16} /> Upload file
        </button>
      )}
    </div>
  );
}

async function readFileAsMeta(file) {
  if (!file) return null;
  if (file.size > 8 * 1024 * 1024) throw new Error("Each file must be under 8MB");
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
  return { name: file.name, size: file.size, type: file.type, dataUrl };
}

const HELP_TOPIC_TO_INTEREST = {
  "Business Model Development": "BIZ_MODEL_FINANCE",
  "Business Strategy": "BIZ_MODEL_FINANCE",
  "Crowdfunding Strategy": "CROWDFUNDING_SUPPORT",
  "Campaign Preparation": "CROWDFUNDING_SUPPORT",
  "Campaign Messaging & Storytelling": "STORY_BRAND_PITCH",
  "MVP Strategy & Validation": "CROWDFUNDING_SUPPORT",
  "Customer / Market Validation": "CROWDFUNDING_SUPPORT",
  "Marketing Strategy": "MARKETING_PRELAUNCH",
  "Funnel Strategy": "MARKETING_PRELAUNCH",
  "Advertising Strategy": "MARKETING_PRELAUNCH",
  "Pre-Launch Strategy": "MARKETING_PRELAUNCH",
  "Launch Planning": "CROWDFUNDING_SUPPORT",
  "Content Strategy": "STORY_BRAND_PITCH",
  "Brand / Creative Strategy": "STORY_BRAND_PITCH",
  "General Business Coaching": "BIZ_MODEL_FINANCE",
  "Funding Readiness": "BIZ_MODEL_FINANCE",
  Other: "OTHER",
};

function mapInterests(helpTopics) {
  const mapped = new Set();
  for (const topic of helpTopics || []) {
    mapped.add(HELP_TOPIC_TO_INTEREST[topic] || "OTHER");
  }
  return [...mapped];
}

function mapReadiness(form) {
  const stage = form.businessStage || "";
  if (/exploring|idea/i.test(stage)) return "EXPLORING";
  if (/preparing to launch|preparing to raise|first campaign/i.test(stage)) {
    return "WITHIN_3_MONTHS";
  }
  if (/scale|existing business|already launched/i.test(stage)) {
    return "THREE_TO_SIX_MONTHS";
  }
  if (/developing/i.test(stage)) return "THREE_TO_SIX_MONTHS";
  return "EXPLORING";
}

function mapNextStep(form) {
  if (
    form.involvementLevel === "Full-Service Support" ||
    form.involvementLevel === "Collaborative Support" ||
    form.supportTypes?.some((t) => /execution|alongside|Full-service/i.test(t))
  ) {
    return "BOOK_CALL";
  }
  return "BOOK_CALL";
}

function serializeFileMeta(file) {
  if (!file) return null;
  return {
    name: file.name || "",
    size: file.size ?? 0,
    type: file.type || "",
    dataUrl: file.dataUrl || "",
  };
}

/** Full intake payload — every form field + API aliases for email/admin. */
function buildConsultLeadPayload(form, { source, page }) {
  const interests = mapInterests(form.helpTopics);
  if (form.crowdfundingType === "Investment / Equity" && !interests.includes("EQUITY_CROWDFUNDING")) {
    interests.push("EQUITY_CROWDFUNDING");
  }

  const goalSummary = [
    form.primaryGoals?.length ? `Primary goals: ${form.primaryGoals.join(", ")}` : null,
    form.primaryGoalOther ? `Other goal: ${form.primaryGoalOther}` : null,
    form.mainChallenge ? `Main challenge: ${form.mainChallenge}` : null,
    form.consultationOutcome ? `Desired outcome: ${form.consultationOutcome}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    // —— Contact / identity (API core) ——
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim() || "",
    businessName: form.businessName?.trim() || "",
    city: form.location?.trim() || "",
    state: "",
    interests,
    otherInterest: form.helpOther?.trim() || "",
    goal: goalSummary || form.mainChallenge?.trim() || "",
    message: form.mainChallenge?.trim() || "",
    readiness: mapReadiness(form),
    nextStep: mapNextStep(form),
    source,
    page,

    // —— Every intake field ——
    websiteUrl: form.websiteUrl?.trim() || "",
    location: form.location?.trim() || "",
    businessStage: form.businessStage || "",
    businessStageOther: form.businessStageOther?.trim() || "",
    industry: form.industry?.trim() || "",
    businessDescription: form.businessDescription?.trim() || "",
    targetAudience: form.targetAudience?.trim() || "",
    helpTopics: [...(form.helpTopics || [])],
    helpOther: form.helpOther?.trim() || "",
    mainChallenge: form.mainChallenge?.trim() || "",
    consultationOutcome: form.consultationOutcome?.trim() || "",
    primaryGoals: [...(form.primaryGoals || [])],
    primaryGoalOther: form.primaryGoalOther?.trim() || "",
    previousCampaign: form.previousCampaign || "",
    crowdfundingType: form.crowdfundingType || "",
    targetFundingAmount: form.targetFundingAmount?.trim() || "",
    targetLaunchDate: form.targetLaunchDate || "",
    crowdfundingPlatform: form.crowdfundingPlatform?.trim() || "",
    completedItems: [...(form.completedItems || [])],
    completedOther: form.completedOther?.trim() || "",
    availableResources: [...(form.availableResources || [])],
    resourcesOther: form.resourcesOther?.trim() || "",
    supportTypes: [...(form.supportTypes || [])],
    involvementLevel: form.involvementLevel || "",
    linkWebsite: form.linkWebsite?.trim() || "",
    linkCampaign: form.linkCampaign?.trim() || "",
    pitchDeck: serializeFileMeta(form.pitchDeck),
    mvpInfo: serializeFileMeta(form.mvpInfo),
    otherDocs: serializeFileMeta(form.otherDocs),
    reviewNotes: form.reviewNotes?.trim() || "",
    discussSpecifics: form.discussSpecifics?.trim() || "",
    hearAbout: form.hearAbout || "",
    hearAboutOther: form.hearAboutOther?.trim() || "",
    deadlineMilestone: form.deadlineMilestone?.trim() || "",
    confirmGuidance: !!form.confirmGuidance,
    confirmSeparateServices: !!form.confirmSeparateServices,
    confirmTerms: !!form.confirmTerms,
    signatureName: form.signatureName?.trim() || "",
    signatureDate: form.signatureDate || "",
    submittedAt: new Date().toISOString(),
  };
}

export default function ConsultationIntakeForm({
  compact = false,
  onSuccess,
  source = "agency_consult",
  page = "/agency?consult=1",
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const pitchRef = useRef(null);
  const mvpRef = useRef(null);
  const otherRef = useRef(null);
  const formTopRef = useRef(null);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleFile = async (key, e, ref) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setField(key, await readFileAsMeta(file));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.message || "Upload failed" }));
      if (ref?.current) ref.current.value = "";
    }
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = "Full name is required";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Valid email is required";
    if (form.businessName.trim().length < 2) next.businessName = "Business name is required";
    if (!form.location.trim()) next.location = "Country / location is required";
    if (!form.businessStage) next.businessStage = "Please select your current stage";
    if (form.businessStage === "Other" && !form.businessStageOther.trim()) {
      next.businessStageOther = "Please specify";
    }
    if (!form.industry.trim()) next.industry = "Industry / category is required";
    if (form.businessDescription.trim().length < 10) {
      next.businessDescription = "Please briefly describe your business";
    }
    if (!form.helpTopics.length) next.helpTopics = "Select at least one topic";
    if (form.helpTopics.includes("Other") && !form.helpOther.trim()) {
      next.helpOther = "Please specify";
    }
    if (!form.mainChallenge.trim()) next.mainChallenge = "Please share your main challenge";
    if (!form.consultationOutcome.trim()) {
      next.consultationOutcome = "Please describe a successful outcome";
    }
    if (!form.primaryGoals.length) next.primaryGoals = "Select at least one primary goal";
    if (form.primaryGoals.includes("Other") && !form.primaryGoalOther.trim()) {
      next.primaryGoalOther = "Please specify";
    }
    if (!form.previousCampaign) next.previousCampaign = "Please select an option";
    if (!form.completedItems.length) next.completedItems = "Select at least one option";
    if (form.completedItems.includes("Other") && !form.completedOther.trim()) {
      next.completedOther = "Please specify";
    }
    if (!form.supportTypes.length) next.supportTypes = "Select at least one support type";
    if (!form.involvementLevel) next.involvementLevel = "Please select involvement level";
    if (!form.confirmGuidance) next.confirmGuidance = "Required";
    if (!form.confirmSeparateServices) next.confirmSeparateServices = "Required";
    if (!form.confirmTerms) next.confirmTerms = "Required";
    if (form.signatureName.trim().length < 2) next.signatureName = "Signature / name is required";
    if (!form.signatureDate) next.signatureDate = "Date is required";
    setErrors(next);
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      else formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const payload = buildConsultLeadPayload(form, { source, page });
      const res = await api.post("/leads/consult", payload);
      const ok = res.data?.success !== false;
      if (!ok) throw new Error(res.data?.message || "Submit failed");

      setStatus("success");
      setMessage(
        res.data?.message ||
          "Thanks — we received your request and will follow up soon."
      );
      setForm(emptyForm());
      if (!compact) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      onSuccess?.(res.data);
    } catch (err) {
      console.error("Consultation intake submit failed:", err);
      setStatus("error");
      setMessage(
        err?.response?.data?.message ||
          "We couldn't submit your form right now. Please try again or email hello@liftnlaunch.com."
      );
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center ${compact ? "py-10 px-2" : "py-16 px-6"}`}>
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-5">
          <Check size={compact ? 24 : 28} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Thanks — we got it
        </h3>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-6 sm:mb-8">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="cursor-pointer px-7 py-3 rounded-full bg-[#F5C518] hover:bg-yellow-400 font-bold text-[#001d59] text-sm sm:text-base"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formTopRef}
      onSubmit={onSubmit}
      className={compact ? "space-y-8 sm:space-y-10 pb-2" : "space-y-12 md:space-y-14"}
    >
      {/* 1. Your Information */}
      <section>
        <SectionTitle>1. Your Information</SectionTitle>
        <div className="space-y-5">
          <div data-field="fullName">
            <FieldLabel required>Full Name</FieldLabel>
            <TextInput
              value={form.fullName}
              onChange={(e) => setField("fullName", sanitizeBusinessText(e.target.value, 100))}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.fullName}</p>}
          </div>
          <div data-field="email">
            <FieldLabel required>Email Address</FieldLabel>
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value.trim())}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>
          <div>
            <FieldLabel>Phone Number</FieldLabel>
            <TextInput
              value={form.phone}
              onChange={(e) => setField("phone", sanitizePhone(e.target.value))}
            />
          </div>
          <div data-field="businessName">
            <FieldLabel required>Company / Business Name</FieldLabel>
            <TextInput
              value={form.businessName}
              onChange={(e) => setField("businessName", sanitizeBusinessText(e.target.value, 120))}
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.businessName}</p>}
          </div>
          <div>
            <FieldLabel>Website / Business URL</FieldLabel>
            <TextInput
              placeholder="https://"
              value={form.websiteUrl}
              onChange={(e) => setField("websiteUrl", e.target.value.trim())}
            />
          </div>
          <div data-field="location">
            <FieldLabel required>Country / Location</FieldLabel>
            <TextInput
              value={form.location}
              onChange={(e) => setField("location", sanitizeBusinessText(e.target.value, 100))}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.location}</p>}
          </div>
        </div>
      </section>

      {/* 2. Business */}
      <section>
        <SectionTitle>2. Tell Us About Your Business</SectionTitle>
        <div className="space-y-6">
          <div data-field="businessStage">
            <FieldLabel required>What best describes your current stage?</FieldLabel>
            <RadioGrid
              name="businessStage"
              options={BUSINESS_STAGES}
              value={form.businessStage}
              onChange={(v) => setField("businessStage", v)}
            />
            {errors.businessStage && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.businessStage}</p>}
            {form.businessStage === "Other" && (
              <TextInput
                className={`mt-3 ${errors.businessStageOther ? "border-red-500" : ""}`}
                placeholder="Please specify"
                value={form.businessStageOther}
                onChange={(e) => setField("businessStageOther", e.target.value)}
              />
            )}
          </div>
          <div data-field="industry">
            <FieldLabel required>What industry or category does your business operate in?</FieldLabel>
            <TextInput
              value={form.industry}
              onChange={(e) => setField("industry", sanitizeBusinessText(e.target.value, 100))}
              className={errors.industry ? "border-red-500" : ""}
            />
            {errors.industry && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.industry}</p>}
          </div>
          <div data-field="businessDescription">
            <FieldLabel required>Briefly describe your business.</FieldLabel>
            <p className="text-sm text-gray-500 mb-2">
              What do you offer, who do you serve, and what problem are you solving?
            </p>
            <TextArea
              value={form.businessDescription}
              onChange={(e) => setField("businessDescription", sanitizeDescription(e.target.value, 1500))}
              className={errors.businessDescription ? "border-red-500" : ""}
            />
            {errors.businessDescription && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.businessDescription}</p>
            )}
          </div>
          <div>
            <FieldLabel>Who is your target customer or audience?</FieldLabel>
            <TextArea
              value={form.targetAudience}
              onChange={(e) => setField("targetAudience", sanitizeDescription(e.target.value, 800))}
            />
          </div>
        </div>
      </section>

      {/* 3. Help */}
      <section>
        <SectionTitle>3. What Do You Need Help With?</SectionTitle>
        <div className="space-y-6">
          <div data-field="helpTopics">
            <FieldLabel required>What would you like to discuss during your consultation?</FieldLabel>
            <CheckboxGrid
              options={HELP_TOPICS}
              values={form.helpTopics}
              onToggle={(opt) => setField("helpTopics", toggleInList(form.helpTopics, opt))}
            />
            {errors.helpTopics && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.helpTopics}</p>}
            {form.helpTopics.includes("Other") && (
              <TextInput
                className={`mt-3 ${errors.helpOther ? "border-red-500" : ""}`}
                placeholder="Please specify"
                value={form.helpOther}
                onChange={(e) => setField("helpOther", e.target.value)}
              />
            )}
          </div>
          <div data-field="mainChallenge">
            <FieldLabel required>What is the main challenge you are currently facing?</FieldLabel>
            <TextArea
              value={form.mainChallenge}
              onChange={(e) => setField("mainChallenge", sanitizeDescription(e.target.value, 1200))}
              className={errors.mainChallenge ? "border-red-500" : ""}
            />
            {errors.mainChallenge && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.mainChallenge}</p>}
          </div>
        </div>
      </section>

      {/* 4. Goals */}
      <section>
        <SectionTitle>4. Your Goals</SectionTitle>
        <div className="space-y-6">
          <div data-field="consultationOutcome">
            <FieldLabel required>What would you like to accomplish through this consultation?</FieldLabel>
            <p className="text-sm text-gray-500 mb-2">What would a successful outcome look like for you?</p>
            <TextArea
              value={form.consultationOutcome}
              onChange={(e) => setField("consultationOutcome", sanitizeDescription(e.target.value, 1200))}
              className={errors.consultationOutcome ? "border-red-500" : ""}
            />
            {errors.consultationOutcome && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.consultationOutcome}</p>
            )}
          </div>
          <div data-field="primaryGoals">
            <FieldLabel required>What is your primary goal right now?</FieldLabel>
            <CheckboxGrid
              options={PRIMARY_GOALS}
              values={form.primaryGoals}
              onToggle={(opt) => setField("primaryGoals", toggleInList(form.primaryGoals, opt))}
            />
            {errors.primaryGoals && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.primaryGoals}</p>}
            {form.primaryGoals.includes("Other") && (
              <TextInput
                className={`mt-3 ${errors.primaryGoalOther ? "border-red-500" : ""}`}
                placeholder="Please specify"
                value={form.primaryGoalOther}
                onChange={(e) => setField("primaryGoalOther", e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 5. Crowdfunding */}
      <section>
        <SectionTitle>5. Crowdfunding Information</SectionTitle>
        <p className="text-sm text-gray-500 mb-6">
          Complete this section if your consultation involves crowdfunding.
        </p>
        <div className="space-y-6">
          <div data-field="previousCampaign">
            <FieldLabel required>Have you previously run a crowdfunding campaign?</FieldLabel>
            <RadioGrid
              name="previousCampaign"
              options={PREVIOUS_CAMPAIGN}
              value={form.previousCampaign}
              onChange={(v) => setField("previousCampaign", v)}
            />
            {errors.previousCampaign && (
              <p className="text-red-600 text-xs mt-2 font-semibold">{errors.previousCampaign}</p>
            )}
          </div>
          <div>
            <FieldLabel>What type of crowdfunding are you considering?</FieldLabel>
            <RadioGrid
              name="crowdfundingType"
              options={CROWDFUNDING_TYPES}
              value={form.crowdfundingType}
              onChange={(v) => setField("crowdfundingType", v)}
            />
          </div>
          <div>
            <FieldLabel>Do you have a target funding amount?</FieldLabel>
            <TextInput
              placeholder="e.g. $50,000"
              value={form.targetFundingAmount}
              onChange={(e) => setField("targetFundingAmount", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Do you have a target launch date?</FieldLabel>
            <TextInput
              type="date"
              value={form.targetLaunchDate}
              onChange={(e) => setField("targetLaunchDate", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>If you have selected a crowdfunding platform, which one?</FieldLabel>
            <TextInput
              placeholder="Kickstarter, Indiegogo, etc."
              value={form.crowdfundingPlatform}
              onChange={(e) => setField("crowdfundingPlatform", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 6. Progress */}
      <section>
        <SectionTitle>6. Your Current Progress</SectionTitle>
        <div className="space-y-6">
          <div data-field="completedItems">
            <FieldLabel required>What have you already completed?</FieldLabel>
            <CheckboxGrid
              options={COMPLETED_ITEMS}
              values={form.completedItems}
              onToggle={(opt) => setField("completedItems", toggleInList(form.completedItems, opt))}
            />
            {errors.completedItems && (
              <p className="text-red-600 text-xs mt-2 font-semibold">{errors.completedItems}</p>
            )}
            {form.completedItems.includes("Other") && (
              <TextInput
                className={`mt-3 ${errors.completedOther ? "border-red-500" : ""}`}
                placeholder="Please specify"
                value={form.completedOther}
                onChange={(e) => setField("completedOther", e.target.value)}
              />
            )}
          </div>
          <div>
            <FieldLabel>What resources do you currently have available?</FieldLabel>
            <CheckboxGrid
              options={AVAILABLE_RESOURCES}
              values={form.availableResources}
              onToggle={(opt) =>
                setField("availableResources", toggleInList(form.availableResources, opt))
              }
            />
            {form.availableResources.includes("Other") && (
              <TextInput
                className="mt-3"
                placeholder="Please specify"
                value={form.resourcesOther}
                onChange={(e) => setField("resourcesOther", e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 7. Support */}
      <section>
        <SectionTitle>7. What Kind of Support Are You Looking For?</SectionTitle>
        <div className="space-y-6">
          <div data-field="supportTypes">
            <FieldLabel required>What type of support are you looking for?</FieldLabel>
            <CheckboxGrid
              options={SUPPORT_TYPES}
              values={form.supportTypes}
              onToggle={(opt) => setField("supportTypes", toggleInList(form.supportTypes, opt))}
            />
            {errors.supportTypes && (
              <p className="text-red-600 text-xs mt-2 font-semibold">{errors.supportTypes}</p>
            )}
          </div>
          <div data-field="involvementLevel">
            <FieldLabel required>How much involvement are you looking for from the Lift & Launch team?</FieldLabel>
            <div className="space-y-3">
              {INVOLVEMENT_LEVELS.map((level) => (
                <label key={level.id} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="involvementLevel"
                    className="mt-1 h-4 w-4 accent-[#F5C518]"
                    checked={form.involvementLevel === level.id}
                    onChange={() => setField("involvementLevel", level.id)}
                  />
                  <span>
                    <span className="block text-sm font-bold text-gray-900">{level.label}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{level.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.involvementLevel && (
              <p className="text-red-600 text-xs mt-2 font-semibold">{errors.involvementLevel}</p>
            )}
          </div>
        </div>
      </section>

      {/* 8. Documents */}
      <section>
        <SectionTitle>8. Important Links & Documents</SectionTitle>
        <div className="space-y-5">
          <div>
            <FieldLabel>Website / Landing Page</FieldLabel>
            <TextInput
              value={form.linkWebsite}
              onChange={(e) => setField("linkWebsite", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Crowdfunding Campaign</FieldLabel>
            <TextInput
              value={form.linkCampaign}
              onChange={(e) => setField("linkCampaign", e.target.value)}
            />
          </div>
          <FileUploadField
            label="Pitch Deck / Business Plan"
            fileMeta={form.pitchDeck}
            inputRef={pitchRef}
            onPick={(e) => handleFile("pitchDeck", e, pitchRef)}
            onClear={() => setField("pitchDeck", null)}
          />
          <FileUploadField
            label="Product / MVP Information"
            fileMeta={form.mvpInfo}
            inputRef={mvpRef}
            onPick={(e) => handleFile("mvpInfo", e, mvpRef)}
            onClear={() => setField("mvpInfo", null)}
          />
          <FileUploadField
            label="Other Relevant Documents"
            fileMeta={form.otherDocs}
            inputRef={otherRef}
            onPick={(e) => handleFile("otherDocs", e, otherRef)}
            onClear={() => setField("otherDocs", null)}
          />
          <div>
            <FieldLabel>Anything else you&apos;d like our team to review before the consultation?</FieldLabel>
            <TextArea
              value={form.reviewNotes}
              onChange={(e) => setField("reviewNotes", sanitizeDescription(e.target.value, 1200))}
            />
          </div>
        </div>
      </section>

      {/* 9. Prep */}
      <section>
        <SectionTitle>9. Consultation Preparation</SectionTitle>
        <div className="space-y-6">
          <div>
            <FieldLabel>Is there anything specific you want to make sure we discuss?</FieldLabel>
            <TextArea
              value={form.discussSpecifics}
              onChange={(e) => setField("discussSpecifics", sanitizeDescription(e.target.value, 1000))}
            />
          </div>
          <div>
            <FieldLabel>How did you hear about Lift & Launch?</FieldLabel>
            <RadioGrid
              name="hearAbout"
              options={HEAR_ABOUT}
              value={form.hearAbout}
              onChange={(v) => setField("hearAbout", v)}
            />
            {form.hearAbout === "Other" && (
              <TextInput
                className="mt-3"
                placeholder="Please specify"
                value={form.hearAboutOther}
                onChange={(e) => setField("hearAboutOther", e.target.value)}
              />
            )}
          </div>
          <div>
            <FieldLabel>Is there a specific deadline or upcoming milestone we should know about?</FieldLabel>
            <TextInput
              value={form.deadlineMilestone}
              onChange={(e) => setField("deadlineMilestone", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 10. Confirmation */}
      <section>
        <SectionTitle>10. Final Confirmation</SectionTitle>
        <p className="text-sm font-bold text-gray-900 mb-4">Please confirm:*</p>
        <div className="space-y-4 mb-8">
          <label
            data-field="confirmGuidance"
            className={`flex items-start gap-3 cursor-pointer ${errors.confirmGuidance ? "text-red-700" : ""}`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#F5C518]"
              checked={form.confirmGuidance}
              onChange={(e) => setField("confirmGuidance", e.target.checked)}
            />
            <span className="text-sm text-gray-800">
              I understand that this consultation is intended to provide expert guidance based on the information I provide.
            </span>
          </label>
          <label
            data-field="confirmSeparateServices"
            className={`flex items-start gap-3 cursor-pointer ${errors.confirmSeparateServices ? "text-red-700" : ""}`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#F5C518]"
              checked={form.confirmSeparateServices}
              onChange={(e) => setField("confirmSeparateServices", e.target.checked)}
            />
            <span className="text-sm text-gray-800">
              I understand that any additional agency, execution, or ongoing services are separate from the consultation and will be discussed based on my requirements.
            </span>
          </label>
          <label
            data-field="confirmTerms"
            className={`flex items-start gap-3 cursor-pointer ${errors.confirmTerms ? "text-red-700" : ""}`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#F5C518]"
              checked={form.confirmTerms}
              onChange={(e) => setField("confirmTerms", e.target.checked)}
            />
            <span className="text-sm text-gray-800">
              I agree to the Lift & Launch Terms & Privacy Policy.
            </span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 border border-gray-300 rounded-md overflow-hidden mb-10">
          <div className="p-4 border-b md:border-b-0 md:border-r border-gray-300" data-field="signatureName">
            <p className="text-sm font-bold text-gray-900 mb-3">Signature / Name</p>
            <TextInput
              value={form.signatureName}
              onChange={(e) => setField("signatureName", e.target.value)}
              className={`border-0 border-b rounded-none px-0 ${errors.signatureName ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.signatureName && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.signatureName}</p>
            )}
          </div>
          <div className="p-4" data-field="signatureDate">
            <p className="text-sm font-bold text-gray-900 mb-3">Date</p>
            <TextInput
              type="date"
              value={form.signatureDate}
              onChange={(e) => setField("signatureDate", e.target.value)}
              className={`border-0 border-b rounded-none px-0 ${errors.signatureDate ? "border-red-500" : "border-gray-200"}`}
            />
          </div>
        </div>

        <div className="border border-gray-300 rounded-md overflow-hidden mb-10">
          <div className="bg-gray-100 px-5 py-3 border-b border-gray-300">
            <h3 className="font-bold text-gray-900">What Happens Next?</h3>
          </div>
          <div className="px-5 py-5 space-y-4 text-sm text-gray-700">
            <p>
              <strong className="text-gray-900">01 — We Review</strong> Our team reviews your information and materials.
            </p>
            <p>
              <strong className="text-gray-900">02 — We Meet</strong> You&apos;ll meet with a Lift &amp; Launch expert to discuss your goals and challenges.
            </p>
            <p>
              <strong className="text-gray-900">03 — We Recommend a Path</strong> Based on your needs, we&apos;ll discuss the appropriate next step — the platform, consultation, coaching, or additional agency support.
            </p>
          </div>
        </div>

        {status === "error" && (
          <p className="mb-6 text-red-700 text-sm font-semibold bg-red-50 border border-red-100 rounded-md px-4 py-3">
            {message}
          </p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="cursor-pointer inline-flex items-center gap-2 px-10 py-3.5 rounded-full bg-[#F5C518] hover:bg-yellow-400 text-[#001d59] font-bold disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting…
              </>
            ) : (
              "Submit Consultation Intake"
            )}
          </button>
        </div>
      </section>
    </form>
  );
}
