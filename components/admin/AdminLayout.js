'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, Image as ImageIcon, Settings, LogOut, LayoutDashboard, BookOpen, Calendar, FolderOpen } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children, activePage, title }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Admin Panel</h2>
                    <p className={styles.sidebarSubtitle}>RKB-AMB Website</p>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin" className={`${styles.navItem} ${activePage === 'dashboard' ? styles.navItemActive : ''}`}>
                        <LayoutDashboard size={20} />
                        <span className={styles.navLabel}>Dashboard</span>
                    </Link>
                    {/* Note: Family, Documents, Gallery are currently tabs in Dashboard, but we might want to split them later. 
                        For now, we keep them as links to dashboard with query params or just dashboard if they are tabs.
                        However, the user requirement is specifically about Blog.
                        Let's keep the dashboard link simple.
                    */}

                    {/* If we are on /admin, we use the internal state for tabs. 
                        If we are on /admin/blog, we are on a separate page.
                        Ideally, all these should be separate pages, but refactoring everything is out of scope.
                        We will just link "Dashboard" to /admin.
                    */}

                    <Link href="/admin?tab=family" className={`${styles.navItem} ${activePage === 'family' ? styles.navItemActive : ''}`}>
                        <Users size={20} />
                        <span className={styles.navLabel}>Data Keluarga</span>
                    </Link>
                    <Link href="/admin?tab=organization" className={`${styles.navItem} ${activePage === 'organization' ? styles.navItemActive : ''}`}>
                        <Users size={20} />
                        <span className={styles.navLabel}>Struktur Organisasi</span>
                    </Link>
                    <Link href="/admin?tab=documents" className={`${styles.navItem} ${activePage === 'documents' ? styles.navItemActive : ''}`}>
                        <FileText size={20} />
                        <span className={styles.navLabel}>Dokumen & Arsip</span>
                    </Link>
                    <Link href="/admin/gallery" className={`${styles.navItem} ${activePage === 'gallery' ? styles.navItemActive : ''}`}>
                        <ImageIcon size={20} />
                        <span className={styles.navLabel}>Galeri Foto</span>
                    </Link>
                    <Link href="/admin/files" className={`${styles.navItem} ${activePage === 'files' ? styles.navItemActive : ''}`}>
                        <FolderOpen size={20} />
                        <span className={styles.navLabel}>Manajemen File</span>
                    </Link>
                    <Link href="/admin/blog" className={`${styles.navItem} ${activePage === 'blog' ? styles.navItemActive : ''}`}>
                        <BookOpen size={20} />
                        <span className={styles.navLabel}>Blog & Artikel</span>
                    </Link>
                    <Link href="/admin/reunions" className={`${styles.navItem} ${activePage === 'reunions' ? styles.navItemActive : ''}`}>
                        <Calendar size={20} />
                        <span className={styles.navLabel}>Kelola Reuni</span>
                    </Link>
                    <Link href="/admin?tab=settings" className={`${styles.navItem} ${activePage === 'settings' ? styles.navItemActive : ''}`}>
                        <Settings size={20} />
                        <span className={styles.navLabel}>Pengaturan</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.sidebarUser}>
                        Logged in as {session?.user?.email}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>
                        {title}
                    </h1>
                    <ProfileDropdown />
                </div>

                {children}
            </main>
        </div>
    );
}
