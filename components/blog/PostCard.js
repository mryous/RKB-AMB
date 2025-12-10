import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import styles from './PostCard.module.css';

export default function PostCard({ post }) {
    return (
        <article className={styles.card}>
            <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
                {post.featuredImage ? (
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        className={styles.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.noImage}>
                        No Image
                    </div>
                )}
                <div className={styles.categoryBadge}>
                    {post.categories && post.categories[0] && (
                        <span>
                            {post.categories[0]}
                        </span>
                    )}
                </div>
            </Link>

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

                <h3 className={styles.title}>
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>

                <p className={styles.excerpt}>
                    {post.excerpt}
                </p>

                <Link
                    href={`/blog/${post.slug}`}
                    className={styles.readMore}
                >
                    Baca Selengkapnya <ArrowRight size={16} />
                </Link>
            </div>
        </article>
    );
}
