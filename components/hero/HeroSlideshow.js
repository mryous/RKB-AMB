'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/page.module.css';

export default function HeroSlideshow({ settings }) {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/gallery?status=published');
                const data = await res.json();
                // Shuffle and pick top 5
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                setImages(shuffled);
            } catch (error) {
                console.error('Failed to fetch gallery images:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    if (isLoading) {
        return <div className={styles.loadingContainer}>Loading...</div>;
    }

    if (images.length === 0) {
        return (
            <div className={styles.loadingContainer}>
                <p>Belum ada foto di galeri.</p>
            </div>
        );
    }

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        className={styles.backgroundImage}
                        style={{
                            backgroundImage: `url(${img.imageUrl})`,
                            opacity: index === currentIndex ? 1 : 0,
                            zIndex: index === currentIndex ? 1 : 0
                        }}
                    ></div>
                ))}
            </div>

            <div className={styles.overlay}></div>
            <div className={styles.patternOverlay}></div>

            <div className={styles.heroContent} style={{ position: 'relative', zIndex: 20 }}>
                <h1 className={styles.heroTitle}>
                    {settings?.hero?.title ? (
                        <span dangerouslySetInnerHTML={{ __html: settings.hero.title.replace(/\n/g, '<br/>') }} />
                    ) : (
                        "Galeri Keluarga"
                    )}
                </h1>

                {/* Current Image Caption */}
                <div className={styles.captionContainer}>
                    <p className={styles.captionTitle}>
                        {images[currentIndex]?.title}
                    </p>
                    {images[currentIndex]?.description && (
                        <p className={styles.captionDesc}>
                            {images[currentIndex]?.description}
                        </p>
                    )}
                </div>

                {/* Indicators */}
                <div className={styles.indicators}>
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`${styles.indicatorDot} ${idx === currentIndex ? styles.indicatorDotActive : styles.indicatorDotInactive}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
