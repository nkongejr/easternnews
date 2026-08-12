export default function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);

  return (
    <div className="prose-article max-w-none">
      {blocks.map((block, i) => {
        if (block.trim().startsWith('>')) {
          return (
            <blockquote key={i} className="pull-quote">
              {block.replace(/^>\s?/, '')}
            </blockquote>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}