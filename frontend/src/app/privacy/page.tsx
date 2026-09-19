import PageHeader from '@/components/shared/PageHeader';
import { CONTACT, SITE } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/privacy' },
  title: 'Privacy Policy',
  description: 'How The Eastern Newspaper collects, uses and protects reader information.',
};

const UPDATED = '19 September 2026';

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Privacy Policy"
        description={`Last updated ${UPDATED}`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
      />

      <div className="en-container py-8 md:py-10">
        <article className="prose-page mx-auto max-w-3xl">
          <p>
            {SITE.name} (“we”, “us”) publishes news for the Eastern Kenya region. This
            policy explains what information we collect when you read our reporting or
            contact the newsroom, and what we do with it.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you give us.</strong> If you contact the newsroom,
              submit a tip, subscribe to the newsletter or make an advertising enquiry, we
              receive the details you provide — typically your name, email address and the
              content of your message.
            </li>
            <li>
              <strong>Automatic information.</strong> Like most publishers, our server logs
              record standard technical data such as your IP address, browser type and the
              pages you request. This is used to keep the site secure and to understand
              which stories readers are opening.
            </li>
            <li>
              <strong>Cookies.</strong> We use a minimal set of cookies necessary to run
              the site. We do not use advertising or cross-site tracking cookies on our
              editorial pages.
            </li>
          </ul>

          <h2>How we use information</h2>
          <ul>
            <li>To publish, maintain and improve our journalism.</li>
            <li>To respond to your enquiries, tips and advertising requests.</li>
            <li>To send the newsletter, if you have asked for it. Every edition includes a way to unsubscribe.</li>
            <li>To understand aggregate readership so we can commission better reporting.</li>
          </ul>

          <h2>Sharing</h2>
          <p>
            We do not sell reader information. We share data only with service providers who
            help us operate the website (for example our hosting and email delivery
            providers), and where we are legally required to do so.
          </p>

          <h2>Your choices</h2>
          <p>
            You can unsubscribe from the newsletter at any time, ask us what information we
            hold about you, or ask us to correct or delete it. Use the contact details below
            and we will respond.
          </p>

          <h2>Children</h2>
          <p>
            Our reporting is intended for a general audience. We do not knowingly collect
            personal information from children under 16.
          </p>

          <h2>Contact</h2>
          <p>
            {CONTACT.address}, {CONTACT.postal}.
            <br />
            General enquiries: {CONTACT.deskEmails[0].email}
            <br />
            Verified email: {CONTACT.verifiedEmail}
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as the site develops. The date at the top of this page
            shows when it was last revised.
          </p>
        </article>
      </div>
    </div>
  );
}
