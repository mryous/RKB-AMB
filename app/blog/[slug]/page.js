import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, User, Tag, Share2, Clock } from 'lucide-react';
import { blogService } from '@/lib/blogService';
import SinglePostContent from '@/components/blog/SinglePostContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await blogService.getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.seoTitle || post.title} - RKB-AMB`,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function SinglePostPage({ params }) {
    const { slug } = await params;
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const posts = await blogService.getAllPosts();
    const recentPosts = posts.filter(p => p.status === 'published' && p.id !== post.id).slice(0, 3);

    // Mock categories
    const categories = [
        { name: 'Berita', slug: 'berita', count: 5 },
        { name: 'Sejarah', slug: 'sejarah', count: 3 },
        { name: 'Kegiatan', slug: 'kegiatan', count: 8 },
        { name: 'Tokoh', slug: 'tokoh', count: 2 },
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                {post.featuredImage && (
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className={styles.heroImage}
                    />
                )}
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <div className={styles.metaWrapper}>
                        {post.categories && post.categories[0] && (
                            <span className={styles.categoryBadge}>
                                {post.categories[0]}
                            </span>
                        )}
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMMM yyyy') : 'Draft'}
                        </span>
                        <span className={styles.metaItem}>
                            <Clock size={16} />
                            5 min read
                        </span>
                    </div>

                    <h1 className={styles.title}>
                        {post.title}
                    </h1>

                    <div className={styles.authorWrapper}>
                        <div className={styles.authorAvatar}>
                            A
                        </div>
                        <div className={styles.authorInfo}>
                            <p className={styles.authorName}>Admin RKB-AMB</p>
                            <p className={styles.authorRole}>Penulis</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.contentWrapper}>
                <div className={styles.grid}>
                    {/* Article Column */}
                    <div>
                        <article className={styles.articleCard}>
                            {/* Breadcrumb */}
                            <div className={styles.breadcrumb}>
                                <Link href="/" className={styles.breadcrumbLink}>Home</Link>
                                <span>/</span>
                                <Link href="/blog" className={styles.breadcrumbLink}>Blog</Link>
                                <span>/</span>
                                <span className={styles.currentCrumb}>{post.title}</span>
                            </div>

                            {/* Featured Image In-Article */}
                            {post.featuredImage && (
                                <figure className={styles.featuredImageWrapper}>
                                    <img
                                        src={post.featuredImage}
                                        alt={post.imageAlt || post.title}
                                        className={styles.featuredImage}
                                    />
                                    {post.imageCaption && (
                                        <figcaption className={styles.imageCaption}>
                                            {post.imageCaption}
                                        </figcaption>
                                    )}
                                </figure>
                            )}

                            {/* Content */}
                            <div className={styles.content}>
                                <SinglePostContent content={post.content} />
                            </div>

                            {/* Footer: Tags & Share */}
                            <div className={styles.articleFooter}>
                                <div className={styles.tagsWrapper}>
                                    {post.tags && post.tags.map((tag, idx) => (
                                        <span key={idx} className={styles.tag}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.shareWrapper}>
                                    <span className={styles.shareLabel}>Bagikan:</span>
                                    <button className={styles.shareBtn}>
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </article>

                        {/* Navigation */}
                        <div className={styles.navigation}>
                            <Link href="/blog" className={styles.navCard}>
                                <span className={styles.navLabel}>Artikel Sebelumnya</span>
                                <h4 className={styles.navTitle}>
                                    Menelusuri Jejak Leluhur di Barru
                                </h4>
                            </Link>
                            <Link href="/blog" className={styles.navCard} style={{ textAlign: 'right' }}>
                                <span className={styles.navLabel}>Artikel Selanjutnya</span>
                                <h4 className={styles.navTitle}>
                                    Agenda Reoni Akbar 2025
                                </h4>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className={styles.sidebarWrapper}>
                        <BlogSidebar categories={categories} recentPosts={recentPosts} />
                    </div>
                </div>
            </div>
        </div>
    );
}
