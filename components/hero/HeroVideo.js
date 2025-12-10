'use client';

import styles from '@/app/page.module.css';

function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function HeroVideo({ settings }) {
    const videoId = getYouTubeId(settings.hero.youtubeUrl);

    if (!videoId) return null;

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.youtubeBackground}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                        className={styles.youtubeIframe}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            {/* No text overlay for Video Hero as requested */}
            {/* No text overlay for Video Hero as requested */}
            <div className={styles.videoOverlay}></div>
        </section>
    );
}
