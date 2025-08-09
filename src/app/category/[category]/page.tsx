import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { NewsService } from '@/lib/newsService';
import NewsGrid from '@/components/news/NewsGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { NEWS_CATEGORIES, NewsCategory } from '@/types/news';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  return Object.keys(NEWS_CATEGORIES).map((category) => ({
    category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Validate category
  if (!Object.keys(NEWS_CATEGORIES).includes(category)) {
    notFound();
  }

  const categoryName = NEWS_CATEGORIES[category as NewsCategory];
  const news = await NewsService.getNewsByCategory(category as NewsCategory);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {categoryName} News
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Latest updates and breaking news in {categoryName.toLowerCase()}
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton count={12} />}>
        <NewsGrid articles={news.articles} />
      </Suspense>

      {/* Pagination placeholder - can be implemented later */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Showing latest {news.articles.length} articles
        </p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = NEWS_CATEGORIES[category as NewsCategory];
  
  if (!categoryName) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryName} News - NewsHub`,
    description: `Stay updated with the latest ${categoryName.toLowerCase()} news from trusted sources worldwide.`,
    openGraph: {
      title: `${categoryName} News - NewsHub`,
      description: `Stay updated with the latest ${categoryName.toLowerCase()} news from trusted sources worldwide.`,
    },
  };
}