'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, User } from 'lucide-react';
import ImagePicker from './ImagePicker';
import styles from './AdminShared.module.css';

export default function FamilyManager() {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/family');
            if (res.ok) {
                const data = await res.json();
                setMembers(data);
            }
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id ? `/api/family/${formData.id}` : '/api/family';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchMembers();
                setIsEditing(false);
                setFormData(initialFormState);
                alert('Data berhasil disimpan!');
            } else {
                const error = await res.json();
                alert(`Gagal menyimpan: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Terjadi kesalahan saat menyimpan.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;

        try {
            const res = await fetch(`/api/family/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchMembers();
            } else {
                const error = await res.json();
                alert(`Gagal menghapus: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Terjadi kesalahan saat menghapus.');
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{formData.id ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
                    <button
                        onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Lengkap</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Pasangan</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.spouse}
                                onChange={e => setFormData({ ...formData, spouse: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tahun Lahir</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.birthYear}
                                onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tahun Wafat (Opsional)</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.deathYear}
                                onChange={e => setFormData({ ...formData, deathYear: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Domisili</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Orang Tua (Parent ID)</label>
                        <select
                            className={styles.select}
                            value={formData.parentId || ''}
                            onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}
                        >
                            <option value="">-- Tidak Ada (Root) --</option>
                            {members.filter(m => m.id !== formData.id).map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <ImagePicker
                            label="Foto Profil"
                            value={formData.photo}
                            onChange={(url) => setFormData({ ...formData, photo: url })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Biografi Singkat</label>
                        <textarea
                            className={styles.textarea}
                            rows="4"
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
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
                        placeholder="Cari anggota..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={styles.btnPrimary}
                    onClick={() => { setFormData(initialFormState); setIsEditing(true); }}
                >
                    <Plus size={18} /> Tambah Anggota
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>Foto</th>
                            <th className={styles.th}>Nama Lengkap</th>
                            <th className={styles.th}>Pasangan</th>
                            <th className={styles.th}>Domisili</th>
                            <th className={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-4">Belum ada data keluarga.</td></tr>
                        ) : (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {member.photo ? (
                                                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.tdMedium}>{member.name}</span>
                                        {member.parentId === null && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Root</span>}
                                    </td>
                                    <td className={styles.td}>{member.spouse || '-'}</td>
                                    <td className={styles.td}>{member.location || '-'}</td>
                                    <td className={styles.td}>
                                        <div className="flex gap-2">
                                            <button
                                                className={styles.btnIcon}
                                                onClick={() => { setFormData(member); setIsEditing(true); }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={`${styles.btnIcon} ${styles.btnIconDelete}`}
                                                onClick={() => handleDelete(member.id)}
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
    name: '',
    spouse: '',
    birthYear: '',
    deathYear: '',
    location: '',
    photo: '',
    parentId: null,
    gender: 'male',
    bio: ''
};
