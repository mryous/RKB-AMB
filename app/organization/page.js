'use client';

import { useState, useEffect } from 'react';
import { FileText, Users, Briefcase, Download } from 'lucide-react';
import styles from './page.module.css';

export default function OrganizationPage() {
    const [members, setMembers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [membersRes, documentsRes] = await Promise.all([
                    fetch('/api/organization'),
                    fetch('/api/documents')
                ]);

                if (membersRes.ok) {
                    const membersData = await membersRes.json();
                    setMembers(membersData);
                }

                if (documentsRes.ok) {
                    const documentsData = await documentsRes.json();
                    setDocuments(documentsData);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Separate main profile (Ketua) and others
    // Assuming the first one in the sorted list is the main one if not specified otherwise
    // Or we can check for specific role names, but order is safer if admin controls it.
    const mainProfile = members.length > 0 ? members[0] : null;
    const otherProfiles = members.length > 1 ? members.slice(1) : [];

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Organisasi RKB-AMB</h1>
                        <p className={styles.subtitle}>
                            Struktur kepengurusan, dokumen resmi, dan program kerja organisasi.
                        </p>
                    </div>
                </div>
            </div>

            {/* Structure Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <Users /> Struktur Pengurus
                        </h2>
                        <p className={styles.sectionSubtitle}>Periode Saat Ini</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <div className={styles.profileGrid}>
                            {/* Ketua */}
                            {mainProfile && (
                                <div className={styles.mainProfileWrapper}>
                                    <ProfileCard
                                        role={mainProfile.role}
                                        name={mainProfile.name}
                                        image={mainProfile.image}
                                        isMain={true}
                                    />
                                </div>
                            )}

                            {/* Others */}
                            {otherProfiles.map(member => (
                                <ProfileCard
                                    key={member.id}
                                    role={member.role}
                                    name={member.name}
                                    image={member.image}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Documents Section */}
            <section className={styles.documentsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <FileText /> Dokumen Organisasi
                        </h2>
                    </div>

                    <div className={styles.documentGrid}>
                        {documents.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-full">Belum ada dokumen yang tersedia.</p>
                        ) : (
                            documents.map(doc => (
                                <DocumentCard
                                    key={doc.id}
                                    title={doc.title}
                                    description={doc.description}
                                    size={doc.fileSize}
                                    url={doc.fileUrl}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            <Briefcase /> Program Kerja
                        </h2>
                    </div>

                    <div className={styles.programGrid}>
                        <ProgramCard
                            title="Silaturahmi Rutin"
                            items={[
                                "Reoni Akbar setiap 2 tahun",
                                "Pertemuan regional (Korwil)",
                                "Halal bi Halal tahunan"
                            ]}
                        />
                        <ProgramCard
                            title="Pelestarian Sejarah"
                            items={[
                                "Digitalisasi arsip keluarga",
                                "Pembuatan buku silsilah",
                                "Pemeliharaan situs makam leluhur"
                            ]}
                        />
                        <ProgramCard
                            title="Sosial & Pendidikan"
                            items={[
                                "Santunan duka",
                                "Beasiswa prestasi untuk anak keluarga",
                                "Pelatihan wirausaha"
                            ]}
                        />
                        <ProgramCard
                            title="Pengembangan Organisasi"
                            items={[
                                "Database anggota digital",
                                "Pembuatan kartu anggota (KTA)",
                                "Penguatan koordinator wilayah"
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function ProfileCard({ role, name, image, isMain = false }) {
    return (
        <div className={`${styles.profileCard} ${isMain ? styles.mainProfileCard : ''}`}>
            <div className={`${styles.avatarWrapper} ${isMain ? styles.avatarMain : styles.avatarRegular}`}>
                <div className={styles.avatarPlaceholder}>
                    {image ? (
                        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: isMain ? '3rem' : '1.5rem', color: '#ccc' }}>
                            {name ? name.charAt(0) : '?'}
                        </span>
                    )}
                </div>
            </div>
            <h3 className={`${styles.profileName} ${isMain ? styles.nameMain : styles.nameRegular}`}>{name}</h3>
            <p className={styles.profileRole}>{role}</p>
        </div>
    );
}

function DocumentCard({ title, description, size, url }) {
    return (
        <div className={styles.documentCard}>
            <div>
                <h3 className={styles.docTitle}>{title}</h3>
                <p className={styles.docDesc}>{description}</p>
                <span className={styles.docSize}>{size}</span>
            </div>
            <a href={url || '#'} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                <Download size={20} />
            </a>
        </div>
    );
}

function ProgramCard({ title, items }) {
    return (
        <div className={styles.programCard}>
            <h3 className={styles.programTitle}>{title}</h3>
            <ul className={styles.programList}>
                {items.map((item, index) => (
                    <li key={index} className={styles.programItem}>
                        <span className={styles.programDot}></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
