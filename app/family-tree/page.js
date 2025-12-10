import FamilyTree from '@/components/FamilyTree';
import { Search, Download, Filter } from 'lucide-react';
import styles from './page.module.css';

export default function FamilyTreePage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.title}>Silsilah Keluarga</h1>
                            <p className={styles.subtitle}>Menelusuri jejak keturunan H. Beddu Leppang & Hj. Sami</p>
                        </div>

                        {/* Toolbar */}
                        <div className={styles.toolbar}>
                            <button className={styles.btnToolbar}>
                                <Search size={16} /> Cari
                            </button>
                            <button className={styles.btnToolbar}>
                                <Filter size={16} /> Filter
                            </button>
                            <button className={styles.btnAction}>
                                <Download size={16} /> Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.container}>
                    <FamilyTree />
                </div>
            </div>
        </div>
    );
}
