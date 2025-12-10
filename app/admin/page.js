'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Users, FileText, Image as ImageIcon, Search, Trash2, Edit, Upload, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '@/components/admin/AdminShared.module.css';
import SettingsPage from '@/app/admin/settings/page';

import FamilyManager from '@/components/admin/FamilyManager';
import OrganizationManager from '@/components/admin/OrganizationManager';
import DocumentManager from '@/components/admin/DocumentManager';

export default function AdminDashboard() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        } else {
            setActiveTab('dashboard');
        }
    }, [searchParams]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome />;
            case 'family':
                return <FamilyManager />;
            case 'organization':
                return <OrganizationManager />;
            case 'documents':
                return <DocumentManager />;
            case 'gallery':
                return <PhotoGallery />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <DashboardHome />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard Overview';
            case 'family': return 'Data Keluarga';
            case 'organization': return 'Struktur Organisasi';
            case 'documents': return 'Dokumen & Arsip';
            case 'gallery': return 'Galeri Foto';
            case 'settings': return 'Pengaturan Website';
            default: return 'Dashboard';
        }
    };

    return (
        <AdminLayout activePage={activeTab} title={getTitle()}>
            {renderContent()}
        </AdminLayout>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>{title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--foreground)' }}>{value}</h3>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
        </div>
    );
}

// Sub-components for each section

function DashboardHome() {
    const [stats, setStats] = useState({
        family: 0,
        organization: 0,
        documents: 0,
        gallery: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [familyRes, orgRes, docRes, galleryRes] = await Promise.all([
                    fetch('/api/family'),
                    fetch('/api/organization'),
                    fetch('/api/documents'),
                    fetch('/api/gallery')
                ]);

                const familyData = familyRes.ok ? await familyRes.json() : [];
                const orgData = orgRes.ok ? await orgRes.json() : [];
                const docData = docRes.ok ? await docRes.json() : [];
                const galleryData = galleryRes.ok ? await galleryRes.json() : [];

                setStats({
                    family: Array.isArray(familyData) ? familyData.length : 0,
                    organization: Array.isArray(orgData) ? orgData.length : 0,
                    documents: Array.isArray(docData) ? docData.length : 0,
                    gallery: Array.isArray(galleryData) ? galleryData.length : 0
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Total Anggota Keluarga"
                    value={isLoading ? "..." : stats.family}
                    icon={<Users style={{ color: '#3b82f6' }} />}
                />
                <StatCard
                    title="Pengurus Organisasi"
                    value={isLoading ? "..." : stats.organization}
                    icon={<Users style={{ color: '#f97316' }} />}
                />
                <StatCard
                    title="Dokumen Arsip"
                    value={isLoading ? "..." : stats.documents}
                    icon={<FileText style={{ color: '#22c55e' }} />}
                />
                <StatCard
                    title="Foto Galeri"
                    value={isLoading ? "..." : stats.gallery}
                    icon={<ImageIcon style={{ color: '#a855f7' }} />}
                />
            </div>

            {/* Recent Activity */}
            <div className={styles.card}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>Aktivitas Terbaru</h3>
                <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru yang tercatat.</p>
            </div>
        </>
    );
}

function DocumentsArchive() {
    return (
        <div className={styles.card}>
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input type="text" placeholder="Cari dokumen..." className={styles.searchInput} />
                </div>
                <button className={styles.btnPrimary}>
                    <Upload size={18} /> Upload Dokumen
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>Nama Dokumen</th>
                            <th className={styles.th}>Kategori</th>
                            <th className={styles.th}>Tanggal Upload</th>
                            <th className={styles.th}>Ukuran</th>
                            <th className={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={styles.tr}>
                            <td className={styles.td}>
                                <span className={styles.tdMedium}>AD/ART RKB-AMB.pdf</span>
                            </td>
                            <td className={styles.td}>Legal</td>
                            <td className={styles.td}>10 Jan 2024</td>
                            <td className={styles.td}>2.5 MB</td>
                            <td className={styles.td}>
                                <div className="flex gap-2">
                                    <button className={styles.btnIcon}><Edit size={16} /></button>
                                    <button className={`${styles.btnIcon} ${styles.btnIconDelete}`}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.td}>
                                <span className={styles.tdMedium}>Notulen Rapat Tahunan.docx</span>
                            </td>
                            <td className={styles.td}>Rapat</td>
                            <td className={styles.td}>15 Feb 2024</td>
                            <td className={styles.td}>500 KB</td>
                            <td className={styles.td}>
                                <div className="flex gap-2">
                                    <button className={styles.btnIcon}><Edit size={16} /></button>
                                    <button className={`${styles.btnIcon} ${styles.btnIconDelete}`}><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PhotoGallery() {
    return (
        <div className={styles.card}>
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <h3 className="font-bold">Galeri Foto</h3>
                </div>
                <button className={styles.btnPrimary}>
                    <Upload size={18} /> Upload Foto
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} style={{ aspectRatio: '1', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                            IMG {item}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


