'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, FileText, Upload, Download } from 'lucide-react';
import styles from './AdminShared.module.css';

export default function DocumentManager() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('/api/documents');
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const method = formData.id ? 'PUT' : 'POST';

            const res = await fetch('/api/documents', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchDocuments();
                setIsEditing(false);
                setFormData(initialFormState);
                alert('Data berhasil disimpan!');
            } else {
                const error = await res.json();
                alert(`Gagal menyimpan: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Terjadi kesalahan saat menyimpan.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) return;

        try {
            const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchDocuments();
            } else {
                const error = await res.json();
                alert(`Gagal menghapus: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Terjadi kesalahan saat menghapus.');
        }
    };

    const filteredDocuments = documents.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className={styles.headerFlex}>
                    <h3 className={styles.headerTitle}>{formData.id ? 'Edit Dokumen' : 'Tambah Dokumen'}</h3>
                    <button
                        onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                        className={`${styles.textGray500} ${styles.hoverTextGray700}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Judul Dokumen</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className={styles.gridTwoCols}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Kategori</label>
                            <select
                                className={styles.select}
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Umum">Umum</option>
                                <option value="Legal">Legal</option>
                                <option value="Rapat">Rapat</option>
                                <option value="Program">Program</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ukuran File (Contoh: 2.5 MB)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.fileSize}
                                onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>URL File (Link Download)</label>
                        <div className={`${styles.flex} ${styles.gap2}`}>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.fileUrl}
                                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                placeholder="https://..."
                            />
                            {/* Placeholder for future upload functionality */}
                            <button className={styles.btnSecondary} title="Upload feature coming soon">
                                <Upload size={18} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Deskripsi Singkat</label>
                        <textarea
                            className={styles.textarea}
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                            className={styles.btnSecondary}
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            className={styles.btnPrimary}
                        >
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={styles.btnPrimary}
                    onClick={() => { setFormData(initialFormState); setIsEditing(true); }}
                >
                    <Plus size={18} /> Tambah Dokumen
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
                        {isLoading ? (
                            <tr><td colSpan="5" className={`${styles.textCenter} ${styles.p4}`}>Loading...</td></tr>
                        ) : filteredDocuments.length === 0 ? (
                            <tr><td colSpan="5" className={`${styles.textCenter} ${styles.p4}`}>Belum ada dokumen.</td></tr>
                        ) : (
                            filteredDocuments.map((doc) => (
                                <tr key={doc.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.docRow}>
                                            <div className={styles.docIcon}>
                                                <FileText size={20} />
                                            </div>
                                            <div className={styles.docInfo}>
                                                <span className={styles.docTitle}>{doc.title}</span>
                                                <p className={styles.docDesc}>{doc.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.badge} ${doc.category === 'Legal' ? styles.badgePurple :
                                            doc.category === 'Rapat' ? styles.badgeBlue :
                                                doc.category === 'Program' ? styles.badgeGreen :
                                                    styles.badgeGray
                                            }`}>
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.textSm} ${styles.textGray600}`}>{doc.uploadDate}</span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.textSm} ${styles.textGray600} ${styles.fontMono}`}>{doc.fileSize}</span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={`${styles.flex} ${styles.gap2}`}>
                                            <a
                                                href={doc.fileUrl || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.btnIcon}
                                                title="Download/Lihat"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button
                                                className={styles.btnIcon}
                                                onClick={() => { setFormData(doc); setIsEditing(true); }}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={`${styles.btnIcon} ${styles.btnIconDelete}`}
                                                onClick={() => handleDelete(doc.id)}
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const initialFormState = {
    title: '',
    description: '',
    category: 'Umum',
    fileUrl: '',
    fileSize: '',
    uploadDate: ''
};
