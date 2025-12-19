'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Eye, Code, ExternalLink, User as UserIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { termsAPI, votesAPI } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TermDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<{ [key: number]: number }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    fetchTerm();
  }, [slug]);

  const fetchTerm = async () => {
    try {
      const response = await termsAPI.getBySlug(slug);
      setTerm(response.data);

      // Fetch user votes for all definitions
      if (localStorage.getItem('auth_token')) {
        response.data.approved_definitions?.forEach(async (def: any) => {
          try {
            const voteRes = await votesAPI.getUserVote(def.id);
            if (voteRes.data.vote) {
              setUserVotes((prev) => ({ ...prev, [def.id]: voteRes.data.vote.value }));
            }
          } catch (error) {
            // User hasn't voted on this definition
          }
        });
      }
    } catch (error) {
      console.error('Error fetching term:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (definitionId: number, value: 1 | -1) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      await votesAPI.vote(definitionId, value);

      // Update local state
      setUserVotes((prev) => {
        const currentVote = prev[definitionId];
        if (currentVote === value) {
          // Remove vote
          const newVotes = { ...prev };
          delete newVotes[definitionId];
          return newVotes;
        } else {
          // Add or change vote
          return { ...prev, [definitionId]: value };
        }
      });

      // Refresh term data
      fetchTerm();
    } catch (error) {
      console.error('Error voting:', error);
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

  if (!term) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neon-pink mb-4">Terme introuvable</h1>
          <Link href="/terms">
            <Button variant="primary">Parcourir les Termes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Term Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card glow="cyan">
            <div className="mb-4">
              {term.category && (
                <span className="inline-block px-4 py-1 rounded-full glass text-sm text-neon-purple">
                  {term.category.name}
                </span>
              )}
            </div>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              {term.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6">
              {term.description_short}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>Créé par {term.creator?.name || 'Admin'}</span>
              </div>
              <span>•</span>
              <span>{new Date(term.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </Card>
        </motion.div>

        {/* Definitions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-neon-cyan">
              Définitions ({term.approved_definitions?.length || 0})
            </h2>
            {isAuthenticated && (
              <Link href={`/definitions/create?term_id=${term.id}`}>
                <Button variant="primary" size="sm" glow>
                  Ajouter une Définition
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-6">
            {term.approved_definitions && term.approved_definitions.length > 0 ? (
              term.approved_definitions.map((definition: any, index: number) => (
                <DefinitionCard
                  key={definition.id}
                  definition={definition}
                  userVote={userVotes[definition.id]}
                  onVote={handleVote}
                  index={index}
                />
              ))
            ) : (
              <Card>
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400 mb-4">
                    Aucune définition pour le moment. Soyez le premier à contribuer !
                  </p>
                  {isAuthenticated ? (
                    <Link href={`/definitions/create?term_id=${term.id}`}>
                      <Button variant="primary" glow>
                        Ajouter la Première Définition
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button variant="primary" glow>
                        Connectez-vous pour Ajouter une Définition
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DefinitionCard({
  definition,
  userVote,
  onVote,
  index,
}: {
  definition: any;
  userVote?: number;
  onVote: (id: number, value: 1 | -1) => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card glow="purple" className="overflow-hidden">
        <div className="flex gap-6">
          {/* Voting Column */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote(definition.id, 1)}
              className={`p-2 rounded-lg transition-all ${
                userVote === 1
                  ? 'text-neon-green bg-neon-green/20'
                  : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/10'
              }`}
            >
              <ThumbsUp className="w-6 h-6" />
            </motion.button>

            <span className="text-2xl font-bold text-neon-cyan">
              {definition.score || 0}
            </span>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onVote(definition.id, -1)}
              className={`p-2 rounded-lg transition-all ${
                userVote === -1
                  ? 'text-neon-pink bg-neon-pink/20'
                  : 'text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10'
              }`}
            >
              <ThumbsDown className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            {definition.title && (
              <h3 className="text-2xl font-semibold text-neon-magenta mb-4">
                {definition.title}
              </h3>
            )}

            <div className="prose prose-invert max-w-none mb-4">
              <p className="text-gray-300 whitespace-pre-wrap">
                {definition.explanation}
              </p>
            </div>

            {/* Code Example */}
            {definition.code_example && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-neon-cyan" />
                  <span className="text-base font-semibold text-neon-cyan">Exemple de Code</span>
                </div>
                <pre className="bg-[#0f0f1a] border-2 border-neon-cyan/30 p-6 rounded-lg overflow-x-auto shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                  <code className="text-sm text-gray-100 font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {definition.code_example}
                  </code>
                </pre>
              </div>
            )}

            {/* Demo URL */}
            {definition.demo_url && (
              <div className="mb-4">
                <a
                  href={definition.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-magenta transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Voir la Démo</span>
                </a>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-glass-border">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{definition.user?.name || 'Anonyme'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{definition.views_count || 0} vues</span>
              </div>
              <span>•</span>
              <span>{new Date(definition.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
