import React from "react";
import { Link } from "react-router-dom";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";
import { LEGAL_CONFIG } from "../data/legal";
import LegalPage, { LegalSection, LegalList, LegalContact } from "../components/legal/LegalPage";

const SECTIONS = [
  { id: "short-version", label: "The short version" },
  { id: "agreement", label: "1. Agreement" },
  { id: "eligibility", label: "2. Who can use the Services" },
  { id: "account", label: "3. Your account" },
  { id: "billing", label: "4. Plans, billing and renewals" },
  { id: "free-trial", label: "5. Free trial" },
  { id: "beta", label: "6. Beta program" },
  { id: "cancellation", label: "7. Cancellation and refunds" },
  { id: "your-content", label: "8. Your content" },
  { id: "ai-features", label: "9. AI features" },
  { id: "launchvault", label: "10. LaunchVault" },
  { id: "crowdfunding", label: "11. Crowdfunding and investor raises" },
  { id: "human-services", label: "12. Optional human services" },
  { id: "our-property", label: "13. Our property" },
  { id: "acceptable-use", label: "14. Acceptable use" },
  { id: "other-services", label: "15. Other services" },
  { id: "feedback", label: "16. Feedback" },
  { id: "termination", label: "17. Ending the agreement" },
  { id: "disclaimers", label: "18. Disclaimers" },
  { id: "liability", label: "19. Limit of liability" },
  { id: "indemnity", label: "20. Indemnity" },
  { id: "disputes", label: "21. Disputes" },
  { id: "changes", label: "22. Changes to these Terms" },
  { id: "contact", label: "23. Contact" },
];

const Mail = () => (
  <a href={`mailto:${LEGAL_CONFIG.contactEmail}`} className="text-yellow-600 underline">
    {LEGAL_CONFIG.contactEmail}
  </a>
);

const PrivacyLink = () => (
  <Link to="/privacy" className="text-yellow-600 underline">
    Privacy Policy
  </Link>
);

