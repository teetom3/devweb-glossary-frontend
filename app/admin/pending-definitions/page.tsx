'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, ThumbsUp, ThumbsDown, User, Calendar, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import { definitionsAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminPendingDefinitionsPage() {
  const router = useRouter();
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPendingDefinitions();
  }, []);

  const fetchPendingDefinitions = async () => {
    try {
      const response = await definitionsAPI.getPending();
      setDefinitions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending definitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      await definitionsAPI.approve(id);
      // Remove from list after approval
      setDefinitions(definitions.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error approving definition:', error);
      alert('Erreur lors de l\'approbation de la définition');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette définition ?')) {
      return;
    }

    setProcessingId(id);
    try {
      await definitionsAPI.delete(id);
      setDefinitions(definitions.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error rejecting definition:', error);
      alert('Erreur lors du rejet de la définition');
    } finally {
      setProcessingId(null);
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
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
            Modération des Définitions
          </h1>
          <p className="text-xl text-gray-400">
            {definitions.length} définition{definitions.length > 1 ? 's' : ''} en attente d'approbation
          </p>
        </motion.div>

        {/* Definitions List */}
        {definitions.length > 0 ? (
          <div className="space-y-6">
            {definitions.map((def: any, index: number) => (
              <motion.div
                key={def.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card glow="purple">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold text-neon-cyan">
                            {def.title || def.term?.title}
                          </h3>
                          <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-500 text-xs">
                            En Attente
                          </span>
                        </div>
                        {def.term && (
                          <Link
                            href={`/terms/${def.term.slug}`}
                            className="text-sm text-neon-magenta hover:text-neon-cyan transition-colors inline-flex items-center gap-1"
                          >
                            <BookOpen className="w-4 h-4" />
                            Voir la page du terme →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center gap-6 text-sm text-gray-400 pb-4 border-b border-glass-border">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neon-cyan" />
                        <span>Par: <span className="text-neon-cyan">{def.user?.username || 'Utilisateur'}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(def.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <h4 className="text-sm font-semibold text-neon-cyan mb-2">Explication</h4>
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {def.explanation}
                      </p>
                    </div>

                    {/* Code Example */}
                    {def.code_example && (
                      <div>
                        <h4 className="text-sm font-semibold text-neon-cyan mb-2">Exemple de Code</h4>
                        <CodeBlock code={def.code_example} showLineNumbers={true} />
                      </div>
                    )}

                    {/* Demo URL */}
                    {def.demo_url && (
                      <div>
                        <h4 className="text-sm font-semibold text-neon-cyan mb-2">URL de Démo</h4>
                        <a
                          href={def.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-magenta hover:text-neon-cyan transition-colors inline-flex items-center gap-1"
                        >
                          {def.demo_url}
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-400 pt-4 border-t border-glass-border">
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
                        <span>{def.views_count || 0} vues</span>
                      </div>
                      <span>•</span>
                      <span>Score: {def.score || 0}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(def.id)}
                        disabled={processingId === def.id}
                        glow
                        className="flex-1"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {processingId === def.id ? 'Traitement...' : 'Approuver'}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(def.id)}
                        disabled={processingId === def.id}
                        className="flex-1"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        {processingId === def.id ? 'Traitement...' : 'Rejeter'}
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
                <CheckCircle className="w-20 h-20 text-neon-green mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                  Aucune définition en attente
                </h3>
                <p className="text-gray-500 mb-6">
                  Toutes les définitions ont été modérées !
                </p>
                <Link href="/terms">
                  <Button variant="primary" glow>
                    Parcourir les Termes
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
