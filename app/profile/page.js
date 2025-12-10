'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [router]);

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.pageTitle}>Profil Saya</h1>

                <div className={styles.card}>
                    <div className={styles.coverImage}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatarWrapper}>
                                <div className={styles.avatar}>
                                    <User size={40} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.profileContent}>
                        <div className={styles.header}>
                            <div>
                                <h2 className={styles.name}>{user.name}</h2>
                                <p className={styles.role}>Anggota Keluarga • Cabang Sinosi</p>
                            </div>
                            <button className={styles.editBtn}>
                                <Edit size={16} /> Edit Profil
                            </button>
                        </div>

                        <div className={styles.grid}>
                            <InfoItem icon={<Mail />} label="Email" value="anggota@example.com" />
                            <InfoItem icon={<Phone />} label="Telepon" value="+62 812-3456-7890" />
                            <InfoItem icon={<MapPin />} label="Domisili" value="Jakarta Selatan" />
                            <InfoItem icon={<User />} label="Status" value="Aktif" />
                        </div>

                        <div className={styles.infoSection}>
                            <h3 className={styles.sectionTitle}>Data Keluarga</h3>
                            <div className={styles.familyData}>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>Ayah</span>
                                    <span className={styles.dataValue}>H. Fulan</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>Ibu</span>
                                    <span className={styles.dataValue}>Hj. Fulana</span>
                                </div>
                                <div className={styles.dataRow}>
                                    <span className={styles.dataLabel}>Generasi Ke-</span>
                                    <span className={styles.dataValue}>3 (Cucu)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <div>
                <p className={styles.infoLabel}>{label}</p>
                <p className={styles.infoValue}>{value}</p>
            </div>
        </div>
    );
}
