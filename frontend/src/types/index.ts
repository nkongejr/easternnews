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
  author?: Author;
  bylineCredit?: string;
  featuredImage: ImageBlock;
  gallery?: ImageBlock[];
  publishDate?: string;
  issue?: { _id: string; issueNumber: number; title: string } | string;
  isFeatured?: boolean;
  isHero?: boolean;
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

export interface Advertiser {
  _id: string;
  businessName: string;
  slug: string;
  category: 'Hotel' | 'TVET/College' | 'University' | 'Security Services' | 'Other';
  logo?: string;
  description?: string;
  contact: { phone?: string; email?: string; address?: string };
  adPlacement: 'sidebar' | 'banner' | 'sponsored-post';
  linkURL?: string;
  isActive: boolean;
}

export interface Issue {
  _id: string;
  issueNumber: number;
  title: string;
  month: string;
  year: number;
  coverImage?: string;
  coverHeadline?: string;
  articles: Article[];
  pdfUrl?: string;
  isCurrent: boolean;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}