// src/app/about/page.tsx
export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 prose-article">
      <h1 className="font-headline text-3xl font-bold mb-6">About The Eastern Newspaper</h1>
      <p>
        The Eastern Newspaper is a regional monthly publication covering Meru, Embu, Tharaka Nithi,
        Isiolo, Samburu, Marsabit, Laikipia, Machakos, Kitui, Makueni and Kirinyaga counties. Published
        by The Mashariki Newspaper Ltd, our mission is to keep residents of the Eastern region informed
        on governance, development, business, sports and community affairs — "Be in the Know."
      </p>
    </div>
  );
}