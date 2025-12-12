'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImagePicker from '@/components/admin/ImagePicker';
import styles from './profile.module.css';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        avatar: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Fetch current settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setFormData({
                    username: data.general?.adminUsername || '',
                    email: data.general?.adminEmail || '',
                    phone: data.general?.adminPhone || '',
                    avatar: data.general?.adminAvatar || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch settings:', err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (url) => {
        setFormData(prev => ({ ...prev, avatar: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords if changing
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
                return;
            }
            if (formData.newPassword.length < 6) {
                setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
                return;
            }
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
                // Clear password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal memperbarui profil' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout activePage="profile" title="Profile">
                <div className={styles.loading}>Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="profile" title="Profile">
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {message.text && (
                        <div className={`${styles.message} ${styles[message.type]}`}>
                            {message.text}
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Foto Profil</h2>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarPreview}>
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Avatar" className={styles.avatar} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {formData.username?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                )}
                            </div>
                            <ImagePicker
                                value={formData.avatar}
                                onChange={handleImageSelect}
                                label="Pilih Foto Profil"
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Informasi Akun</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>No. HP</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="+62 xxx-xxxx-xxxx"
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Ubah Password</h2>
                        <p className={styles.sectionDesc}>Kosongkan jika tidak ingin mengubah password</p>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password Saat Ini</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password Baru</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={saving}
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
