'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, User, LogOut, Menu, X, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check if user is authenticated and is admin
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-[0_0_30px_rgba(0,255,255,0.1)]' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent"
            >
              WhatIsDev<span className="neon-text text-[var(--neon-cyan)]">?</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/terms">Termes</NavLink>
            <NavLink href="/categories">Catégories</NavLink>
            {isAuthenticated && (
              <>
                <NavLink href="/my-definitions">Mes Définitions</NavLink>
                {isAdmin && (
                  <NavLink href="/admin/pending-definitions">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </NavLink>
                )}
                <NavLink href="/profile">
                  <User className="w-4 h-4" />
                </NavLink>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" glow>Inscription</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--neon-cyan)]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-[var(--glass-border)]"
        >
          <div className="px-4 py-4 space-y-3">
            <MobileNavLink href="/terms" onClick={() => setMobileMenuOpen(false)}>
              Termes
            </MobileNavLink>
            <MobileNavLink href="/categories" onClick={() => setMobileMenuOpen(false)}>
              Catégories
            </MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/my-definitions" onClick={() => setMobileMenuOpen(false)}>
                  Mes Définitions
                </MobileNavLink>
                {isAdmin && (
                  <MobileNavLink href="/admin/pending-definitions" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Administration
                    </div>
                  </MobileNavLink>
                )}
                <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profil
                </MobileNavLink>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="w-full">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Connexion</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-200 flex items-center space-x-1"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-[var(--foreground)] hover:text-[var(--neon-cyan)] transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
