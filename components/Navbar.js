'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  // Check auth state and fetch settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Fetch settings for logo
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {settings?.logo?.url ? (
            <img
              src={settings.logo.url}
              alt={settings.logo.alt || 'RKB-AMB Logo'}
              width={settings.logo.width || 150}
              height={settings.logo.height || 50}
              className="object-contain"
              style={{ maxHeight: '60px' }}
            />
          ) : (
            <span className={styles.logoText}>
              RKB-AMB
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link href="/" className={styles.navLink}>
            Beranda
          </Link>
          <Link href="/history" className={styles.navLink}>
            Sejarah
          </Link>
          <Link href="/reunions" className={styles.navLink}>
            Reoni
          </Link>
          <Link href="/family-tree" className={styles.navLink}>
            Silsilah
          </Link>
          <Link href="/organization" className={styles.navLink}>
            Organisasi
          </Link>
          <Link href="/gallery" className={styles.navLink}>
            Galeri
          </Link>
          <Link href="/contact" className={styles.navLink}>
            Kontak
          </Link>

          {user ? (
            <Link
              href={user.role === 'admin' ? '/admin' : '/profile'}
              className={styles.btnPrimary}
            >
              {user.role === 'admin' ? 'Dashboard' : 'Profil Saya'}
            </Link>
          ) : (
            <Link href="/login" className={styles.btnOutline}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContainer}>
            <Link
              href="/"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/history"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Sejarah
            </Link>
            <Link
              href="/reunions"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Reoni
            </Link>
            <Link
              href="/family-tree"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Silsilah
            </Link>
            <Link
              href="/organization"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Organisasi
            </Link>
            <Link
              href="/gallery"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Galeri
            </Link>
            <Link
              href="/contact"
              className={styles.navLink}
              onClick={() => setIsOpen(false)}
            >
              Kontak
            </Link>
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/profile'}
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                {user.role === 'admin' ? 'Dashboard Admin' : 'Profil Saya'}
              </Link>
            ) : (
              <Link
                href="/login"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
