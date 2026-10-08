import type { AdPlacement } from '@/types';

/**
 * Advert placements, in the order the newsroom sees them in the CMS. The hint
 * tells the person filling the form exactly where the advert will run — the two
 * article placements are the ones that sit over / inside a story being read.
 */
export const AD_PLACEMENTS: { value: AdPlacement; label: string; hint: string }[] = [
  {
    value: 'sidebar',
    label: 'Sidebar rail',
    hint: 'Module in the right-hand rail, on every page.',
  },
  {
    value: 'banner',
    label: 'Homepage banner',
    hint: 'Full-width strip below the homepage headlines.',
  },
  {
    value: 'sponsored-post',
    label: 'Sponsored post card',
    hint: 'Clearly-labelled card inside editorial grids.',
  },
  {
    value: 'article-inline',
    label: 'Inside the article',
    hint: 'Boxed advert in the middle of a story body.',
  },
  {
    value: 'article-overlay',
    label: 'Over the article (floating)',
    hint: 'Dismissible bar that closes over the story while a reader scrolls.',
  },
];

export function adPlacementLabel(value?: string): string {
  return AD_PLACEMENTS.find((placement) => placement.value === value)?.label || value || '';
}
