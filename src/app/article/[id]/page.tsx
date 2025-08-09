import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, ArrowLeft, Share2 } from 'lucide-react';
import { NewsService } from '@/lib/newsService';
import NewsGrid from '@/components/news/NewsGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { formatDistanceToNow } from 'date-fns';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getArticleById(id: string) {
  // For now, we'll get mock data and find the article by ID
  const news = await NewsService.getTopHeadlines();
  const article = news.articles.find(a => a.id === id);
  
  if (!article) {
    return null;
  }
  
  return article;
}

async function getRelatedArticles(excludeId: string) {
  const news = await NewsService.getTopHeadlines();
  return news.articles
    .filter(article => article.id !== excludeId)
    .slice(0, 3);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  
  const article = await getArticleById(decodedId);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id);
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80';

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {article.category && (
            <Link 
              href={`/category/${article.category}`}
              className="inline-block px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Link>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="font-medium text-blue-600 dark:text-blue-400">{article.source.name}</span>
            </div>
            {article.author && (
              <div>
                <span>By {article.author}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Share Button */}
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-8">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {article.description}
          </p>
          
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\[.*?\]/g, '') }} />
            ) : (
              <div>
                <p>This is a sample article content that would normally contain the full text from the news source.</p>
                <p>The article would include detailed reporting, quotes from sources, background information, and comprehensive coverage of the topic.</p>
                <p>In a production environment, this content would be fetched from the news API or content management system.</p>
              </div>
            )}
          </div>

          {/* External Link */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Read the full article on the original source:
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Visit {article.source.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
            <Suspense fallback={<LoadingSkeleton count={3} />}>
              <NewsGrid 
                articles={relatedArticles}
                title="Related Articles"
              />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const article = await getArticleById(decodedId);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - NewsHub`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.urlToImage ? [article.urlToImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.urlToImage ? [article.urlToImage] : [],
    },
  };
}