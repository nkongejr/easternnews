'use client';

import { useEffect, useState } from 'react';
import { formatToday } from '@/lib/format';

/**
 * The live dateline ("Saturday, 19 September 2026").
 *
 * Server render keeps the HTML deterministic and instantly visible; after
 * hydration the client takes over and re-checks every minute, so the date
 * stays current even on statically cached pages and rolls over at midnight
 * without a rebuild or reload.
 *
 * `suppressHydrationWarning` covers the legitimate mismatch when the server
 * HTML was rendered on a previous day.
 */
export default function TodayDate({ className }: { className?: string }) {
  const [today, setToday] = useState(() => formatToday());

  useEffect(() => {
    const update = () => setToday(formatToday());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {today}
    </span>
  );
}
