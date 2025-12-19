'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Award, Calendar, BookOpen, Trophy } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authAPI, definitionsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, defsRes] = await Promise.all([
        authAPI.getUser(),
        definitionsAPI.getMyDefinitions()
      ]);
      setUser(userRes.data);
      setDefinitions(defsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
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

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card glow="cyan" className="relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta p-1">
                  <div className="w-full h-full rounded-full glass flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-neon-cyan" />
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.bio && (
                    <p className="text-gray-300 max-w-2xl">{user.bio}</p>
                  )}
                  {user.role === 'admin' && (
                    <div className="mt-4">
                      <span className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 border border-neon-purple text-neon-purple text-sm">
                        Administrator
                      </span>
                    </div>
                  )}
                </div>

                {/* Reputation Badge */}
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-magenta to-neon-purple p-1">
                    <div className="w-full h-full rounded-full glass flex flex-col items-center justify-center">
                      <Trophy className="w-8 h-8 text-neon-magenta mb-2" />
                      <div className="text-3xl font-bold text-neon-cyan">{user.reputation || 0}</div>
                      <div className="text-xs text-gray-400">Reputation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card glow="magenta" className="text-center">
            <BookOpen className="w-8 h-8 text-neon-magenta mx-auto mb-3" />
            <div className="text-3xl font-bold text-neon-cyan mb-1">
              {definitions.length}
            </div>
            <div className="text-gray-400">Definitions</div>
          </Card>

          <Card glow="purple" className="text-center">
            <Award className="w-8 h-8 text-neon-purple mx-auto mb-3" />
            <div className="text-3xl font-bold text-neon-cyan mb-1">
              {definitions.filter((d: any) => d.is_approved).length}
            </div>
            <div className="text-gray-400">Approved</div>
          </Card>

          <Card glow="cyan" className="text-center">
            <Calendar className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
            <div className="text-3xl font-bold text-neon-cyan mb-1">
              {new Date(user.created_at).getFullYear()}
            </div>
            <div className="text-gray-400">Member Since</div>
          </Card>
        </motion.div>

        {/* My Definitions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-neon-cyan">My Definitions</h2>
            <Link href="/my-definitions">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>

          {definitions.length > 0 ? (
            <div className="space-y-4">
              {definitions.slice(0, 5).map((def: any, index: number) => (
                <motion.div
                  key={def.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-neon-magenta">
                            {def.title || def.term?.title}
                          </h3>
                          {def.is_approved ? (
                            <span className="inline-block px-2 py-1 rounded-full bg-neon-green/20 border border-neon-green text-neon-green text-xs">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-500 text-xs">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 line-clamp-2 mb-3">
                          {def.explanation}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Score: {def.score || 0}</span>
                          <span>•</span>
                          <span>{new Date(def.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-400 mb-4">
                  You haven't created any definitions yet
                </p>
                <Link href="/terms">
                  <Button variant="primary" glow>
                    Browse Terms
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
