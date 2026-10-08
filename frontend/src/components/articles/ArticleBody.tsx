import { Fragment, type ReactNode } from 'react';

/**
 * Renders the plain-text article body produced by the CMS.
 * Blocks are separated by blank lines; a line starting with ">" is a pull-quote.
 *
 * `inlineAd` is slotted in between paragraphs — after the `inlineAfter`-th one
 * (or after the last paragraph in a short story), never before the opening
 * paragraph, so the lede always reads uninterrupted.
 */
export default function ArticleBody({
  body,
  inlineAd,
  inlineAfter = 3,
}: {
  body: string;
  inlineAd?: ReactNode;
  inlineAfter?: number;
}) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const adAfter = inlineAd ? Math.min(inlineAfter, blocks.length) - 1 : -1;

  const renderBlock = (block: string, i: number) => {
    if (block.startsWith('>')) {
      return (
        <blockquote key={i} className="pull-quote">
          {block.replace(/^>\s?/, '')}
        </blockquote>
      );
    }
    return <p key={i}>{block}</p>;
  };

  return (
    <div className="prose-article">
      {blocks.map((block, i) => (
        <Fragment key={i}>
          {renderBlock(block, i)}
          {i === adAfter && inlineAd}
        </Fragment>
      ))}
    </div>
  );
}
