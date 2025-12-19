'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(formData);

      // Store token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home
      window.location.href = '/';
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Bon Retour
          </motion.h1>
          <motion.p
            className="text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Connectez-vous pour continuer sur WhatIsDev?
          </motion.p>
        </div>

        <Card glow="cyan">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-neon-pink/10 border border-neon-pink text-neon-pink text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan" />
                <Input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email?.[0]}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan" />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password?.[0]}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              glow
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Vous n'avez pas de compte ?{' '}
              <Link href="/register" className="text-neon-cyan hover:text-neon-magenta transition-colors">
                S'inscrire
              </Link>
            </div>
          </form>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link href="/" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors">
            ← Retour à l'Accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
