import { Suspense } from 'react';
import { NewsService } from '@/lib/newsService';
import NewsGrid from '@/components/news/NewsGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { NewsResponse } from '@/types/news';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = '' } = await searchParams;

  let searchResults: NewsResponse = { articles: [], totalResults: 0, status: 'ok' };
  
  if (query.trim()) {
    searchResults = await NewsService.searchNews({ q: query });
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Search Results
        </h1>
        {query ? (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Results for &quot;<span className="font-semibold">{query}</span>&quot; 
            <span className="text-sm ml-2">({searchResults.totalResults} articles found)</span>
          </p>
        ) : (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Enter a search term to find news articles
          </p>
        )}
      </div>

      {query.trim() ? (
        <Suspense fallback={<LoadingSkeleton count={8} />}>
          {searchResults.articles.length > 0 ? (
            <NewsGrid articles={searchResults.articles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No articles found for &quot;{query}&quot;. Try different keywords.
              </p>
            </div>
          )}
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Use the search bar above to find news articles
          </p>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q: query = '' } = await searchParams;
  
  return {
    title: query ? `Search: ${query} - NewsHub` : 'Search - NewsHub',
    description: query 
      ? `Search results for "${query}" on NewsHub` 
      : 'Search for news articles on NewsHub',
  };
}