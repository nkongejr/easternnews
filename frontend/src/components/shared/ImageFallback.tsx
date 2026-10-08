/**
 * Branded placeholder for stories with no usable photograph.
 *
 * Deliberately typographic rather than decorative: the paper's monogram on
 * a paper tint, so an empty slot still reads as part of the publication
 * instead of a broken image or unrelated stock art.
 */
export default function ImageFallback({
  alt = '',
  className = '',
}: {
  alt?: string;
  className?: string;
}) {
  const decorative = !alt;

  return (
    <span
      className={`en-imgfallback ${className}`}
      {...(decorative
        ? { 'aria-hidden': true as const }
        : { role: 'img' as const, 'aria-label': alt })}
    >
      <svg
        viewBox="0 0 160 100"
        className="relative h-[46%] w-auto max-w-[60%]"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="80"
          y="62"
          textAnchor="middle"
          fontFamily="'Playfair Display Variable', Georgia, Cambria, 'Times New Roman', serif"
          fontSize="58"
          fontWeight="700"
          letterSpacing="2"
          fill="#0a2e52"
          opacity="0.18"
        >
          EN
        </text>
        <line x1="58" y1="78" x2="102" y2="78" stroke="#45d8fe" strokeWidth="4" opacity="0.9" />
      </svg>
    </span>
  );
}
