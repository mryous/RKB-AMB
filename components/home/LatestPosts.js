import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { blogService } from '@/lib/blogService';
import styles from './LatestPosts.module.css';

export default async function LatestPosts() {
    const posts = await blogService.getAllPosts();
    const latestPosts = posts
        .filter(p => p.status === 'published')
        .slice(0, 3);

    if (latestPosts.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2 className={styles.title}>
                            Kabar Keluarga
                        </h2>
                        <p className={styles.subtitle}>
                            Berita terbaru, artikel sejarah, dan dokumentasi kegiatan keluarga besar RKB-AMB.
                        </p>
                    </div>
                    <Link href="/blog" className={styles.viewAllLink}>
                        Lihat Semua Artikel <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Posts Grid */}
                <div className={styles.postsGrid}>
                    {latestPosts.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className={styles.postCard}>
                            {/* Image */}
                            <div className={styles.imageWrapper}>
                                {post.featuredImage ? (
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className={styles.image}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className={styles.noImage}>
                                        No Image
                                    </div>
                                )}
                                {post.categories?.[0] && (
                                    <span className={styles.categoryBadge}>
                                        {post.categories[0]}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className={styles.content}>
                                <div className={styles.meta}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} />
                                        {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM yyyy') : 'Draft'}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <User size={14} />
                                        Admin
                                    </span>
                                </div>

                                <h3 className={styles.postTitle}>
                                    {post.title}
                                </h3>

                                <p className={styles.excerpt}>
                                    {post.excerpt}
                                </p>

                                <span className={styles.readMore}>
                                    Baca Selengkapnya <ArrowRight size={16} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className={styles.mobileViewAll}>
                    <Link href="/blog" className={styles.viewAllBtn}>
                        Lihat Semua Artikel <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
