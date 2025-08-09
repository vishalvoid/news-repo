export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name: string;
  };
  author?: string;
  category?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export type NewsCategory = 
  | 'general'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology'
  | 'world'
  | 'politics';

export const NEWS_CATEGORIES: Record<NewsCategory, string> = {
  general: 'General',
  business: 'Business',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
  sports: 'Sports',
  technology: 'Technology',
  world: 'World',
  politics: 'Politics',
};

export interface SearchParams {
  q?: string;
  category?: NewsCategory;
  country?: string;
  page?: number;
  pageSize?: number;
}