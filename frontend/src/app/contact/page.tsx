import PageHeader from '@/components/shared/PageHeader';
import { CONTACT } from '@/lib/constants';
import ContactForm from './ContactForm';

export const metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact Us',
  description:
    'Contact The Eastern Newspaper newsroom, editor, advertising desk and newsletter team.',
};

/** Only link mailto: for addresses that actually carry a domain. */
const deliverable = (email: string) => /\.[a-z]{2,}$/i.test(email);

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact Us"
        description="Newsroom tips, advertising enquiries, letters to the editor and newsletter sign-up."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      <div className="en-container py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Directory */}
          <div className="lg:col-span-2">
            <div className="border-t-2 border-brand-secondary bg-surface-alt p-5">
              <h2 className="en-kicker mb-4 text-brand-primary">Newsroom</h2>
              <address className="space-y-2 text-sm not-italic leading-relaxed text-muted">
                <p>
                  {CONTACT.address}
                  <br />
                  {CONTACT.postal}
                </p>
                <p>
                  Tel:{' '}
                  <a href={CONTACT.phoneHref} className="font-semibold text-text hover:text-brand-primary">
                    {CONTACT.phones.join(' / ')}
                  </a>
                </p>
              </address>
            </div>

            <div className="mt-6 border-t-2 border-brand-secondary bg-surface-alt p-5">
              <h2 className="en-kicker mb-4 text-brand-primary">Who to contact</h2>
              <dl className="space-y-4">
                {CONTACT.deskEmails.map((d) => (
                  <div key={d.email}>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      {d.label}
                    </dt>
                    <dd className="break-all text-[15px] font-semibold text-text">
                      {deliverable(d.email) ? (
                        <a href={`mailto:${d.email}`} className="hover:text-brand-primary hover:underline">
                          {d.email}
                        </a>
                      ) : (
                        d.email
                      )}
                    </dd>
                  </div>
                ))}
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Advertising & general (verified)
                  </dt>
                  <dd className="break-all text-[15px] font-semibold">
                    <a
                      href={`mailto:${CONTACT.verifiedEmail}`}
                      className="text-brand-primary hover:underline"
                    >
                      {CONTACT.verifiedEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 font-headline text-xl font-bold text-text">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
