export interface ImageBlock {
  url: string;
  caption?: string;
  credit?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  photo?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  colorAccent: string;
  type: 'county' | 'section';
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  deck?: string;
  body?: string; // optional — related/partial article queries may omit this
  category: string;
  /** Primary author retained for legacy API clients. */
  author?: Author | null;
  /** Ordered list used for public multi-author bylines. */
  authors?: Author[];
  bylineCredit?: string;
  featuredImage: ImageBlock;
  gallery?: ImageBlock[];
  publishDate?: string;
  /** Set by Mongoose timestamps; shown as "Updated …" when meaningfully later. */
  updatedAt?: string;
  issue?: { _id: string; issueNumber: number; title: string } | string;
  isFeatured?: boolean;
  isHero?: boolean;
  isBreaking?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags?: string[];
  relatedArticles?: Article[];
  status?: 'draft' | 'published';
  viewCount?: number;
  commentCount?: number;
  createdAt?: string;
}

export interface PaginatedArticles {
  data: Article[];
  page: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Where an advert runs. `article-inline` sits inside the story body and
 * `article-overlay` floats over the article while the reader scrolls.
 */
export type AdPlacement =
  | 'sidebar'
  | 'banner'
  | 'sponsored-post'
  | 'article-inline'
  | 'article-overlay';

export interface Advertiser {
  _id: string;
  businessName: string;
  slug: string;
  category: 'Hotel' | 'TVET/College' | 'University' | 'Security Services' | 'Other';
  logo?: string;
  description?: string;
  contact: { phone?: string; email?: string; address?: string };
  adPlacement: AdPlacement;
  linkURL?: string;
  isActive: boolean;
}

/** A reader comment. `email` is only ever returned to the newsroom. */
export interface Comment {
  _id: string;
  name: string;
  body: string;
  createdAt: string;
  status?: 'approved' | 'pending' | 'rejected';
  /** Newsroom moderation list only. */
  email?: string;
  /** Populated in the moderation list, an id elsewhere. */
  article?: { _id: string; title: string; slug: string } | string;
}

export interface PaginatedComments {
  data: Comment[];
  page: number;
  totalPages: number;
  totalResults: number;
}

/** Response from POST /api/articles/:id/comments. */
export interface CommentPostResult {
  comment: Comment;
  commentCount: number;
  pending: boolean;
  message: string;
}

export interface Issue {
  _id: string;
  issueNumber: number;
  title: string;
  month: string;
  year: number;
  coverImage?: string;
  coverHeadline?: string;
  /** Expanded on /issues/current; the /issues listing returns ObjectId strings. */
  articles: Article[];
  /** Public download link for the print edition, set from the admin dashboard. */
  pdfUrl?: string;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}