import React, { useMemo, useState } from "react";
import { Interest, NextStep, Readiness } from "../types";

const interestLabels = {
    [Interest.CROWDFUNDING_SUPPORT]: "Crowdfunding Campaign Support",
    [Interest.MARKETING_PRELAUNCH]: "Marketing & Pre-Launch Campaigns",
    [Interest.STORY_BRAND_PITCH]: "Storytelling, Branding, or Pitch Development",
    [Interest.BIZ_MODEL_FINANCE]: "Business Model or Financial Strategy",
    [Interest.EQUITY_CROWDFUNDING]: "Equity Crowdfunding (Reg CF)",
    [Interest.OTHER]: "Other (please specify)",
};

export default function InquiryFormMultiStep() {
    const [phase, setPhase] = useState(1);
    const [status, setStatus] = useState("idle");
    const [msg, setMsg] = useState("");

    const [city, setCity] = useState("");
    const [stateProv, setStateProv] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        address: "", 
        interests: [],
        otherInterest: "",
        goal: "",
        readiness: Readiness.EXPLORING,
        nextStep: NextStep.SEND_INFO,
    });

    const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const toggleInterest = (val) =>
        setForm((f) => {
            const exists = f.interests.includes(val);
            const interests = exists ? f.interests.filter((i) => i !== val) : [...f.interests, val];
            const otherInterest = interests.includes(Interest.OTHER) ? f.otherInterest : "";
            return { ...f, interests, otherInterest };
        });

    const phaseValid = useMemo(() => {
        switch (phase) {
            case 1:
                return (
                    form.fullName.trim().length >= 2 &&
                    /\S+@\S+\.\S+/.test(form.email) &&
                    (city.trim().length > 0 || stateProv.trim().length > 0)
                );
            case 2:
                if (form.interests.length === 0) return false;
                if (form.interests.includes(Interest.OTHER)) {
                    return (form.otherInterest ?? "").trim().length > 0;
                }
                return true;
            case 3:
                return form.goal.trim().length > 1;
            case 4:
                return true;
            case 5:
                return true;
            default:
                return false;
        }
    }, [phase, form, city, stateProv]);

    const goNext = () => setPhase((p) => (p < 5 ? p + 1 : p));
    const goBack = () => setPhase((p) => (p > 1 ? p - 1 : p));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!phaseValid || phase !== 5) return;

        setStatus("submitting");
        setMsg("");

        // Mock success for static version
        setTimeout(() => {
            setStatus("success");
            setMsg("Thank you! Your inquiry has been (mock) submitted.");
            setPhase(1);
            setForm({
                fullName: "",
                email: "",
                phone: "",
                businessName: "",
                address: "",
                interests: [],
                otherInterest: "",
                goal: "",
                readiness: Readiness.EXPLORING,
                nextStep: NextStep.SEND_INFO,
            });
            setCity("");
            setStateProv("");
        }, 1500);
    };

    return (
        <form onSubmit={onSubmit} className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Step 1: Basic Information */}
            {phase === 1 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">Full Name *</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                            value={form.fullName}
                            onChange={setField("fullName")}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">Email *</label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                value={form.email}
                                onChange={setField("email")}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                value={form.phone}
                                onChange={setField("phone")}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">City *</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">State *</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                    value={stateProv}
                                    onChange={(e) => setStateProv(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">Business Name</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                value={form.businessName}
                                onChange={setField("businessName")}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Step 2: Area of Interest */}
            {phase === 2 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Area of Interest *</h3>
                    <fieldset className="grid gap-3">
                        {Object.entries(interestLabels).map(([val, label]) => (
                            <label key={val} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                                    checked={form.interests.includes(val)}
                                    onChange={() => toggleInterest(val)}
                                />
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                            </label>
                        ))}
                    </fieldset>

                    {form.interests.includes(Interest.OTHER) && (
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-bold text-gray-700">Please specify *</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                                value={form.otherInterest}
                                onChange={setField("otherInterest")}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* Step 3: Your Goals */}
            {phase === 3 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Goals</h3>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        What’s your biggest goal in the next 6–12 months? *
                    </label>
                    <textarea
                        className="min-h-[150px] w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all resize-none"
                        value={form.goal}
                        onChange={setField("goal")}
                        required
                    />
                </section>
            )}

            {/* Step 4: Readiness */}
            {phase === 4 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Readiness</h3>
                    <div className="grid gap-3">
                        {[
                            { val: Readiness.WITHIN_3_MONTHS, label: "Within 3 months" },
                            { val: Readiness.THREE_TO_SIX_MONTHS, label: "3–6 months" },
                            { val: Readiness.SIX_TO_TWELVE_MONTHS, label: "6–12 months" },
                            { val: Readiness.EXPLORING, label: "Just exploring right now" },
                        ].map(({ val, label }) => (
                            <label key={val} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                <input
                                    type="radio"
                                    name="readiness"
                                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                                    checked={form.readiness === val}
                                    onChange={() => setForm((f) => ({ ...f, readiness: val }))}
                                />
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                            </label>
                        ))}
                    </div>
                </section>
            )}

            {/* Step 5: Next Steps */}
            {phase === 5 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
                    <div className="grid gap-3">
                        {[
                            { val: NextStep.BOOK_CALL, label: "Yes, let’s book a call" },
                            { val: NextStep.SEND_INFO, label: "Not yet, just send me info" },
                        ].map(({ val, label }) => (
                            <label key={val} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                <input
                                    type="radio"
                                    name="nextStep"
                                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                                    checked={form.nextStep === val}
                                    onChange={() => setForm((f) => ({ ...f, nextStep: val }))}
                                />
                                <span className="text-sm font-medium text-gray-700">{label}</span>
                            </label>
                        ))}
                    </div>
                </section>
            )}

            {/* Controls */}
            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  {phase > 1 && (
                      <button
                          type="button"
                          onClick={goBack}
                          className="text-gray-600 font-bold hover:text-gray-900 transition-colors"
                      >
                          ← Back
                      </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {msg && (
                      <p className={status === "success" ? "text-sm font-bold text-green-600" : "text-sm font-bold text-rose-600"}>
                          {msg}
                      </p>
                  )}

                  {phase < 5 ? (
                      <button
                          type="button"
                          onClick={goNext}
                          disabled={!phaseValid}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                          Next Step
                      </button>
                  ) : (
                      <button
                          type="submit"
                          disabled={!phaseValid || status === "submitting"}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full transition-all disabled:opacity-50 shadow-md"
                      >
                          {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
                      </button>
                  )}
                </div>
            </div>
        </form>
    );
}
