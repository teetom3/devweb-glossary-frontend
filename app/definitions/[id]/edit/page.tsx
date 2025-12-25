'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Link as LinkIcon, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CodeEditor from '@/components/ui/CodeEditor';
import { definitionsAPI } from '@/lib/api';

export default function EditDefinitionPage() {
  const router = useRouter();
  const params = useParams();
  const definitionId = params.id as string;

  const [definition, setDefinition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    title: '',
    explanation: '',
    code_example: '',
    demo_url: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDefinition();
  }, [definitionId]);

  const fetchDefinition = async () => {
    try {
      // Get all user's definitions
      const response = await definitionsAPI.getMyDefinitions();
      const myDefinitions = response.data.data || [];

      // Find the specific definition by ID
      const def = myDefinitions.find((d: any) => d.id === Number(definitionId));

      if (!def) {
        setErrors({ general: 'Définition introuvable ou vous n\'avez pas la permission de la modifier.' });
        setFetchingData(false);
        return;
      }

      setDefinition(def);

      // Pre-populate form with existing data
      setFormData({
        title: def.title || '',
        explanation: def.explanation || '',
        code_example: def.code_example || '',
        demo_url: def.demo_url || '',
      });
    } catch (error: any) {
      console.error('Error fetching definition:', error);
      setErrors({ general: 'Erreur lors du chargement de la définition.' });
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await definitionsAPI.update(Number(definitionId), {
        title: formData.title || undefined,
        explanation: formData.explanation,
        code_example: formData.code_example || undefined,
        demo_url: formData.demo_url || undefined,
      });

      // Redirect to term page or my definitions
      if (definition?.term) {
        router.push(`/terms/${definition.term.slug}`);
      } else {
        router.push('/my-definitions');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-cyan text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!definition) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-xl mb-4">Définition introuvable</div>
          <Button variant="primary" onClick={() => router.push('/my-definitions')}>
            Retour à Mes Définitions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
            Modifier la Définition
          </h1>
          {definition.term && (
            <p className="text-xl text-gray-400">
              Pour le terme: <span className="text-neon-cyan">{definition.term.title}</span>
            </p>
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glow="purple">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-4 rounded-lg bg-neon-pink/10 border border-neon-pink text-neon-pink">
                  {errors.general}
                </div>
              )}

              {/* Title (Optional) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-neon-cyan" />
                  <label className="text-sm font-medium text-neon-cyan">
                    Titre (Optionnel)
                  </label>
                </div>
                <Input
                  type="text"
                  placeholder="Un titre accrocheur pour votre définition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title?.[0]}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Laissez vide pour utiliser le titre du terme
                </p>
              </div>

              {/* Explanation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-neon-cyan" />
                  <label className="text-sm font-medium text-neon-cyan">
                    Explication *
                  </label>
                </div>
                <textarea
                  placeholder="Expliquez le concept en détail..."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={8}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background-secondary border-2 border-glass-border text-foreground placeholder:text-gray-500 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300"
                />
                {errors.explanation && (
                  <p className="mt-1 text-sm text-neon-pink">{errors.explanation[0]}</p>
                )}
              </div>

              {/* Code Example (Optional) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-neon-cyan" />
                  <label className="text-sm font-medium text-neon-cyan">
                    Exemple de Code (Optionnel)
                  </label>
                </div>
                <CodeEditor
                  value={formData.code_example}
                  onChange={(value) => setFormData({ ...formData, code_example: value })}
                  placeholder="// Ajoutez un exemple de code pour illustrer le concept\nconst exemple = 'comme ceci';"
                  rows={10}
                  error={errors.code_example?.[0]}
                />
              </div>

              {/* Demo URL (Optional) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-5 h-5 text-neon-cyan" />
                  <label className="text-sm font-medium text-neon-cyan">
                    URL de Démo (Optionnel)
                  </label>
                </div>
                <Input
                  type="url"
                  placeholder="https://exemple.com/demo"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  error={errors.demo_url?.[0]}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lien vers une démo en direct ou de la documentation
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                  glow
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
