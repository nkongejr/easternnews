'use client';

import { FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 my-6">
      <span className="text-sm font-semibold text-gray-600">Share:</span>
      <a href={`https://facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" className="bg-brand-blue text-white p-2 rounded-full hover:opacity-80">
        <FaFacebookF size={14} />
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" className="bg-black text-white p-2 rounded-full hover:opacity-80">
        <FaXTwitter size={14} />
      </a>
      <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" className="bg-green-600 text-white p-2 rounded-full hover:opacity-80">
        <FaWhatsapp size={14} />
      </a>
    </div>
  );
}