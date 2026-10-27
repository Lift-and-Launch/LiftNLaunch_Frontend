import React from "react";
import Seo from "../seo/Seo";
import { pageSeo } from "../seo/seoConfig";
import { LEGAL_CONFIG } from "../data/legal";
import LegalPage, { LegalSection, LegalList, LegalContact } from "../components/legal/LegalPage";

const SECTIONS = [
  { id: "who-we-are", label: "1. Who we are" },
  { id: "short-version", label: "2. The short version" },
  { id: "information-we-collect", label: "3. Information we collect" },
  { id: "how-we-use", label: "4. How we use your information" },
  { id: "how-we-share", label: "5. How we share information" },
  { id: "customer-lists", label: "6. Your customer lists in LaunchVault" },
  { id: "retention", label: "7. How long we keep information" },
  { id: "your-rights", label: "8. Your choices and rights" },
  { id: "security", label: "9. How we protect information" },
  { id: "children", label: "10. Children" },
  { id: "storage-location", label: "11. Where information is stored" },
  { id: "changes", label: "12. Changes to this policy" },
  { id: "contact", label: "13. Contact us" },
];

const Mail = () => (
  <a href={`mailto:${LEGAL_CONFIG.contactEmail}`} className="text-yellow-600 underline">
    {LEGAL_CONFIG.contactEmail}
  </a>
);

