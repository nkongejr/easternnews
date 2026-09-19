import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="en-container py-24 text-center">
      <p className="en-kicker text-brand-primary">404</p>
      <h1 className="mt-3 font-headline text-3xl font-black text-text md:text-4xl">
        Story not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        That page isn’t in this edition. Try the latest news, or search the archive.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center bg-brand-primary px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-primary-dark"
        >
          Home
        </Link>
        <Link
          href="/latest"
          className="inline-flex h-11 items-center border border-border px-5 text-xs font-bold uppercase tracking-wider text-text hover:border-brand-primary hover:text-brand-primary"
        >
          Latest news
        </Link>
        <Link
          href="/search"
          className="inline-flex h-11 items-center border border-border px-5 text-xs font-bold uppercase tracking-wider text-text hover:border-brand-primary hover:text-brand-primary"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
