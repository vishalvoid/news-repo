'use client';

import { motion } from 'framer-motion';
import { NewsArticle } from '@/types/news';
import ArticleCard from './ArticleCard';

interface NewsGridProps {
  articles: NewsArticle[];
  title?: string;
  featured?: boolean;
}

export default function NewsGrid({ articles, title, featured = false }: NewsGridProps) {
  if (!articles.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="py-8">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8"
        >
          {title}
        </motion.h2>
      )}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-6 ${
          featured 
            ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
            featured={featured && index === 0}
          />
        ))}
      </motion.div>
    </div>
  );
}