'use client';

import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function HeroStatic({ settings }) {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div
                    className={styles.backgroundImage}
                    style={{
                        backgroundImage: `url(${settings?.hero?.backgroundImage ? `${settings.hero.backgroundImage}${settings.updatedAt ? `?v=${settings.updatedAt}` : ''}` : '/hero-bg.jpg'})`
                    }}
                ></div>
            </div>

            <div className={styles.overlay}></div>
            <div className={styles.patternOverlay}></div>

            <div className={styles.heroContent} style={{ position: 'relative', zIndex: 20 }}>
                <h1 className={styles.heroTitle}>
                    {settings?.hero?.title ? (
                        <span dangerouslySetInnerHTML={{ __html: settings.hero.title.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <>
                            Rukun Keluarga Besar <br />
                            <span className={styles.highlightText}>Appanna Matoa Barru</span>
                        </>
                    )}
                </h1>
                <p className={styles.heroSubtitle}>
                    {settings?.hero?.subtitle || "Merajut Silaturahmi, Melestarikan Sejarah, Membangun Masa Depan."}
                </p>
                <div className={styles.heroButtons}>
                    {settings?.hero?.primaryButton?.text && (
                        <Link href={settings.hero.primaryButton.url || '#'} className={styles.btnSecondary}>
                            {settings.hero.primaryButton.text}
                        </Link>
                    )}
                    {settings?.hero?.secondaryButton?.text && (
                        <Link href={settings.hero.secondaryButton.url || '#'} className={styles.btnOutlineWhite}>
                            {settings.hero.secondaryButton.text}
                        </Link>
                    )}
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '6rem',
                background: 'linear-gradient(to top, var(--background), transparent)',
                zIndex: 10
            }}></div>
        </section>
    );
}
