'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Calendar, MapPin, User, Tag } from 'lucide-react';
import styles from './page.module.css';

export default function GalleryPage() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchGalleryItems();
        fetchCategories();
    }, [selectedCategory]);

    const fetchGalleryItems = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }
            params.append('status', 'published');

            const res = await fetch(`/api/gallery?${params}`);
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Galeri Keluarga</h1>
                        <p className={styles.subtitle}>
                            Kumpulan momen berharga dan dokumentasi kegiatan keluarga besar.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    {/* Category Tabs */}
                    {categories.length > 0 && (
                        <div className={styles.categoryTabs}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.categoryTabActive : ''}`}
                                    style={{
                                        '--category-color': cat.color
                                    }}
                                >
                                    <span className={styles.categoryName}>{cat.name}</span>
                                    <span className={styles.categoryCount}>{cat.count}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Gallery Grid */}
                    {items.length > 0 ? (
                        <div className={styles.imageGrid}>
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.imageCard}
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <img src={item.imageUrl} alt={item.title} className={styles.gridImage} />
                                    <div className={styles.imageOverlay}>
                                        <div className={styles.imageInfo}>
                                            <p className={styles.imageTitle}>{item.title}</p>
                                            <div className={styles.imageMeta}>
                                                {item.location && (
                                                    <span>
                                                        <MapPin size={12} /> {item.location}
                                                    </span>
                                                )}
                                                {item.dateTaken && (
                                                    <span>
                                                        <Calendar size={12} /> {new Date(item.dateTaken).getFullYear()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <ImageIcon size={48} className="text-gray-400 mb-4" />
                            <p className="text-gray-500">Belum ada foto di kategori ini.</p>
                            <p className="text-sm text-gray-400">Pilih kategori lain atau tunggu foto baru ditambahkan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
                        <X size={24} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage.imageUrl} alt={selectedImage.title} className={styles.lightboxImage} />
                        <div className={styles.lightboxInfo}>
                            <h3>{selectedImage.title}</h3>
                            {selectedImage.description && (
                                <p className={styles.lightboxDescription}>{selectedImage.description}</p>
                            )}
                            <div className={styles.lightboxMeta}>
                                {selectedImage.location && (
                                    <span>
                                        <MapPin size={16} /> {selectedImage.location}
                                    </span>
                                )}
                                {selectedImage.dateTaken && (
                                    <span>
                                        <Calendar size={16} /> {new Date(selectedImage.dateTaken).toLocaleDateString('id-ID')}
                                    </span>
                                )}
                                {selectedImage.photographer && (
                                    <span>
                                        <User size={16} /> {selectedImage.photographer}
                                    </span>
                                )}
                            </div>
                            {selectedImage.tags && selectedImage.tags.length > 0 && (
                                <div className={styles.lightboxTags}>
                                    {selectedImage.tags.map((tag, i) => (
                                        <span key={i} className={styles.lightboxTag}>
                                            <Tag size={12} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
