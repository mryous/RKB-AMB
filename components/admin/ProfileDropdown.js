'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings } from 'lucide-react';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch admin settings for avatar
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Failed to fetch settings:', err));
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const handleProfile = () => {
        setIsOpen(false);
        router.push('/admin/profile');
    };

    if (!session) return null;

    const avatarUrl = settings?.general?.adminAvatar || '';
    const username = settings?.general?.adminUsername || session.user?.name || 'Admin';
    const email = settings?.general?.adminEmail || session.user?.email || '';

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={styles.avatarButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Profile menu"
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={username} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        <User size={20} />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{username}</div>
                        <div className={styles.userEmail}>{email}</div>
                    </div>
                    <div className={styles.divider}></div>
                    <button className={styles.menuItem} onClick={handleProfile}>
                        <Settings size={16} />
                        <span>Profile</span>
                    </button>
                    <button className={styles.menuItem} onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
