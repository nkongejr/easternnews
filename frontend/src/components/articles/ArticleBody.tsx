/**
 * Renders the plain-text article body produced by the CMS.
 * Blocks are separated by blank lines; a line starting with ">" is a pull-quote.
 */
export default function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);

  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('>')) {
          return (
            <blockquote key={i} className="pull-quote">
              {trimmed.replace(/^>\s?/, '')}
            </blockquote>
          );
        }

        return <p key={i}>{trimmed}</p>;
      })}
    </div>
  );
}
