'use client';

import { useState, useEffect } from 'react';
import { Scroll, Heart, Shield, Users } from 'lucide-react';
import styles from './page.module.css';

export default function HistoryPage() {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    const origin = settings?.origin || {};
    const timeline = settings?.timeline || {};

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Sejarah & Identitas</h1>
                        <p className={styles.subtitle}>
                            Mengenal lebih dekat asal-usul, perjalanan, dan nilai-nilai luhur Rukun Keluarga Besar Appanna Matoa Barru.
                        </p>
                    </div>
                </div>
            </div>

            {/* Origins Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.originsGrid}>
                        <div className={styles.stickyImage}>
                            <div className={styles.imageWrapper}>
                                {origin.image ? (
                                    <img
                                        src={origin.image}
                                        alt={origin.imageAlt || 'Foto Asal Usul'}
                                        className={styles.originImage}
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        [Foto Asal Usul]
                                    </div>
                                )}
                            </div>
                            {origin.imageAlt && (
                                <div className={styles.imageCaption}>
                                    {origin.imageAlt}
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            <h2 className={styles.contentTitle}>
                                <Scroll className="text-[var(--secondary)]" /> {origin.title || 'Asal Usul'}
                            </h2>
                            <div className={styles.prose}>
                                {origin.description ? (
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{origin.description}</p>
                                ) : (
                                    <>
                                        <p>
                                            Keluarga besar ini bermula dari pasangan <strong>H. Beddu Leppang</strong> dan <strong>Hj. Sami</strong>.
                                            They are hardworking individuals who lived within a strong agrarian tradition (paggalung).
                                            Their diligence and honesty became the foundation for the success of their children and grandchildren in various fields.
                                        </p>
                                        <p>
                                            From this marriage, a new generation was born who then spread to various regions,
                                            forming the family branches we know today. The spirit of togetherness and mutual cooperation
                                            they instilled continues to live on to this day.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Nilai-Nilai Keluarga</h2>
                        <p className={styles.sectionDesc}>Falsafah hidup yang menjadi pegangan setiap anggota keluarga.</p>
                    </div>

                    <div className={styles.valuesGrid}>
                        <ValueCard
                            icon={<Heart size={32} />}
                            title="Sipakario"
                            meaning="Saling Menggembirakan"
                            description="Senantiasa menebar kebahagiaan, menjaga tutur kata agar tidak menyakiti hati, dan saling menghibur dalam suka maupun duka."
                        />
                        <ValueCard
                            icon={<Shield size={32} />}
                            title="Sipakarennu"
                            meaning="Saling Merindukan/Menghormati"
                            description="Menjaga rasa hormat dan kerinduan untuk bertemu, sehingga silaturahmi selalu terjaga dengan hangat."
                        />
                        <ValueCard
                            icon={<Users size={32} />}
                            title="Sipatokkong"
                            meaning="Saling Menegakkan"
                            description="Saling membantu untuk bangkit, mendukung kesuksesan satu sama lain, dan gotong royong dalam kebaikan."
                        />
                    </div>
                </div>
            </section>

            {/* Formation History / Timeline */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        {timeline.title || 'Perjalanan RKB-AMB'}
                    </h2>
                    {timeline.subtitle && (
                        <p className={styles.sectionDesc} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            {timeline.subtitle}
                        </p>
                    )}

                    <div className={styles.timelineContainer}>
                        {timeline.events && timeline.events.length > 0 ? (
                            timeline.events.map((event, index) => (
                                <TimelineItem
                                    key={index}
                                    year={event.year}
                                    title={event.title}
                                    description={event.description}
                                    side={index % 2 === 0 ? 'left' : 'right'}
                                />
                            ))
                        ) : (
                            <>
                                <TimelineItem
                                    year="2016"
                                    title="Awal Mula: Reoni Sidondo"
                                    description="Titik awal terbentuknya kesadaran untuk menyatukan kembali keluarga besar yang terpencar. Reoni pertama diadakan di Sidondo dengan penuh haru dan kebahagiaan."
                                    side="left"
                                />
                                <TimelineItem
                                    year="2017"
                                    title="Formalisasi: Reoni Cabbengge"
                                    description="Pembahasan AD/ART dan pemilihan pengurus pertama. Organisasi mulai berjalan lebih terstruktur."
                                    side="right"
                                />
                                <TimelineItem
                                    year="2019"
                                    title="Penguatan: Reoni Calio"
                                    description="Diisi dengan kegiatan Idul Adha bersama dan tradisi Mappadendang. Dihadiri oleh tamu dari pemerintah setempat."
                                    side="left"
                                />
                                <TimelineItem
                                    year="Kini"
                                    title="Era Digital"
                                    description="RKB-AMB terus berkembang dengan memanfaatkan teknologi untuk mendata dan menghubungkan ribuan anggota keluarga di seluruh dunia."
                                    side="right"
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, meaning, description }) {
    return (
        <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
                {icon}
            </div>
            <h3 className={styles.valueTitle}>{title}</h3>
            <p className={styles.valueMeaning}>{meaning}</p>
            <p className={styles.valueDesc}>{description}</p>
        </div>
    );
}

function TimelineItem({ year, title, description, side }) {
    const isLeft = side === 'left';

    return (
        <div className={`${styles.timelineItem} ${isLeft ? styles.timelineItemLeft : ''} `}>
            <div className={styles.timelineSpacer}></div>

            <div className={styles.timelineDot}></div>

            <div className={styles.timelineContentWrapper}>
                <div className={styles.timelineContent}>
                    <span className={styles.timelineYear}>
                        {year}
                    </span>
                    <h3 className={styles.timelineTitle}>{title}</h3>
                    <p className={styles.timelineDesc}>{description}</p>
                </div>
            </div>
        </div>
    );
}
