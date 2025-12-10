import { familyService } from '@/lib/familyService';
import { User, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default async function MemberDetail({ params }) {
    const { id } = await params;
    const member = await familyService.getMemberById(id);

    if (!member) {
        return <div className="p-10 text-center">Anggota keluarga tidak ditemukan.</div>;
    }

    return (
        <div className={styles.container}>
            <Link href="/family-tree" className={styles.backLink}>
                <ArrowLeft size={20} /> Kembali ke Pohon Keluarga
            </Link>

            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        {member.photo ? (
                            <img src={member.photo} alt={member.name} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                <User size={64} />
                            </div>
                        )}
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.name}>{member.name}</h1>
                        {member.spouse && <p className={styles.spouse}>Pasangan: {member.spouse}</p>}
                    </div>
                </div>

                <div className={styles.contentGrid}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Informasi Pribadi</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <Calendar className={styles.icon} size={18} />
                                <div>
                                    <span className={styles.label}>Tahun Lahir</span>
                                    <p>{member.birthYear || '-'}</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Calendar className={styles.icon} size={18} />
                                <div>
                                    <span className={styles.label}>Tahun Wafat</span>
                                    <p>{member.deathYear || '-'}</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <MapPin className={styles.icon} size={18} />
                                <div>
                                    <span className={styles.label}>Domisili</span>
                                    <p>{member.location || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Biografi</h2>
                        <p className={styles.bio}>
                            {member.bio || 'Belum ada biografi.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
