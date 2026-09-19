import PageHeader from '@/components/shared/PageHeader';
import { CONTACT, SITE } from '@/lib/constants';

export const metadata = {
  alternates: { canonical: '/terms' },
  title: 'Terms of Use',
  description: 'Terms governing use of The Eastern Newspaper website and its content.',
};

const UPDATED = '19 September 2026';

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms of Use"
        description={`Last updated ${UPDATED}`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]}
      />

      <div className="en-container py-8 md:py-10">
        <article className="prose-page mx-auto max-w-3xl">
          <p>
            By using this website you agree to these terms. Please read them before using
            the site.
          </p>

          <h2>Content and copyright</h2>
          <p>
            All editorial content published by {SITE.name} — text, photographs, graphics and
            page design — is owned by us or licensed to us, and is protected by copyright.
            You may read, share and link to our stories freely. You may quote short extracts
            with attribution and a link back to the original article.
          </p>
          <p>
            You may not republish our articles or photographs in full, or use them for
            commercial purposes, without written permission. Syndication and reprint requests
            are welcome — contact the newsroom.
          </p>

          <h2>Accuracy and corrections</h2>
          <p>
            We aim for accuracy and fairness. Reporting reflects what was known at the time
            of publication and may be updated as a story develops; material updates are dated
            on the article. If you believe something we published is wrong, please tell us.
            Corrections are published prominently and the original is not silently altered.
          </p>

          <h2>Opinion and analysis</h2>
          <p>
            Material labelled <strong>Opinion</strong> or <strong>Editorial</strong> represents
            the views of the author or of the editorial board, not straightforward news
            reporting. These labels are applied consistently so readers can always tell
            comment from reporting.
          </p>

          <h2>Advertising and sponsored content</h2>
          <p>
            Anything published in exchange for payment is labelled{' '}
            <strong>Sponsored Content</strong>. Sponsored material is not written by our
            newsroom and does not represent the views of {SITE.name}. We keep a clear
            separation between advertising and editorial.
          </p>

          <h2>Comments and contributions</h2>
          <p>
            Where you can submit material to us, you confirm it is your own work and that it
            does not break any law or anyone else’s rights. We may edit or decline to publish
            contributions, and we are not obliged to publish anything submitted.
          </p>

          <h2>Availability</h2>
          <p>
            We work to keep the site available and secure, but we do not guarantee
            uninterrupted access, and we may change or withdraw parts of it.
          </p>

          <h2>Liability</h2>
          <p>
            To the extent permitted by law, we are not liable for loss arising from use of
            this website or reliance on its content. Nothing in these terms limits liability
            that cannot be limited by law.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the Republic of Kenya.</p>

          <h2>Contact</h2>
          <p>
            {CONTACT.address}, {CONTACT.postal}.
            <br />
            General enquiries: {CONTACT.deskEmails[0].email}
            <br />
            Verified email: {CONTACT.verifiedEmail}
          </p>
        </article>
      </div>
    </div>
  );
}
