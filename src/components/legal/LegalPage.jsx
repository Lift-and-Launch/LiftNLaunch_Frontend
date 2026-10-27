import React from "react";
import { Link } from "react-router-dom";
import { LEGAL_CONFIG } from "../../data/legal";

/** Shared shell for the Terms of Service and Privacy Policy pages. */
export default function LegalPage({ title, lastUpdated, sections, otherLink, children }) {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <article className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
        <header className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{title}</h1>
          <p className="text-sm text-gray-500">
            Effective date: {LEGAL_CONFIG.effectiveDate}
            {lastUpdated ? ` · Last updated: ${lastUpdated}` : ""}
          </p>
          {otherLink && (
            <p className="text-sm text-gray-500 mt-2">
              See also our{" "}
              <Link to={otherLink.to} className="text-yellow-600 font-semibold underline">
                {otherLink.label}
              </Link>
              .
            </p>
          )}
        </header>

        {sections?.length > 0 && (
          <nav aria-label="Contents" className="mb-10 bg-gray-50 rounded-2xl p-6">
            <p className="text-sm font-bold text-gray-900 mb-3">Contents</p>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-yellow-600">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="legal-body space-y-10">{children}</div>
      </article>
    </div>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LegalList({ items, ordered = false }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

export function LegalContact() {
  const { legalEntityName, mailingAddress, contactEmail } = LEGAL_CONFIG;
  return (
    <address className="not-italic">
      {legalEntityName}
      <br />
      {mailingAddress && (
        <>
          {mailingAddress}
          <br />
        </>
      )}
      <a href={`mailto:${contactEmail}`} className="text-yellow-600 underline">
        {contactEmail}
      </a>
    </address>
  );
}
