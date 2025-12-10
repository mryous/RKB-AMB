'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari judul artikel..."
                        className="w-full pl-10 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Link href="/admin/blog/new" className="btn btn-primary px-4 py-2 flex items-center gap-2 font-bold text-sm">
                    <Plus size={18} /> Tulis Artikel
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="p-4">Judul</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Views</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredPosts.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada artikel.</td></tr>
                        ) : (
                            filteredPosts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{post.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' :
                                                post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {post.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM yyyy') : '-'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{post.views || 0}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
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
    );
}
