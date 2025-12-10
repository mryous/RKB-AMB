'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Image as ImageIcon, Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';

export default function ReunionsManagePage() {
    const [reunions, setReunions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReunion, setEditingReunion] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        date: '',
        location: '',
        description: '',
        details: '',
        attendees: '',
        coverImage: '',
        gallery: [],
        status: 'past' // 'upcoming' or 'past'
    });

    useEffect(() => {
        fetchReunions();
    }, []);

    const fetchReunions = async () => {
        try {
            const res = await fetch('/api/reunions');
            const data = await res.json();
            setReunions(data);
        } catch (error) {
            console.error('Failed to fetch reunions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = editingReunion
                ? { ...formData, id: editingReunion.id }
                : formData;

            const res = await fetch('/api/reunions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            if (res.ok) {
                alert(editingReunion ? 'Reuni berhasil diupdate!' : 'Reuni berhasil ditambahkan!');
                fetchReunions();
                resetForm();
            } else {
                alert('Gagal menyimpan reuni.');
            }
        } catch (error) {
            console.error('Error saving reunion:', error);
            alert('Terjadi kesalahan saat menyimpan.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus reuni ini?')) return;

        try {
            const res = await fetch(`/api/reunions?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Reuni berhasil dihapus!');
                fetchReunions();
            } else {
                alert('Gagal menghapus reuni.');
            }
        } catch (error) {
            console.error('Error deleting reunion:', error);
            alert('Terjadi kesalahan saat menghapus.');
        }
    };

    const handleEdit = (reunion) => {
        setEditingReunion(reunion);
        setFormData({
            title: reunion.title || '',
            year: reunion.year || '',
            date: reunion.date || '',
            location: reunion.location || '',
            description: reunion.description || '',
            details: reunion.details || '',
            attendees: reunion.attendees || '',
            coverImage: reunion.coverImage || '',
            gallery: reunion.gallery || [],
            status: reunion.status || 'past'
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            year: '',
            date: '',
            location: '',
            description: '',
            details: '',
            attendees: '',
            coverImage: '',
            gallery: [],
            status: 'past'
        });
        setEditingReunion(null);
        setShowForm(false);
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(images => {
            setFormData(prev => ({
                ...prev,
                gallery: [...prev.gallery, ...images]
            }));
        });
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    if (isLoading) {
        return (
            <AdminLayout activePage="reunions" title="Kelola Reuni">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="reunions" title="Kelola Reuni">
            <div className={styles.container}>
                {/* Header Actions */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Manajemen Reuni</h2>
                        <p className={styles.subtitle}>Kelola data reuni keluarga besar</p>
                    </div>
                    {!showForm && (
                        <button
                            className={styles.btnPrimary}
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={20} /> Tambah Reuni
                        </button>
                    )}
                </div>

                {/* Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h3 className={styles.formTitle}>
                                {editingReunion ? 'Edit Reuni' : 'Tambah Reuni Baru'}
                            </h3>
                            <button className={styles.btnClose} onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* Status */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status Reuni</label>
                                <select
                                    className={styles.select}
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    required
                                >
                                    <option value="past">Sudah Terlaksana</option>
                                    <option value="upcoming">Akan Datang</option>
                                </select>
                            </div>

                            {/* Title */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Judul Reuni *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Reoni Akbar Ke-5"
                                    required
                                />
                            </div>

                            {/* Year & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tahun *</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        placeholder="2025"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tanggal Lengkap</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        placeholder="15-17 Juli 2025"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Lokasi *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Makassar, Sulawesi Selatan"
                                    required
                                />
                            </div>

                            {/* Attendees */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Jumlah Peserta</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.attendees}
                                    onChange={e => setFormData({ ...formData, attendees: e.target.value })}
                                    placeholder="Contoh: 250+ keluarga"
                                />
                            </div>

                            {/* Description */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Deskripsi Singkat *</label>
                                <textarea
                                    className={styles.textarea}
                                    rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Deskripsi singkat tentang reuni..."
                                    required
                                />
                            </div>

                            {/* Details */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Detail Lengkap</label>
                                <textarea
                                    className={styles.textarea}
                                    rows="5"
                                    value={formData.details}
                                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                                    placeholder="Detail lengkap tentang acara, kegiatan, dll..."
                                />
                            </div>

                            {/* Cover Image */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Foto Cover</label>
                                <div className={styles.uploadArea} onClick={() => document.getElementById('coverImage').click()}>
                                    <input
                                        id="coverImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, 'coverImage')}
                                    />
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Klik untuk upload foto cover</p>
                                </div>
                                {formData.coverImage && (
                                    <div className={styles.previewArea}>
                                        <img src={formData.coverImage} alt="Cover" className={styles.previewImage} />
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => setFormData({ ...formData, coverImage: '' })}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Gallery */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Galeri Foto</label>
                                <div className={styles.uploadArea} onClick={() => document.getElementById('gallery').click()}>
                                    <input
                                        id="gallery"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryUpload}
                                    />
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Klik untuk upload foto galeri (bisa multiple)</p>
                                </div>
                                {formData.gallery.length > 0 && (
                                    <div className={styles.galleryGrid}>
                                        {formData.gallery.map((img, index) => (
                                            <div key={index} className={styles.galleryItem}>
                                                <img src={img} alt={`Gallery ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={() => removeGalleryImage(index)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className={styles.helperText}>
                                    Foto-foto ini akan muncul di halaman galeri website dengan tag reuni ini.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className={styles.formActions}>
                                <button type="button" className={styles.btnSecondary} onClick={resetForm}>
                                    Batal
                                </button>
                                <button type="submit" className={styles.btnPrimary}>
                                    <Save size={20} />
                                    {editingReunion ? 'Update Reuni' : 'Simpan Reuni'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reunions List */}
                {!showForm && (
                    <div className={styles.grid}>
                        {reunions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Users size={48} className="text-gray-400 mb-4" />
                                <p className="text-gray-500">Belum ada data reuni.</p>
                                <p className="text-sm text-gray-400">Klik "Tambah Reuni" untuk memulai.</p>
                            </div>
                        ) : (
                            reunions.map(reunion => (
                                <div key={reunion.id} className={styles.card}>
                                    {reunion.coverImage && (
                                        <div className={styles.cardImage}>
                                            <img src={reunion.coverImage} alt={reunion.title} />
                                            {reunion.status === 'upcoming' && (
                                                <span className={styles.badgeUpcoming}>Akan Datang</span>
                                            )}
                                        </div>
                                    )}
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{reunion.title}</h3>
                                        <div className={styles.cardMeta}>
                                            <span><Calendar size={16} /> {reunion.year}</span>
                                            <span><MapPin size={16} /> {reunion.location}</span>
                                            {reunion.attendees && (
                                                <span><Users size={16} /> {reunion.attendees}</span>
                                            )}
                                        </div>
                                        <p className={styles.cardDesc}>{reunion.description}</p>
                                        {reunion.gallery && reunion.gallery.length > 0 && (
                                            <p className={styles.cardGallery}>
                                                <ImageIcon size={16} /> {reunion.gallery.length} foto di galeri
                                            </p>
                                        )}
                                        <div className={styles.cardActions}>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => handleEdit(reunion)}
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleDelete(reunion.id)}
                                            >
                                                <Trash2 size={16} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
