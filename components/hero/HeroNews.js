'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import styles from '@/app/page.module.css';

export default function HeroNews({ settings, posts = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (posts.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [posts]);

    if (!posts || posts.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <p>Belum ada berita terkini.</p>
            </div>
        );
    }

    const currentPost = posts[currentIndex];

    return (
        <section className={styles.hero}>
            {/* Background - Uses current post image */}
            <div className={styles.heroBackground}>
                {posts.map((post, index) => (
                    <div
                        key={post.id}
                        className={styles.backgroundImage}
                        style={{
                            backgroundImage: `url(${post.featuredImage || '/hero-bg.jpg'})`,
                            opacity: index === currentIndex ? 1 : 0,
                            zIndex: index === currentIndex ? 1 : 0
                        }}
                    >
                        {/* Extra blur/darken for readability */}
                        <div className={styles.overlay}></div>
                    </div>
                ))}
            </div>

            <div className={styles.patternOverlay}></div>

            <div className={styles.heroContent} style={{ position: 'relative', zIndex: 20 }}>
                {/* Badge */}
                <div className={styles.newsBadge}>
                    <span className={styles.badgeDot}></span>
                    Berita Terkini
                </div>

                <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                    <h1 className={styles.heroTitle}>
                        {currentPost.title}
                    </h1>

                    <p className={styles.heroSubtitle}>
                        {currentPost.excerpt}
                    </p>

                    <div className={styles.metaContainer}>
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {currentPost.publishedAt ? format(new Date(currentPost.publishedAt), 'dd MMM yyyy') : ''}
                        </span>
                        <span className={styles.metaItem}>
                            <User size={16} />
                            {currentPost.author || 'Admin'}
                        </span>
                    </div>

                    <div className={styles.heroButtons}>
                        <Link href={`/blog/${currentPost.slug}`} className={styles.btnSecondary}>
                            Baca Selengkapnya <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                </div>

                {/* Indicators */}
                <div className={styles.indicators}>
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`${styles.indicatorBar} ${idx === currentIndex ? styles.indicatorBarActive : styles.indicatorBarInactive}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
