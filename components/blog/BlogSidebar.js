import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import styles from './BlogSidebar.module.css';

export default function BlogSidebar({ categories = [], recentPosts = [] }) {
    return (
        <aside className={styles.sidebar}>
            {/* Search */}
            <div className={styles.card}>
                <h3 className={styles.title}>Cari Artikel</h3>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Ketik kata kunci..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchBtn}>
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className={styles.card}>
                <h3 className={styles.title}>Kategori</h3>
                <ul className={styles.categoryList}>
                    {categories.map((cat, idx) => (
                        <li key={idx}>
                            <Link href={`/blog/category/${cat.slug}`} className={styles.categoryLink}>
                                <span>{cat.name}</span>
                                <span className={styles.categoryCount}>
                                    {cat.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Recent Posts */}
            <div className={styles.card}>
                <h3 className={styles.title}>Artikel Terbaru</h3>
                <div className={styles.recentPosts}>
                    {recentPosts.map(post => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className={styles.postItem}>
                            <div className={styles.postImageWrapper}>
                                {post.featuredImage && (
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className={styles.postImage}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            <div className={styles.postInfo}>
                                <h4 className={styles.postTitle}>
                                    {post.title}
                                </h4>
                                <span className={styles.postDate}>
                                    {new Date(post.publishedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
