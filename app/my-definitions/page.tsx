'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Trash2, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { definitionsAPI } from '@/lib/api';
import Link from 'next/link';

export default function MyDefinitionsPage() {
  const router = useRouter();
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDefinitions();
  }, []);

  const fetchDefinitions = async () => {
    try {
      const response = await definitionsAPI.getMyDefinitions();
      setDefinitions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching definitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this definition?')) {
      return;
    }

    try {
      await definitionsAPI.delete(id);
      setDefinitions(definitions.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting definition:', error);
      alert('Failed to delete definition');
    }
  };

  const filteredDefinitions = definitions.filter(def => {
    if (filter === 'approved') return def.is_approved;
    if (filter === 'pending') return !def.is_approved;
    return true;
  });

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
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
            My Definitions
          </h1>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({definitions.length})
            </Button>
            <Button
              variant={filter === 'approved' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('approved')}
            >
              Approved ({definitions.filter(d => d.is_approved).length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending ({definitions.filter(d => !d.is_approved).length})
            </Button>
          </div>
        </motion.div>

        {/* Definitions List */}
        {filteredDefinitions.length > 0 ? (
          <div className="space-y-6">
            {filteredDefinitions.map((def: any, index: number) => (
              <motion.div
                key={def.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card glow="purple">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-semibold text-neon-cyan">
                              {def.title || def.term?.title}
                            </h3>
                            {def.is_approved ? (
                              <span className="inline-block px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green text-neon-green text-xs">
                                Approved
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-500 text-xs">
                                Pending Review
                              </span>
                            )}
                          </div>
                          {def.term && (
                            <Link
                              href={`/terms/${def.term.slug}`}
                              className="text-sm text-neon-magenta hover:text-neon-cyan transition-colors"
                            >
                              View term page →
                            </Link>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {def.explanation}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-neon-green" />
                          <span>{def.votes?.filter((v: any) => v.value === 1).length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-4 h-4 text-neon-pink" />
                          <span>{def.votes?.filter((v: any) => v.value === -1).length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{def.views_count || 0} views</span>
                        </div>
                        <span>•</span>
                        <span>Score: {def.score || 0}</span>
                        <span>•</span>
                        <span>{new Date(def.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      <Link href={`/definitions/${def.id}/edit`} className="flex-1 md:flex-none">
                        <Button variant="secondary" size="sm" className="w-full">
                          <Edit className="w-4 h-4 md:mr-0 mr-2" />
                          <span className="md:hidden">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(def.id)}
                        className="flex-1 md:flex-none"
                      >
                        <Trash2 className="w-4 h-4 md:mr-0 mr-2" />
                        <span className="md:hidden">Delete</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <div className="text-center py-16">
                <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                  {filter === 'all'
                    ? "No definitions yet"
                    : filter === 'approved'
                    ? "No approved definitions"
                    : "No pending definitions"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {filter === 'all'
                    ? "Start contributing to the community by adding your first definition!"
                    : `Switch to "${filter === 'approved' ? 'pending' : 'approved'}" to see other definitions`}
                </p>
                <Link href="/terms">
                  <Button variant="primary" glow>
                    Browse Terms
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
