'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { termsAPI, categoriesAPI } from '@/lib/api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTerms, setPopularTerms] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch popular terms and categories
    const fetchData = async () => {
      try {
        const [termsRes, categoriesRes] = await Promise.all([
          termsAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        setPopularTerms(termsRes.data.data?.slice(0, 6) || []);
        setCategories(categoriesRes.data?.slice(0, 4) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/terms?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full opacity-10"
              style={{
                background: `linear-gradient(45deg, var(--neon-cyan), var(--neon-magenta))`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-purple)] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              WhatIsDev<span className="neon-text text-[var(--neon-cyan)]">?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-[var(--foreground)] mb-12"
            >
              Votre Glossaire de Développement Web Participatif
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un terme..."
                  className="w-full px-6 py-4 pr-14 rounded-full glass text-[var(--foreground)] placeholder:text-gray-500 focus:outline-none focus:border-2 focus:border-[var(--neon-cyan)] focus:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all"
                >
                  <Search className="w-5 h-5 text-black" />
                </button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/terms">
                <Button variant="primary" size="lg" glow>
                  Explorer les Termes
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Rejoindre la Communauté
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StatsCard
              icon={<TrendingUp className="w-8 h-8" />}
              value="500+"
              label="Termes Définis"
              delay={0}
            />
            <StatsCard
              icon={<Users className="w-8 h-8" />}
              value="1000+"
              label="Contributeurs"
              delay={0.2}
            />
            <StatsCard
              icon={<Zap className="w-8 h-8" />}
              value="5000+"
              label="Définitions"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-12 text-[var(--neon-cyan)]"
            >
              Parcourir par Catégorie
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categories.map((category: any, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={`/terms?category_id=${category.id}`}>
                    <Card glow="cyan" className="text-center cursor-pointer">
                      <h3 className="text-xl font-semibold text-[var(--neon-magenta)] mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {category.terms_count || 0} termes
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Terms Section */}
      {popularTerms.length > 0 && (
        <section className="py-20 pb-32">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-12 text-[var(--neon-cyan)]"
            >
              Termes Populaires
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {popularTerms.map((term: any, index: number) => (
                <motion.div
                  key={term.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={`/terms/${term.slug}`}>
                    <Card glow="purple" className="cursor-pointer">
                      <h3 className="text-xl font-semibold text-[var(--neon-cyan)] mb-2">
                        {term.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {term.description_short}
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StatsCard({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card glow="magenta" className="text-center">
        <div className="text-[var(--neon-magenta)] mb-4 flex justify-center">
          {icon}
        </div>
        <div className="text-4xl font-bold text-[var(--neon-cyan)] mb-2">
          {value}
        </div>
        <div className="text-gray-400">{label}</div>
      </Card>
    </motion.div>
  );
}
