'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: NewsArticle;
  index?: number;
  featured?: boolean;
}

export default function ArticleCard({ article, index = 0, featured = false }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link href={`/article/${encodeURIComponent(article.id)}`} className="block">
        <div className={`relative ${featured ? 'h-64 md:h-80' : 'h-48'} bg-gray-200 dark:bg-gray-700`}>
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Category Badge */}
          {article.category && (
            <div className="absolute top-4 left-4">
              <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium text-blue-600 dark:text-blue-400">{article.source.name}</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          
          <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h2>
          
          <p className={`text-gray-600 dark:text-gray-300 mb-4 ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}>
            {article.description}
          </p>
          
          <div className="flex items-center justify-between">
            {article.author && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                By {article.author}
              </span>
            )}
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <span>Read more</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}