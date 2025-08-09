'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  count?: number;
  featured?: boolean;
}

export default function LoadingSkeleton({ count = 6, featured = false }: LoadingSkeletonProps) {
  return (
    <div className={`grid gap-6 ${
      featured 
        ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${
            featured && index === 0 ? 'md:col-span-2 md:row-span-2' : ''
          }`}
        >
          {/* Image Skeleton */}
          <div className={`bg-gray-300 dark:bg-gray-600 animate-pulse ${
            featured && index === 0 ? 'h-64 md:h-80' : 'h-48'
          }`} />
          
          <div className="p-4 md:p-6">
            {/* Source and Time Skeleton */}
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16" />
            </div>
            
            {/* Title Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full" />
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4" />
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-5/6" />
              {featured && index === 0 && (
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-2/3" />
              )}
            </div>
            
            {/* Author and Read More Skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-24" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}