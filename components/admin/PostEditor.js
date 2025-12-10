'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/editor/Editor';
import { Save, Calendar, Image as ImageIcon, Tag, Globe, ArrowLeft, Clock, Search, Trash2 } from 'lucide-react';
import styles from './PostEditor.module.css';

export default function PostEditor({ postId }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!!postId);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: null,
        excerpt: '',
        status: 'draft',
        publishedAt: new Date().toISOString().slice(0, 16),
        slug: '',
        categories: '',
        tags: '',
        featuredImage: '',
        imageAlt: '',
        imageCaption: '',
        seoTitle: '',
        seoDescription: ''
    });

    useEffect(() => {
        if (postId) {
            setIsLoading(true);
            fetch(`/api/blog/${postId}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch post');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Loaded post data:', data);
                    setFormData({
                        title: data.title || '',
                        content: data.content || null,
                        excerpt: data.excerpt || '',
                        status: data.status || 'draft',
                        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                        slug: data.slug || '',
                        categories: Array.isArray(data.categories) ? data.categories.join(', ') : data.categories || '',
                        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
                        featuredImage: data.featuredImage || '',
                        imageAlt: data.imageAlt || '',
                        imageCaption: data.imageCaption || '',
                        seoTitle: data.seoTitle || '',
                        seoDescription: data.seoDescription || ''
                    });
                    // Small delay to ensure state is updated before rendering editor
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 100);
                })
                .catch(err => {
                    console.error('Error loading post:', err);
                    alert('Gagal memuat data artikel. Silakan coba lagi.');
                    setIsLoading(false);
                });
        }
    }, [postId]);

    const handleEditorChange = (editorState) => {
        editorState.read(() => {
            const json = editorState.toJSON();
            setFormData(prev => ({ ...prev, content: json }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            ...formData,
            categories: formData.categories.split(',').map(s => s.trim()).filter(Boolean),
            tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            const url = postId ? `/api/blog/${postId}` : '/api/blog';
            const method = postId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert('Failed to save post');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, featuredImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading article data...</p>
                {postId && <p className="text-sm text-gray-500">Post ID: {postId}</p>}
            </div>
        );
    }

    // Debug: Log current form data
    console.log('Current formData:', {
        hasTitle: !!formData.title,
        hasContent: !!formData.content,
        contentType: typeof formData.content,
        title: formData.title
    });

    return (
        <form onSubmit={handleSubmit} className={styles.editorForm}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={styles.backBtn}
                        title="Kembali"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className={styles.divider}></div>
                    <span className={styles.titlePreview}>
                        {formData.title || 'Untitled Post'}
                    </span>
                </div>
                <div className={styles.toolbarRight}>
                    <span className={styles.saveStatus}>
                        <Clock size={14} /> {isSaving ? 'Menyimpan...' : 'Tersimpan'}
                    </span>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={styles.saveBtn}
                    >
                        <Save size={18} />
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div className={styles.editorLayout}>
                {/* Main Content Area */}
                <div className={styles.mainContent}>
                    <div className={styles.contentCard}>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Judul Artikel..."
                            className={styles.titleInput}
                            required
                        />
                        <div className={styles.editorWrapper}>
                            {!isLoading && (
                                <Editor
                                    key={`editor-${postId || 'new'}-${formData.content ? 'loaded' : 'empty'}`}
                                    initialConfig={
                                        formData.content
                                            ? { editorState: JSON.stringify(formData.content) }
                                            : undefined
                                    }
                                    onChange={handleEditorChange}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Publishing */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>
                            <Globe size={18} /> Publikasi
                        </h3>
                        <div className={styles.cardContent}>
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <Calendar size={14} /> Tanggal Publish
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.publishedAt}
                                    onChange={e => setFormData({ ...formData, publishedAt: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>
                            <ImageIcon size={18} /> Featured Image
                        </h3>
                        <div className={styles.cardContent}>
                            <div className={styles.imageUploadArea}>
                                {formData.featuredImage ? (
                                    <>
                                        <img src={formData.featuredImage} alt="Preview" className={styles.imagePreview} />
                                        <div className={styles.imageOverlay}>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, featuredImage: '', imageAlt: '', imageCaption: '' }))}
                                                className={styles.deleteImageBtn}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.uploadPlaceholder}>
                                        <ImageIcon size={32} />
                                        <span>Upload Gambar</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className={styles.imageMetadata}>
                                <div className={styles.formGroup}>
                                    <label className={styles.smallLabel}>Alt Text (SEO)</label>
                                    <input
                                        type="text"
                                        placeholder="Deskripsi gambar..."
                                        value={formData.imageAlt || ''}
                                        onChange={e => setFormData({ ...formData, imageAlt: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.smallLabel}>Caption</label>
                                    <input
                                        type="text"
                                        placeholder="Keterangan foto..."
                                        value={formData.imageCaption || ''}
                                        onChange={e => setFormData({ ...formData, imageCaption: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories & Tags */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>
                            <Tag size={18} /> Kategori & Tags
                        </h3>
                        <div className={styles.cardContent}>
                            <div className={styles.formGroup}>
                                <label>Kategori</label>
                                <input
                                    type="text"
                                    placeholder="Berita, Sejarah, Event..."
                                    value={formData.categories}
                                    onChange={e => setFormData({ ...formData, categories: e.target.value })}
                                />
                                <p className={styles.helpText}>Pisahkan dengan koma</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tags</label>
                                <input
                                    type="text"
                                    placeholder="reoni, keluarga, 2024..."
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>Ringkasan (Excerpt)</h3>
                        <div className={styles.cardContent}>
                            <textarea
                                placeholder="Ringkasan artikel untuk tampilan list..."
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.cardTitle}>
                            <Search size={18} /> SEO Metadata
                        </h3>
                        <div className={styles.cardContent}>
                            <div className={styles.formGroup}>
                                <label>Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                                    placeholder="Judul di Google"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Meta Description</label>
                                <textarea
                                    value={formData.seoDescription}
                                    onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                                    placeholder="Deskripsi di Google..."
                                    rows="3"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Custom Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="url-artikel"
                                />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}
