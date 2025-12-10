'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Eye, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import styles from './page.module.css';

const POSTS_PER_PAGE = 9; // 1 featured + 8 grid

export default function BlogArchivePage() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [posts, searchQuery, selectedCategory]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog');
            const data = await res.json();
            const published = data.filter(p => p.status === 'published');
            setPosts(published);

            // Extract unique categories
            const cats = [...new Set(published.flatMap(p => p.categories || []))];
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = [...posts];

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post =>
                post.categories?.includes(selectedCategory)
            );
        }

        setFilteredPosts(filtered);
        setCurrentPage(1);
    };

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    const featuredPost = currentPosts[0];
    const gridPosts = currentPosts.slice(1);

    if (isLoading) {
        return (
            <div className={styles.archiveContainer}>
                <div className={styles.container}>
                    <p className="text-center text-gray-500">Loading articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.archiveContainer}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Blog & Artikel</h1>
                    <div className={styles.breadcrumb}>
                        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
                        <ChevronRight size={16} />
                        <span>Blog</span>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className={styles.filterSelect}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Featured Post */}
                {featuredPost && (
                    <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredPost}>
                        <div className={styles.featuredImageWrapper}>
                            {featuredPost.featuredImage && (
                                <img
                                    src={featuredPost.featuredImage}
                                    alt={featuredPost.title}
                                    className={styles.featuredImage}
                                />
                            )}
                            <span className={styles.readTime}>
                                <Clock size={14} /> 5 min Read
                            </span>
                        </div>
                        <div className={styles.featuredContent}>
                            {featuredPost.categories?.[0] && (
                                <span className={styles.categoryBadge}>
                                    {featuredPost.categories[0]}
                                </span>
                            )}
                            <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                            <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                            <div className={styles.featuredMeta}>
                                <span className={styles.metaItem}>
                                    <Eye size={16} />
                                    {featuredPost.views || 0}
                                </span>
                                <span className={styles.metaItem}>
                                    <Calendar size={16} />
                                    {featuredPost.publishedAt ? format(new Date(featuredPost.publishedAt), 'dd MMM yyyy') : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Posts Grid */}
                {gridPosts.length > 0 ? (
                    <div className={styles.postsGrid}>
                        {gridPosts.map(post => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className={styles.postCard}>
                                <div className={styles.postImageWrapper}>
                                    {post.featuredImage && (
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className={styles.postImage}
                                        />
                                    )}
                                    <span className={styles.postReadTime}>
                                        <Clock size={12} /> 5 min
                                    </span>
                                </div>
                                <div className={styles.postContent}>
                                    {post.categories?.[0] && (
                                        <span className={styles.postCategory}>
                                            {post.categories[0]}
                                        </span>
                                    )}
                                    <h3 className={styles.postTitle}>{post.title}</h3>
                                    <div className={styles.postMeta}>
                                        <span className={styles.metaItem}>
                                            <Eye size={14} />
                                            {post.views || 0}
                                        </span>
                                        <span className={styles.metaItem}>
                                            <Calendar size={14} />
                                            {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM yyyy') : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : !featuredPost && (
                    <div className={styles.emptyState}>
                        <h3>Tidak ada artikel ditemukan</h3>
                        <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.active : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className={styles.pageBtn}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
