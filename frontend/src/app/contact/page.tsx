import PageHeader from '@/components/shared/PageHeader';
import { SITE } from '@/lib/constants';
import ContactForm from './ContactForm';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact Us"
        description="Newsroom tips, advertising enquiries and letters to the editor."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      <div className="en-container py-8 md:py-10">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="border-t-2 border-brand-gold bg-surface-alt p-5">
              <h2 className="en-kicker mb-3 text-brand-blue">Newsroom</h2>
              <address className="space-y-2 text-sm not-italic leading-relaxed text-muted">
                <p>
                  {SITE.address}
                  <br />
                  {SITE.postal}
                </p>
                <p>
                  Tel:{' '}
                  <a href={SITE.phoneHref} className="font-semibold text-ink hover:text-brand-blue">
                    {SITE.phoneLabel}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${SITE.email}`} className="break-all hover:text-brand-blue">
                    {SITE.email}
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-headline text-xl font-bold text-ink">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