export default function PrivacyPolicy() {
  const c = LEGAL_CONFIG;

  return (
    <>
      <Seo {...pageSeo.privacy} />
      <LegalPage
        title="Lift & Launch Privacy Policy"
        lastUpdated={c.effectiveDate}
        sections={SECTIONS}
        otherLink={{ to: "/terms", label: "Terms of Service" }}
      >
        <LegalSection id="who-we-are" title="1. Who we are">
          <p>
            This Privacy Policy explains how {c.legalEntityName} (&quot;Lift &amp; Launch,&quot;
            &quot;we,&quot; &quot;us&quot;) collects, uses, shares and protects personal information
            when you use our website at liftandlaunch.co and our software: Venture Navigator
            (including Navigator and Venture Validator) and LaunchVault (together, the
            &quot;Services&quot;).
          </p>
          <p>
            Our promise applies to your data too: your business, your decisions. You stay in
            control of your information.
          </p>
          <p>
            Questions? Email <Mail />
            {c.mailingAddress ? ` or write to ${c.mailingAddress}` : ""}.
          </p>
        </LegalSection>

        <LegalSection id="short-version" title="2. The short version">
          <LegalList
            items={[
              "We collect what we need to run your account, provide the Services, take payments and support you.",
              <>
                <strong>We do not sell your personal information.</strong> We do not share it for
                cross-context behavioral advertising.
              </>,
              <>
                <strong>Your business information belongs to you.</strong> That includes your
                ideas, plans, research and the customer lists you build in LaunchVault.
              </>,
              "We don't see or store your full card number. Payments are handled by our payment processor, Stripe.",
              "AI features process what you enter so they can give you research and suggestions. You decide what to use.",
              <>
                You can see, download, correct or delete your information. Email <Mail />.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="information-we-collect" title="3. Information we collect">
          <h3 className="font-bold text-gray-900">a. Information you give us</h3>
          <LegalList
            items={[
              <>
                <strong>Account information:</strong> your name, email address, password,
                business name, and the plan you choose.
              </>,
              <>
                <strong>Business information:</strong> what you enter into Venture Navigator and
                LaunchVault: your ideas, answers to guided questions, business model, plans,
                research questions, worksheets, landing page content, images and marketing drafts.
              </>,
              <>
                <strong>Your customer contacts:</strong> the names, emails and other details of
                people who sign up, reserve or buy on the pages you build in LaunchVault (see{" "}
                <a href="#customer-lists" className="underline">Section 6</a>).
              </>,
              <>
                <strong>Support messages:</strong> what you send us when you ask for help.
              </>,
              <>
                <strong>Referrals:</strong> if you invite someone, the name and email you give us,
                so we can send them one invitation.
              </>,
            ]}
          />

          <h3 className="font-bold text-gray-900">b. Payment information</h3>
          <p>
            Payments are processed by Stripe. Stripe collects your card details directly. We
            receive limited information, such as your name, billing email, the last four digits
            of your card, the amount, and whether the payment succeeded. We never see or store
            your full card number.
          </p>

          <h3 className="font-bold text-gray-900">c. Information collected automatically</h3>
          <p>
            When you use our website or the Services, we and our service providers may collect
            device and usage information: IP address, browser type, pages visited, features used,
            dates and times, and similar information, through cookies and similar tools.
          </p>

          <h3 className="font-bold text-gray-900">d. Information from others</h3>
          <LegalList
            items={[
              "From the platforms you connect (for example, ad accounts on Meta, LinkedIn or Google, or your Stripe account), only with your permission and only what you authorize.",
              "From public sources when Venture Validator researches your market, competitors, patents, trademarks or government data. This research is usually about businesses and markets, not individuals.",
            ]}
          />
        </LegalSection>

        <LegalSection id="how-we-use" title="4. How we use your information">
          <p>We use your information to:</p>
          <LegalList
            ordered
            items={[
              <>
                <strong>Provide the Services:</strong> run your account, save your work, generate
                research, suggestions and drafts, build your pages, and deliver your plan&apos;s
                features.
              </>,
              <>
                <strong>Process payments:</strong> subscriptions, receipts, failed-payment
                notices, plan changes and cancellations.
              </>,
              <>
                <strong>Communicate with you:</strong> account and service emails (welcome, trial
                reminders, receipts, support replies) and, if you agree, news and tips. You can
                unsubscribe from marketing emails at any time.
              </>,
              <>
                <strong>Support you:</strong> answer questions and fix problems.
              </>,
              <>
                <strong>Keep things safe:</strong> prevent fraud, abuse and security problems.
              </>,
              <>
                <strong>Improve the Services:</strong> understand which features are used and fix
                what isn&apos;t working, using usage information.
              </>,
              <>
                <strong>Follow the law:</strong> meet legal, tax and accounting duties, and
                enforce our Terms.
              </>,
            ]}
          />
          <p>
            <strong>AI features.</strong> When you use Navigator or Venture Validator, the
            information you enter is sent to our AI service providers so they can produce
            research, explanations and suggestions for you.{" "}
            {/* TODO(legal): Aniket to confirm AI providers' "no training" settings before publishing. */}
            <strong>We do not use your business information to train AI models</strong>, and we
            require our AI providers not to use it to train theirs. AI results can be wrong or
            incomplete. They are suggestions, not legal, financial or investment advice, and you
            make the final decisions.
          </p>
        </LegalSection>

        <LegalSection id="how-we-share" title="5. How we share information">
          <p>
            <strong>We do not sell your personal information.</strong> We share it only:
          </p>
          <LegalList
            items={[
              <>
                <strong>With service providers</strong> who help us run the Services, under
                contracts that limit how they use it: hosting and databases, payment processing
                (Stripe), email delivery, AI processing, analytics and customer support tools.
              </>,
              <>
                <strong>When you ask us to:</strong> for example, when you publish a LaunchVault
                page, connect an ad account, or ask us to share your information with the optional
                Lift &amp; Launch Crowdfunding Agency.
              </>,
              <>
                <strong>With related companies, only with your permission.</strong> Lift &amp;
                Launch Seed Ventures is a related company. We never share your information with it
                unless you ask us to.
              </>,
              <>
                <strong>For legal reasons:</strong> to follow the law, respond to valid legal
                requests, or protect the rights and safety of our users, the public or Lift &amp;
                Launch.
              </>,
              <>
                <strong>If our business changes hands:</strong> in a merger, sale or
                reorganization, your information may transfer to the new owner, who must keep
                honoring this policy.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="customer-lists" title="6. Your customer lists in LaunchVault">
          <p>
            When you collect sign-ups, reservations or purchases through LaunchVault, those
            contacts are <strong>your customers, and you control that list.</strong> We store and
            process it for you, on your instructions, to provide the Services. We don&apos;t
            market to your customers or sell your lists.
          </p>
          <p>
            You&apos;re responsible for collecting your customers&apos; information lawfully:
            telling them how you&apos;ll use it, getting any consent the law requires, and
            honoring their requests (for example, to unsubscribe). LaunchVault gives you tools to
            help.
          </p>
        </LegalSection>

        <LegalSection id="retention" title="7. How long we keep information">
          <LegalList
            items={[
              "We keep your account and business information while your account is open.",
              `When you delete your account, we delete your personal information and business content within ${c.deletionWindowDays} days, except where we must keep some of it for legal, security, tax or financial-record reasons. Billing records, for example, may be kept as long as the law requires.`,
              "Backups are overwritten on a regular schedule.",
            ]}
          />
        </LegalSection>

        <LegalSection id="your-rights" title="8. Your choices and rights">
          <p>You can:</p>
          <LegalList
            items={[
              "See and download the information we hold about you.",
              "Correct information that's wrong.",
              "Delete your account and information.",
              "Stop marketing emails with the unsubscribe link in any marketing email.",
              "Control cookies through your browser settings.",
            ]}
          />
          <p>
            To use these rights, email <Mail />. We&apos;ll verify it&apos;s you and respond
            within {c.responseDays} days. We won&apos;t treat you differently for using your
            rights.
          </p>
          <p>
            <strong>California residents.</strong> Depending on our size and activities, the
            California Consumer Privacy Act may give you specific rights, including to know,
            delete and correct personal information, and to opt out of its sale or sharing. We do
            not sell or share personal information as those terms are defined. You can make a
            request at <Mail />, or through an authorized agent.
          </p>
          <p>
            <strong>Do Not Track.</strong> Our website does not currently respond to browser
            &quot;Do Not Track&quot; signals.
          </p>
        </LegalSection>

        <LegalSection id="security" title="9. How we protect information">
          <p>
            We use reasonable safeguards: encrypted connections (HTTPS), access controls, and
            limits on who can see data. Passwords and keys are stored securely, and payments go
            through Stripe. No system is perfectly secure, so please use a strong password and
            tell us right away if you think your account has been misused.
          </p>
        </LegalSection>

        <LegalSection id="children" title="10. Children">
          <p>
            The Services are for adults building businesses. They are not for children under{" "}
            {c.minimumAge}, and we don&apos;t knowingly collect children&apos;s information. If
            you believe a child has given us information, contact us and we&apos;ll delete it.
          </p>
        </LegalSection>

        <LegalSection id="storage-location" title="11. Where information is stored">
          <p>
            We&apos;re based in the United States, and your information is stored and processed
            in the United States. If you use the Services from another country, your information
            will be transferred to the U.S.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="12. Changes to this policy">
          <p>
            If we make important changes, we&apos;ll tell you by email or in the Services before
            they take effect, and update the date at the top.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="13. Contact us">
          <LegalContact />
        </LegalSection>
      </LegalPage>
    </>
  );
}
