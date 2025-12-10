'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '@/components/admin/AdminShared.module.css';

export default function BlogAdminPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah anda yakin ingin menghapus artikel ini?')) return;

        try {
            await fetch(`/api/blog/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout activePage="blog" title="Blog & Artikel">
            <div className={styles.card}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Cari judul artikel..."
                            className={styles.searchInput}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/admin/blog/new" className={styles.btnPrimary}>
                        <Plus size={18} /> Tulis Artikel
                    </Link>
                </div>

                {/* Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>Judul</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Tanggal</th>
                                <th className={styles.th}>Views</th>
                                <th className={styles.th} style={{ textAlign: 'right' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada artikel.</td></tr>
                            ) : (
                                filteredPosts.map(post => (
                                    <tr key={post.id} className={styles.tr}>
                                        <td className={styles.td}>
                                            <div className={styles.tdMedium}>{post.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{post.slug}</div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={`${styles.badge} ${post.status === 'published' ? styles.badgeGreen :
                                                post.status === 'draft' ? styles.badgeGray :
                                                    styles.badgeYellow
                                                }`}>
                                                {post.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={`${styles.td} text-sm text-gray-600`}>
                                            {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM yyyy') : '-'}
                                        </td>
                                        <td className={`${styles.td} text-sm text-gray-600`}>{post.views || 0}</td>
                                        <td className={styles.td}>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/blog/${post.slug}`} target="_blank" className={styles.btnIcon} title="Lihat">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link href={`/admin/blog/edit/${post.id}`} className={styles.btnIcon} title="Edit">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className={`${styles.btnIcon} ${styles.btnIconDelete}`}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
