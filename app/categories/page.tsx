'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { categoriesAPI } from '@/lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-xl text-gray-400">
            Browse web development terms organized by category
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any, index: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link href={`/terms?category_id=${category.id}`}>
                <Card glow="cyan" className="h-full cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta p-[2px]">
                      <div className="w-full h-full rounded-lg glass flex items-center justify-center">
                        <Folder className="w-6 h-6 text-neon-cyan" />
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neon-cyan group-hover:translate-x-1 transition-transform" />
                  </div>

                  <h3 className="text-2xl font-semibold text-neon-magenta mb-3 group-hover:text-neon-cyan transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                    <span className="text-sm text-gray-500">
                      {category.terms_count || 0} terms
                    </span>
                    <span className="text-xs text-neon-purple">
                      View all →
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* No Categories */}
        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <div className="text-center py-20">
                <Folder className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                  No categories available
                </h3>
                <p className="text-gray-500">
                  Categories will appear here once they are added by administrators
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
