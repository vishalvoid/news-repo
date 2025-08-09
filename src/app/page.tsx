import { Suspense } from 'react';
import { NewsService } from '@/lib/newsService';
import NewsGrid from '@/components/news/NewsGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { NEWS_CATEGORIES } from '@/types/news';

export default async function Home() {
  const topHeadlines = await NewsService.getTopHeadlines();
  const technologyNews = await NewsService.getNewsByCategory('technology');
  const businessNews = await NewsService.getNewsByCategory('business');

  return (
    <div className="py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Stay Informed with <span className="text-blue-600 dark:text-blue-400">NewsHub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your trusted source for breaking news, in-depth analysis, and stories that matter most.
          </p>
        </div>
      </section>

      {/* Top Headlines */}
      <section className="mb-12">
        <Suspense fallback={<LoadingSkeleton featured count={6} />}>
          <NewsGrid 
            articles={topHeadlines.articles}
            title="Breaking News"
            featured
          />
        </Suspense>
      </section>

      {/* Category Sections */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Technology News */}
        <section>
          <Suspense fallback={<LoadingSkeleton count={3} />}>
            <NewsGrid 
              articles={technologyNews.articles.slice(0, 3)}
              title="Technology"
            />
          </Suspense>
        </section>

        {/* Business News */}
        <section>
          <Suspense fallback={<LoadingSkeleton count={3} />}>
            <NewsGrid 
              articles={businessNews.articles.slice(0, 3)}
              title="Business"
            />
          </Suspense>
        </section>
      </div>

      {/* Quick Category Links */}
      <section className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(NEWS_CATEGORIES).slice(1).map(([key, label]) => (
            <a
              key={key}
              href={`/category/${key}`}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 text-center group"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {label}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
