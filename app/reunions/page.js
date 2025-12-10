'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ReunionsPage() {
    const [reunions, setReunions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    const upcomingReunions = reunions.filter(r => r.status === 'upcoming');
    const pastReunions = reunions.filter(r => r.status === 'past');
    const upcomingReunion = upcomingReunions[0]; // Get the first upcoming reunion

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Reoni & Kegiatan</h1>
                        <p className={styles.subtitle}>
                            Rekam jejak pertemuan keluarga dari masa ke masa. Momen kebersamaan yang tak terlupakan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Upcoming Event */}
            {upcomingReunion && (
                <section className={styles.section}>
                    <div className={styles.container}>
                        <div className={styles.upcomingCard}>
                            <div className={styles.upcomingLeft}>
                                <span className={styles.upcomingLabel}>Acara Berikutnya</span>
                                <h2 className={styles.upcomingTitle}>{upcomingReunion.title}</h2>
                                <div className={styles.upcomingInfo}>
                                    <div className={styles.infoItem}>
                                        <Calendar size={20} />
                                        <span>{upcomingReunion.date || upcomingReunion.year}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <MapPin size={20} />
                                        <span>{upcomingReunion.location}</span>
                                    </div>
                                    {upcomingReunion.attendees && (
                                        <div className={styles.infoItem}>
                                            <Users size={20} />
                                            <span>{upcomingReunion.attendees}</span>
                                        </div>
                                    )}
                                </div>
                                <button className={styles.btnDark}>
                                    Daftar Kehadiran
                                </button>
                            </div>
                            <div className={styles.upcomingRight}>
                                <h3 className={styles.countdownTitle}>
                                    {upcomingReunion.description || 'Mari Bersiap untuk Silaturahmi Akbar!'}
                                </h3>
                                <p className={styles.countdownDesc}>
                                    {upcomingReunion.details || 'Persiapkan diri Anda dan keluarga untuk kembali berkumpul, melepas rindu, dan mempererat tali persaudaraan. Informasi lebih lanjut mengenai lokasi pasti dan rundown acara akan segera diumumkan.'}
                                </p>
                                <div className={styles.countdownTimer}>
                                    <div className={styles.timerItem}>
                                        <span className={styles.timerValue}>00</span>
                                        <span className={styles.timerLabel}>Hari</span>
                                    </div>
                                    <div className={styles.timerItem}>
                                        <span className={styles.timerValue}>00</span>
                                        <span className={styles.timerLabel}>Jam</span>
                                    </div>
                                    <div className={styles.timerItem}>
                                        <span className={styles.timerValue}>00</span>
                                        <span className={styles.timerLabel}>Menit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Past Reunions */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.archiveTitle}>
                        Arsip Reoni
                    </h2>

                    <div className={styles.grid}>
                        {pastReunions.length > 0 ? (
                            pastReunions.map(reunion => (
                                <ReunionCard
                                    key={reunion.id}
                                    year={reunion.year}
                                    location={reunion.location}
                                    title={reunion.title}
                                    description={reunion.description}
                                    image={reunion.coverImage}
                                    attendees={reunion.attendees}
                                    galleryCount={reunion.gallery?.length || 0}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">Belum ada arsip reuni.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ReunionCard({ year, location, title, description, image, attendees, galleryCount }) {
    return (
        <div className={styles.reunionCard}>
            <div className={styles.cardImage}>
                {image ? (
                    <img src={image} alt={title} className={styles.cardImageImg} />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        [Foto Dokumentasi]
                    </div>
                )}
                <div className={styles.cardOverlay}></div>
                <div className={`${styles.badge} ${styles.badgeYear}`}>
                    <Calendar size={12} /> {year}
                </div>
                <div className={`${styles.badge} ${styles.badgeLocation}`}>
                    <MapPin size={12} /> {location}
                </div>
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                    {title}
                </h3>
                {attendees && (
                    <div className={styles.cardMeta}>
                        <Users size={16} /> {attendees}
                    </div>
                )}
                <p className={styles.cardDesc}>
                    {description}
                </p>
                <Link href={`/gallery`} className={styles.cardLink}>
                    Lihat Galeri Foto {galleryCount > 0 && `(${galleryCount})`} <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>
        </div>
    );
}
