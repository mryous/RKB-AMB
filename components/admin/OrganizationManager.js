'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, User, ArrowUp, ArrowDown } from 'lucide-react';
import ImagePicker from './ImagePicker';
import styles from './AdminShared.module.css';

export default function OrganizationManager() {
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
            const res = await fetch('/api/organization');
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

            const res = await fetch('/api/organization', {
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
        if (!confirm('Apakah Anda yakin ingin menghapus pengurus ini?')) return;

        try {
            const res = await fetch(`/api/organization?id=${id}`, { method: 'DELETE' });
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

    const handleMove = async (member, direction) => {
        // Simple swap logic for now, or just update order
        // For simplicity, let's just swap order values with the adjacent item
        const index = members.findIndex(m => m.id === member.id);
        if (index === -1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= members.length) return;

        const targetMember = members[targetIndex];

        // Swap orders
        const memberOrder = member.order || 0;
        const targetOrder = targetMember.order || 0;

        // Optimistic update
        const newMembers = [...members];
        newMembers[index] = { ...member, order: targetOrder };
        newMembers[targetIndex] = { ...targetMember, order: memberOrder };
        newMembers.sort((a, b) => (a.order || 0) - (b.order || 0));
        setMembers(newMembers);

        // API calls
        try {
            await Promise.all([
                fetch('/api/organization', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: member.id, order: targetOrder })
                }),
                fetch('/api/organization', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: targetMember.id, order: memberOrder })
                })
            ]);
            fetchMembers(); // Refresh to be sure
        } catch (error) {
            console.error('Failed to reorder:', error);
            fetchMembers(); // Revert on error
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isEditing) {
        return (
            <div className={styles.card}>
                <div className={`${styles.headerFlex} ${styles.mb6}`}>
                    <h3 className={`${styles.textXl} ${styles.fontBold}`}>{formData.id ? 'Edit Pengurus' : 'Tambah Pengurus'}</h3>
                    <button
                        onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                        className={`${styles.textGray500} ${styles.hoverTextGray700}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.spaceY4}>
                    <div className={`${styles.gridTwoCols} ${styles.gap4}`}>
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
                            <label className={styles.label}>Jabatan</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Urutan Tampil</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={formData.order}
                            onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                        <p className={`${styles.textXs} ${styles.textGray500} ${styles.mt1}`}>Semakin kecil angkanya, semakin di atas posisinya.</p>
                    </div>

                    <div className={styles.formGroup}>
                        <ImagePicker
                            label="Foto Profil"
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>

                    <div className={`${styles.flex} ${styles.justifyEnd} ${styles.gap2} ${styles.mt6}`}>
                        <button
                            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
                            className={`${styles.px4} ${styles.py2} ${styles.border} ${styles.rounded} ${styles.hoverBgGray100}`}
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
                        placeholder="Cari pengurus..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={styles.btnPrimary}
                    onClick={() => { setFormData(initialFormState); setIsEditing(true); }}
                >
                    <Plus size={18} /> Tambah Pengurus
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th} style={{ width: '50px' }}>Urutan</th>
                            <th className={styles.th}>Foto</th>
                            <th className={styles.th}>Nama Lengkap</th>
                            <th className={styles.th}>Jabatan</th>
                            <th className={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className={`${styles.textCenter} ${styles.p4}`}>Loading...</td></tr>
                        ) : filteredMembers.length === 0 ? (
                            <tr><td colSpan="5" className={`${styles.textCenter} ${styles.p4}`}>Belum ada data pengurus.</td></tr>
                        ) : (
                            filteredMembers.map((member, index) => (
                                <tr key={member.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.reorderWrapper}>
                                            <button
                                                onClick={() => handleMove(member, 'up')}
                                                disabled={index === 0}
                                                className={styles.reorderBtn}
                                                title="Geser ke Atas"
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <span className={styles.orderNumber}>{member.order}</span>
                                            <button
                                                onClick={() => handleMove(member, 'down')}
                                                disabled={index === filteredMembers.length - 1}
                                                className={styles.reorderBtn}
                                                title="Geser ke Bawah"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <User size={20} className={styles.textGray400} />
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.tdMedium}>{member.name}</span>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.inlineFlex} ${styles.itemsCenter} ${styles.px2_5} ${styles.py0_5} ${styles.roundedFull} ${styles.textXs} ${styles.fontMedium} ${styles.bgBlue100} ${styles.textBlue800}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={`${styles.flex} ${styles.gap2}`}>
                                            <button
                                                className={styles.btnIcon}
                                                onClick={() => { setFormData(member); setIsEditing(true); }}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={`${styles.btnIcon} ${styles.btnIconDelete}`}
                                                onClick={() => handleDelete(member.id)}
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
    name: '',
    role: '',
    image: '',
    order: 0
};
