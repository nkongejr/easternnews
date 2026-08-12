import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-headline text-xl mb-3">
            <span className="text-white">EASTERN</span> <span className="text-brand-gold">NEWSPAPER</span>
          </h3>
          <p>Be in the Know — covering Meru, Embu, Tharaka Nithi, Isiolo, Samburu, Marsabit, Laikipia, Machakos, Kitui, Makueni and Kirinyaga counties.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:text-brand-gold">About Us</Link></li>
            <li><Link href="/advertise" className="hover:text-brand-gold">Advertise With Us</Link></li>
            <li><Link href="/archive" className="hover:text-brand-gold">Back Issues</Link></li>
            <li><Link href="/contact" className="hover:text-brand-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <p>Mashariki Communications Centre, Meru-Maua Road</p>
          <p>P.O Box 2736-60200, Meru</p>
          <p>Tel: 0712 992269 / 0722 599651</p>
          <p>info@easternnewspaper.co.ke</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-xs text-gray-400 text-center py-4 px-4">
        The Eastern Newspaper is published monthly by The Mashariki Newspaper Ltd. Mashariki
        Communications Centre, Meru-Maua Road, P.O Box 2736-60200, Meru. Tel 0712 992269 /
        0722 599651 | www.easternnewspaper.co.ke | info@easternnewspaper.co.ke |
        themasharikinewspaper@gmail.com | Registered as a Newspaper at the GPO.
      </div>
    </footer>
  );
}