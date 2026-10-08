import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="en-container py-24 text-center">
      <p className="en-kicker text-brand-primary">404</p>
      <h1 className="mt-3 font-headline text-4xl font-black text-headline md:text-5xl">
        Story not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        That page isn’t in this edition. Try the latest news, or search the archive.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="en-btn inline-flex h-11 items-center bg-brand-navy px-5 text-[12px] text-white transition-colors hover:bg-brand-primary"
        >
          Home
        </Link>
        <Link
          href="/latest"
          className="en-btn inline-flex h-11 items-center border border-border-strong px-5 text-[12px] text-brand-navy transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Latest news
        </Link>
        <Link
          href="/search"
          className="en-btn inline-flex h-11 items-center border border-border-strong px-5 text-[12px] text-brand-navy transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