export default function TermsOfService() {
  const c = LEGAL_CONFIG;

  return (
    <>
      <Seo {...pageSeo.terms} />
      <LegalPage
        title="Lift & Launch Terms of Service"
        sections={SECTIONS}
        otherLink={{ to: "/privacy", label: "Privacy Policy" }}
      >
        <LegalSection id="short-version" title="The short version">
          <LegalList
            items={[
              <>
                <strong>You&apos;re the boss. Our AI is the helper.</strong> Venture Navigator and
                LaunchVault give research, suggestions and tools. You make every decision and
                you&apos;re responsible for them.
              </>,
              <>
                <strong>AI results aren&apos;t professional advice.</strong> They&apos;re not
                legal, financial, tax, investment or securities advice, and they can be wrong.
                Check important things with a qualified professional.
              </>,
              <>
                <strong>Subscriptions renew monthly until you cancel.</strong> You can cancel any
                time, and you keep access until the end of the period you paid for.
              </>,
              <>
                <strong>Your business and your content are yours.</strong> You give us permission
                to use them only to run the Services for you.
              </>,
              <>
                <strong>
                  Lift &amp; Launch is not a crowdfunding platform, broker or investment adviser.
                </strong>{" "}
                Live campaigns happen on the platform you choose.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="agreement" title="1. Agreement">
          <p>
            These Terms are an agreement between you and {c.legalEntityName} (&quot;Lift &amp;
            Launch,&quot; &quot;we,&quot; &quot;us&quot;). They cover our website at
            liftandlaunch.co and our software, Venture Navigator (including Navigator and Venture
            Validator) and LaunchVault (together, the &quot;Services&quot;). By creating an
            account or using the Services, you agree to these Terms and to our <PrivacyLink />. If
            you use the Services for a company, you confirm you can accept these Terms for it.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" title="2. Who can use the Services">
          <p>
            You must be at least {c.minimumAge} years old and able to make a binding agreement.
            The Services are for building and running businesses.
          </p>
        </LegalSection>

        <LegalSection id="account" title="3. Your account">
          <LegalList
            items={[
              "Give us true, current information, and keep it up to date.",
              "Keep your password safe. You're responsible for what happens in your account.",
              <>
                Tell us right away at <Mail /> if you think someone used your account without
                permission.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="billing" title="4. Plans, billing and renewals">
          <LegalList
            items={[
              <>
                <strong>Subscriptions.</strong> Plans are billed monthly in advance at the price
                shown when you sign up or change plans. They renew automatically each month until
                you cancel.
              </>,
              <>
                <strong>Payments.</strong> Payments are processed by Stripe. You authorize us,
                through Stripe, to charge your payment method each billing period. Prices
                don&apos;t include taxes unless we say so.
              </>,
              <>
                <strong>Failed payments.</strong> If a payment fails, we&apos;ll email you. If it
                isn&apos;t fixed within {c.gracePeriodDays} days, we may pause or end your access.
              </>,
              <>
                <strong>Plan changes.</strong> Upgrades take effect right away; you&apos;re charged
                the prorated price difference for the rest of the current billing period.
                Downgrades take effect at the start of your next billing period.
              </>,
              <>
                <strong>Price changes.</strong> We&apos;ll email you at least {c.priceNoticeDays}{" "}
                days before a price change affects your plan. You can cancel before it takes
                effect.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="free-trial" title="5. Free trial">
          <LegalList
            items={[
              `New customers may get a ${c.trialDays}-day free trial of LaunchVault Starter.`,
              <>
                When the trial ends, it becomes a paid Starter subscription at the price shown at
                sign-up, <strong>unless you cancel before the trial ends.</strong> We&apos;ll email
                you a reminder before it ends.
              </>,
              "One trial per person or business.",
            ]}
          />
        </LegalSection>

        <LegalSection id="beta" title="6. Beta program">
          <p>
            If you join our free beta program, you get the Services free for the beta period we
            tell you. In return, we ask for your honest feedback. Beta features may change, have
            bugs, or be removed. At the end of the beta, you can choose to become a paying
            subscriber; nothing is charged unless you choose a paid plan.
          </p>
        </LegalSection>

        <LegalSection id="cancellation" title="7. Cancellation and refunds">
          <LegalList
            items={[
              <>
                Cancel any time in your account settings or by emailing <Mail />.
              </>,
              "You keep access until the end of the period you already paid for. Your plan won't renew after that.",
              <>
                <strong>Refunds:</strong> Payments are non-refundable, except where the law
                requires a refund. If something went wrong with your bill, contact us within 30
                days and we&apos;ll make it right.
              </>,
              <>
                Deleting your account is separate from cancelling: it removes your information as
                described in our <PrivacyLink />.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="your-content" title="8. Your content">
          <LegalList
            items={[
              <>
                <strong>You own your content:</strong> the ideas, plans, answers, research,
                worksheets, images, pages and customer lists you put into or create with the
                Services.
              </>,
              <>
                You give us a limited permission to host, store, copy, process and display your
                content <strong>only to run, secure and support the Services for you</strong>{" "}
                (including sending it to our service providers, such as AI providers, as described
                in the <PrivacyLink />). This permission ends when you delete your content or
                account, except for copies we must keep by law or in backups for a short time.
              </>,
              "You confirm you have the right to use everything you upload, and that it doesn't break anyone else's rights or the law.",
            ]}
          />
        </LegalSection>

        <LegalSection id="ai-features" title="9. AI features: suggestions, not advice">
          <LegalList
            items={[
              "Navigator and Venture Validator use artificial intelligence to give research, explanations, suggestions and alternatives. AI can make mistakes, miss information, or be out of date.",
              <>
                <strong>
                  Nothing in the Services is legal, financial, tax, accounting, investment or
                  securities advice.
                </strong>
              </>,
              "Venture Validator's research is not proof of demand. Real customer testing is still needed.",
              <>
                <strong>Intellectual property research</strong> (patents, trademarks and similar)
                is not legal advice and is not a formal clearance search. Talk to a qualified
                attorney before relying on it.
              </>,
              "You decide what to use, and you're responsible for your business decisions.",
            ]}
          />
        </LegalSection>

        <LegalSection id="launchvault" title="10. LaunchVault: your pages, marketing and customers">
          <LegalList
            items={[
              <>
                <strong>You&apos;re responsible for what you publish:</strong> your landing pages,
                ads, emails and claims must be truthful and follow the law and each
                platform&apos;s rules.
              </>,
              <>
                <strong>Your customer lists are yours.</strong> You&apos;re responsible for
                collecting contacts lawfully (giving notice, getting consent where needed, and
                honoring unsubscribe requests, including under anti-spam and telemarketing laws).
              </>,
              <>
                <strong>Reservations, deposits and payments</strong> you take through your own
                Stripe account are between you and your customers. You&apos;re the seller, and
                you&apos;re responsible for delivering what you promise, your refunds, and your
                taxes.
              </>,
              <>
                <strong>Connected accounts</strong> (Meta, LinkedIn, Google, Stripe and others) are
                used only as you authorize. The AI suggests; you approve, spend and publish.
                You&apos;re responsible for your ad spend.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="crowdfunding" title="11. Crowdfunding and investor raises">
          <LegalList
            items={[
              "Lift & Launch helps you get ready. Your live campaign runs on the crowdfunding platform you choose (for example, Kickstarter for rewards, or a registered platform for an investor raise), under that platform's terms.",
              <>
                <strong>
                  Lift &amp; Launch is not a crowdfunding platform, funding portal, broker-dealer
                  or investment adviser, and we don&apos;t offer or sell securities.
                </strong>
              </>,
              "We never promise funding, sales or results.",
              "Investor raises follow securities laws. Talk to a qualified securities attorney before you share anything about a raise.",
              "Lift & Launch Seed Ventures is a related company. Using our Services never makes you eligible for, or approved for, any investment from it.",
            ]}
          />
        </LegalSection>

        <LegalSection id="human-services" title="12. Optional human services">
          <p>
            Hands-on help from the Lift &amp; Launch Crowdfunding Agency (Capital Unlocked) is
            optional and covered by a separate agreement. You never need it to use the Services.
          </p>
        </LegalSection>

        <LegalSection id="our-property" title="13. Our property">
          <p>
            The Services, our software, designs, brand names (Lift &amp; Launch, Venture
            Navigator, LaunchVault), and our educational materials (including the Lift &amp;
            Launch Playbook worksheets and frameworks) belong to us. While you&apos;re a customer,
            you may use our worksheets and materials for your own business. You may not copy,
            resell or share them publicly, or copy the Services.
          </p>
        </LegalSection>

        <LegalSection id="acceptable-use" title="14. Acceptable use">
          <p>Don&apos;t use the Services to:</p>
          <LegalList
            items={[
              "break the law or anyone's rights, or mislead people (including fake claims or reviews);",
              "send spam, or contact people who haven't agreed to hear from you;",
              "upload harmful code, try to break in, or overload the Services;",
              "scrape, copy or resell the Services, or use them to build a competing product;",
              "share your account with people outside your business.",
            ]}
          />
          <p>We may remove content or suspend accounts that break these rules.</p>
        </LegalSection>

        <LegalSection id="other-services" title="15. Other services">
          <p>
            The Services connect to services run by others (like Stripe, ad platforms and
            crowdfunding platforms). Their own terms apply, and we&apos;re not responsible for
            them.
          </p>
        </LegalSection>

        <LegalSection id="feedback" title="16. Feedback">
          <p>
            If you send us ideas or feedback, we may use them to improve the Services, with no
            obligation to you.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="17. Ending the agreement">
          <p>
            You can stop using the Services and cancel any time. We may suspend or end your access
            if you break these Terms, don&apos;t pay, or create a risk for others. We&apos;ll give
            notice when it&apos;s reasonable to do so. Sections that by their nature should
            continue (like ownership, disclaimers and limits of liability) continue after the
            agreement ends.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" title="18. Disclaimers">
          <p>
            The Services are provided &quot;as is&quot; and &quot;as available.&quot; To the
            extent the law allows, we disclaim all warranties, express or implied, including
            fitness for a particular purpose. We don&apos;t promise the Services will be
            error-free or always available, or that any result (funding, sales, validation) will
            happen.
          </p>
        </LegalSection>

        <LegalSection id="liability" title="19. Limit of liability">
          <p>
            To the extent the law allows, Lift &amp; Launch won&apos;t be liable for indirect,
            incidental, special or consequential damages, or for lost profits, revenue or data.
            Our total liability for any claim is limited to the amount you paid us in the 12
            months before the claim.
          </p>
        </LegalSection>

        <LegalSection id="indemnity" title="20. Indemnity">
          <p>
            You agree to defend and hold Lift &amp; Launch harmless from claims arising from your
            content, your campaigns and marketing, your products, your dealings with your
            customers or backers, or your breaking these Terms or the law.
          </p>
        </LegalSection>

        <LegalSection id="disputes" title="21. Disputes">
          <p>
            Let&apos;s try to fix any problem informally first: email <Mail /> and give us 30
            days to respond. These Terms follow the laws of {c.governingLaw}.
            {c.disputeResolution ? ` ${c.disputeResolution}` : ""}
          </p>
        </LegalSection>

        <LegalSection id="changes" title="22. Changes to these Terms">
          <p>
            If we make important changes, we&apos;ll tell you by email or in the Services before
            they take effect. If you keep using the Services after that, you accept the new Terms.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="23. Contact">
          <LegalContact />
        </LegalSection>
      </LegalPage>
    </>
  );
}
