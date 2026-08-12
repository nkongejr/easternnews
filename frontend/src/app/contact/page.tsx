// src/app/contact/page.tsx
import ContactForm from './ContactForm';

export const metadata = { title: 'Contact Us' };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-headline text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Mashariki Communications Centre, Meru-Maua Road, P.O Box 2736-60200, Meru.<br />
        Tel 0712 992269 / 0722 599651
      </p>
      <ContactForm />
    </div>
  );
}