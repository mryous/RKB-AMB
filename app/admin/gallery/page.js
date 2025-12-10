'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, X, Edit2, Trash2, Star, Calendar, MapPin, User, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';

export default function AdminGalleryPage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        status: 'published'
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        category: 'family',
        tags: '',
        photographer: '',
        location: '',
        dateTaken: '',
        featured: false,
        status: 'published'
    });

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, [filters]);

    const fetchItems = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.category !== 'all') {
                params.append('category', filters.category);
            }
            params.append('status', filters.status);

            const res = await fetch(`/api/gallery?${params}`);
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSave = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            id: editingItem?.id
        };

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchItems();
                fetchCategories();
            }
        } catch (error) {
            console.error('Failed to save item:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            category: item.category,
            tags: item.tags?.join(', ') || '',
            photographer: item.photographer || '',
            location: item.location || '',
            dateTaken: item.dateTaken || '',
            featured: item.featured || false,
            status: item.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;

        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchItems();
                fetchCategories();
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const toggleFeatured = async (item) => {
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...item,
                    featured: !item.featured
                })
            });

            if (res.ok) {
                fetchItems();
            }
        } catch (error) {
            console.error('Failed to toggle featured:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            category: 'family',
            tags: '',
            photographer: '',
            location: '',
            dateTaken: '',
            featured: false,
            status: 'published'
        });
        setEditingItem(null);
    };

    const stats = {
        total: items.length,
        published: items.filter(i => i.status === 'published').length,
        featured: items.filter(i => i.featured).length
    };

    return (
        <AdminLayout activePage="gallery" title="Kelola Galeri">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Kelola Galeri</h1>
                        <p className={styles.subtitle}>
                            Upload dan kelola foto keluarga
                        </p>
                    </div>
                    <button
                        className={styles.btnPrimary}
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        <Plus size={20} />
                        Tambah Foto
                    </button>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Foto</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.published}</div>
                        <div className={styles.statLabel}>Published</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{stats.featured}</div>
                        <div className={styles.statLabel}>Featured</div>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Kategori:</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.count})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Status:</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Gallery Grid */}
                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : items.length === 0 ? (
                    <div className={styles.empty}>
                        <ImageIcon size={48} />
                        <p>Belum ada foto</p>
                        <button className={styles.btnSecondary} onClick={() => setShowModal(true)}>
                            Tambah Foto Pertama
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {items.map(item => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <img src={item.imageUrl} alt={item.title} />
                                    {item.featured && (
                                        <div className={styles.featuredBadge}>
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.categoryBadge} style={{ backgroundColor: categories.find(c => c.id === item.category)?.color }}>
                                            {categories.find(c => c.id === item.category)?.name}
                                        </span>
                                    </div>
                                    {item.tags && item.tags.length > 0 && (
                                        <div className={styles.tags}>
                                            {item.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className={styles.tag}>#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.btnIcon}
                                            onClick={() => toggleFeatured(item)}
                                            title={item.featured ? 'Unfeature' : 'Feature'}
                                        >
                                            <Star size={16} fill={item.featured ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            className={styles.btnIcon}
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className={styles.btnIcon}
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className={styles.modal} onClick={() => setShowModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>{editingItem ? 'Edit Foto' : 'Tambah Foto'}</h2>
                                <button className={styles.btnClose} onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                {/* Image Upload */}
                                <div className={styles.formGroup}>
                                    <label>Foto *</label>
                                    <div className={styles.imageUpload}>
                                        {formData.imageUrl ? (
                                            <div className={styles.imagePreview}>
                                                <img src={formData.imageUrl} alt="Preview" />
                                                <button
                                                    type="button"
                                                    className={styles.btnRemoveImage}
                                                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className={styles.uploadLabel}>
                                                <ImageIcon size={32} />
                                                <span>Klik untuk upload foto</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    hidden
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className={styles.formGroup}>
                                    <label>Judul *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className={styles.formGroup}>
                                    <label>Deskripsi</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {/* Category */}
                                <div className={styles.formGroup}>
                                    <label>Kategori *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        required
                                    >
                                        {categories.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div className={styles.formGroup}>
                                    <label>Tags (pisahkan dengan koma)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                        placeholder="reuni, 2019, calio"
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    {/* Photographer */}
                                    <div className={styles.formGroup}>
                                        <label>Fotografer</label>
                                        <input
                                            type="text"
                                            value={formData.photographer}
                                            onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                                        />
                                    </div>

                                    {/* Date Taken */}
                                    <div className={styles.formGroup}>
                                        <label>Tanggal Foto</label>
                                        <input
                                            type="date"
                                            value={formData.dateTaken}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dateTaken: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className={styles.formGroup}>
                                    <label>Lokasi</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="Makassar, Sulawesi Selatan"
                                    />
                                </div>

                                {/* Featured */}
                                <div className={styles.formGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                        />
                                        <span>Tandai sebagai Featured</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className={styles.formActions}>
                                    <button type="button" className={styles.btnSecondary} onClick={() => setShowModal(false)}>
                                        Batal
                                    </button>
                                    <button type="submit" className={styles.btnPrimary}>
                                        {editingItem ? 'Update' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
