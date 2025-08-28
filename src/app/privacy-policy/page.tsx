import React from 'react';

export const metadata = { title: 'Privacy Policy - AdamCoTech' };

export default function PrivacyPolicyPage(){
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-8">Effective Date: July 26, 2025</p>
      <div className="mb-6 flex flex-wrap gap-3 text-[11px] font-medium text-gray-300">
        {['Contact Information','Data We Collect','How We Use Your Data','Legal Bases','Sharing of Personal Data','Data Sources','International Transfers','Cookies & Technologies','Data Retention','Your Rights','Data Protection Officer','Automated Decision-Making','Data Security','Changes','Intellectual Property & Enforcement'].map(anchor => (
          <a key={anchor} href={'#'+anchor.toLowerCase().replace(/[^a-z0-9]+/g,'-')} className="hover:text-white">{anchor}</a>
        ))}
      </div>
      <article className="prose prose-invert max-w-none prose-sm prose-headings:text-white prose-a:text-red-400 prose-li:marker:text-gray-400 [&>h2]:mt-12 [&>h2:first-of-type]:mt-0 [&>h3]:mt-10 [&_ul]:space-y-2">
  <p>This Privacy Policy describes how AdamCotech (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your personal data in compliance with the General Data Protection Regulation (GDPR) and other applicable European privacy laws.</p>

        <h2 id="contact-information">1. CONTACT INFORMATION</h2>
        <p><strong>Adam &amp; Co tech</strong><br/>Admiraal de Ruiterweg 437, Amsterdam, Netherlands<br/>Phone: +31 6 27914333<br/>Email: <a href="mailto:info@adamcotech.nl">info@adamcotech.nl</a><br/>Website: <a href="https://adamcotech.nl" target="_blank" rel="noopener noreferrer">adamcotech.nl</a></p>

        <h2 id="data-we-collect">2. DATA WE COLLECT</h2>
        <p>We may collect and process the following types of personal data:</p>
  <ul className="space-y-2">
          <li>Identity information (e.g., name, date of birth)</li>
          <li>Contact information (e.g., email, phone number, address)</li>
          <li>Payment details (handled securely through payment processors)</li>
          <li>Order and delivery information</li>
          <li>Technical data (IP address, browser type, device identifiers)</li>
          <li>Usage data (website interaction, cookies, tracking pixels)</li>
        </ul>

        <h2 id="how-we-use-your-data">3. HOW WE USE YOUR DATA</h2>
        <p>Your personal data is used for the following purposes:</p>
  <ul className="space-y-2">
          <li>Order processing and fulfillment</li>
          <li>Customer service and support</li>
          <li>Account management</li>
          <li>Marketing communications (only with your explicit consent)</li>
          <li>Analytics and website improvement</li>
          <li>Legal compliance and fraud prevention</li>
          <li>Enforcement of our intellectual property rights and protection of our legal interests</li>
        </ul>
        <p><strong>Marketing communications:</strong> Where required by law, we obtain your explicit opt-in consent before sending any promotional emails or newsletters. You can withdraw your consent at any time by clicking the “unsubscribe” link in our emails or contacting us directly at <a href="mailto:info@adamcotech.nl">info@adamcotech.nl</a>.</p>

        <h2 id="legal-bases">4. LEGAL BASES FOR PROCESSING</h2>
        <p>We rely on the following lawful bases for processing your personal data:</p>
  <ul className="space-y-2">
          <li>Your consent (e.g., for email marketing or cookies)</li>
          <li>Performance of a contract (e.g., order fulfillment)</li>
          <li>Compliance with legal obligations (e.g., tax, accounting)</li>
          <li>Legitimate interests (e.g., website functionality, business analytics)</li>
          <li>Our legitimate interest in protecting our intellectual property rights and preventing unauthorized use of our services or materials</li>
        </ul>
        <p>Where processing is based on your consent, you have the right to withdraw it any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>

        <h2 id="sharing-of-personal-data">5. SHARING OF PERSONAL DATA</h2>
        <p>We may share your data with:</p>
  <ul className="space-y-2">
          <li>Service providers (e.g., hosting, delivery, marketing, payment)</li>
          <li>Legal authorities when required by law</li>
          <li>Business partners where necessary and in compliance with GDPR</li>
        </ul>

        <h3 id="data-sources">5A. DATA SOURCES</h3>
        <p>In addition to data you provide directly, we may receive personal data from trusted third-party sources, including:</p>
  <ul className="space-y-2">
          <li>Payment service providers</li>
          <li>Delivery and logistics partners</li>
          <li>Marketing and advertising platforms</li>
        </ul>

        <h2 id="international-transfers">6. INTERNATIONAL DATA TRANSFERS</h2>
        <p>We implement appropriate safeguards such as the European Commission’s Standard Contractual Clauses (SCCs) or rely on adequacy decisions for countries deemed to provide an adequate level of protection.</p>

        <h2 id="cookies-technologies">7. COOKIES AND SIMILAR TECHNOLOGIES</h2>
        <p>We use cookies, tracking pixels, and other technologies to improve your user experience, analyze traffic, personalize content, and support advertising. You can manage your cookie preferences via our cookie consent banner when you first visit the site or by adjusting your browser settings. Some cookies are necessary for website functionality and cannot be disabled. For a detailed explanation of the cookies we use, their purpose, and their duration, please see our <a href="https://adamcotech.nl/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.</p>

        <h2 id="data-retention">8. DATA RETENTION</h2>
        <p>We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. For example:</p>
  <ul className="space-y-2">
          <li>Order and transaction data – retained for 7 years for tax and accounting purposes</li>
          <li>Marketing data – retained for up to 2 years after your last interaction unless consent is withdrawn</li>
          <li>Technical and usage data – retained for up to 12 months for analytics and site improvement</li>
        </ul>
        <p>After these periods, personal data is securely deleted or anonymized.</p>

        <h2 id="your-rights">9. YOUR RIGHTS UNDER GDPR</h2>
        <p>You have the right to:</p>
  <ul className="space-y-2">
          <li>Access your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Erase your personal data (“right to be forgotten”)</li>
          <li>Restrict or object to data processing</li>
          <li>Data portability</li>
          <li>Withdraw your consent at any time</li>
          <li>Lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens)</li>
        </ul>
        <p>You may exercise these rights by contacting us at <a href="mailto:info@adamcotech.nl">info@adamcotech.nl</a>. We may require identity verification to process certain requests.</p>

        <h3 id="data-protection-officer">9A. DATA PROTECTION OFFICER (IF APPLICABLE)</h3>
        <p>Our Data Protection Officer (DPO) can be contacted at: <a href="mailto:dpo@adamcotech.nl">dpo@adamcotech.nl</a>.</p>

        <h3 id="automated-decision-making">9B. AUTOMATED DECISION-MAKING AND PROFILING</h3>
        <p>We do not use your personal data for automated decision-making that produces legal or similarly significant effects. Any personalization (e.g., showing you relevant products) is based on your activity and preferences but does not involve profiling with legal consequences.</p>

        <h2 id="data-security">10. DATA SECURITY</h2>
        <p>We implement technical and organizational measures to protect your data, including encryption, access control, and secure storage.</p>

        <h2 id="changes">11. CHANGES TO THIS PRIVACY POLICY</h2>
        <p>We may update this policy periodically. Any significant changes will be communicated through our website or email.</p>

        <h2 id="intellectual-property-enforcement">12. INTELLECTUAL PROPERTY AND ENFORCEMENT</h2>
        <p>We reserve the right to process personal data when necessary for the enforcement of our intellectual property rights, including copyrights, trademarks, and other protected content or technology. This may include the collection of technical information, such as IP addresses or usage logs, to detect potential infringements or support legal proceedings. This processing is based on our legitimate interest in protecting our rights, as permitted under Article 6(1)(f) of the GDPR.</p>

        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@adamcotech.nl">info@adamcotech.nl</a>.</p>
      </article>
      <p className="mt-12 text-[11px] text-gray-500">Last reviewed: {new Date().toLocaleDateString()}</p>
    </div>
  );
}
