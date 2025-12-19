'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { termsAPI, categoriesAPI } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function TermsPage() {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [searchQuery, selectedCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_id = selectedCategory;

      const response = await termsAPI.getAll(params);
      setTerms(response.data.data || []);
      setPagination(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTerms();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
            Parcourir les Termes
          </h1>
          <p className="text-xl text-gray-400">
            Explorez notre glossaire complet de développement web
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan" />
                    <Input
                      type="text"
                      placeholder="Rechercher des termes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-background-secondary border-2 border-glass-border text-foreground focus:outline-none focus:border-neon-cyan transition-all"
                  >
                    <option value="">Toutes les Catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" variant="primary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Terms Grid */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-gray-400">Chargement des termes...</p>
          </div>
        ) : terms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">Aucun terme trouvé</p>
            <p className="text-gray-500 mt-2">Essayez d'ajuster votre recherche ou vos filtres</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {terms.map((term: any, index: number) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link href={`/terms/${term.slug}`}>
                  <Card glow="purple" className="h-full cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-semibold text-neon-cyan group-hover:text-neon-magenta transition-colors">
                        {term.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-neon-cyan group-hover:translate-x-1 transition-transform" />
                    </div>

                    {term.category && (
                      <div className="inline-block px-3 py-1 rounded-full glass text-xs text-neon-purple mb-3">
                        {term.category.name}
                      </div>
                    )}

                    <p className="text-gray-400 line-clamp-3 mb-4">
                      {term.description_short}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Par {term.creator?.name || 'Admin'}</span>
                      <span>{new Date(term.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center gap-2"
          >
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
