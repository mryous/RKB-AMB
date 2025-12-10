'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon, Layout, Type, MousePointer, Palette, Youtube, Plus, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import ImagePicker from '@/components/admin/ImagePicker';
import styles from './page.module.css';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        general: {
            websiteName: 'Rumpun Keluarga Besar Andi Mappangara Bin Andi Mappatola',
            adminEmail: 'admin@rkb-amb.org',
            adminPassword: ''
        },
        logo: {
            url: '',
            alt: '',
            width: 150,
            height: 50
        },
        hero: {
            template: 'static', // video, static, slideshow, news
            backgroundType: 'image',
            backgroundImage: '',
            backgroundVideo: '',
            youtubeUrl: '',
            overlayOpacity: 0.5,
            title: '',
            subtitle: '',
            primaryButton: { text: '', url: '' },
            secondaryButton: { text: '', url: '' },
            slideshowSource: 'random', // random, specific (future)
            newsCount: 3
        },
        origin: {
            title: '',
            description: '',
            image: '',
            imageAlt: ''
        },
        timeline: {
            title: '',
            subtitle: '',
            events: []
        },
        footer: {
            description: 'Rukun Keluarga Besar Appanna Matoa Barru. Melestarikan sejarah, mempererat silaturahmi.',
            email: 'info@rkb-amb.org',
            phone: '+62 812-3456-7890',
            address: 'Makassar, Sulawesi Selatan',
            copyright: 'RKB-AMB. All rights reserved.',
            facebook: '',
            instagram: '',
            twitter: ''
        },
        welcome: {
            title: '',
            description: '',
            quote: '',
            quoteAuthor: '',
            image: ''
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    // Ensure nested objects exist
                    general: { ...prev.general, ...data.general },
                    logo: { ...prev.logo, ...data.logo },
                    hero: { ...prev.hero, ...data.hero },
                    origin: { ...prev.origin, ...data.origin },
                    origin: { ...prev.origin, ...data.origin },
                    timeline: { ...prev.timeline, ...data.timeline },
                    footer: { ...prev.footer, ...data.footer },
                    welcome: { ...prev.welcome, ...data.welcome }
                }));
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Pengaturan berhasil disimpan!');
            } else {
                alert('Gagal menyimpan pengaturan.');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Terjadi kesalahan saat menyimpan.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            logo: { ...prev.logo, [field]: value }
        }));
    };

    const handleHeroChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const handleOriginChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            origin: { ...prev.origin, [field]: value }
        }));
    };



    if (isLoading) {
        return (
            <div className={`${styles.flexCenter} ${styles.h64}`}>
                <div className={`${styles.animateSpin} ${styles.spinner} ${styles.h8} ${styles.w8}`}></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    Umum & Logo
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'hero' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('hero')}
                >
                    Hero Section
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'welcome' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('welcome')}
                >
                    Selamat Datang
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'origin' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('origin')}
                >
                    Asal Usul
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'timeline' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    Timeline
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'footer' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('footer')}
                >
                    Footer
                </button>
            </div>

            {/* General Settings (Logo & Basic Info) */}
            {activeTab === 'general' && (
                <div className={styles.spaceY6}>
                    {/* Basic Info Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Informasi Website</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Website</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.general.websiteName}
                                onChange={e => setSettings(prev => ({ ...prev, general: { ...prev.general, websiteName: e.target.value } }))}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Admin</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={settings.general.adminEmail}
                                onChange={e => setSettings(prev => ({ ...prev, general: { ...prev.general, adminEmail: e.target.value } }))}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password Admin</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={settings.general.adminPassword}
                                onChange={e => setSettings(prev => ({ ...prev, general: { ...prev.general, adminPassword: e.target.value } }))}
                                placeholder="Biarkan kosong jika tidak ingin mengubah"
                            />
                        </div>
                    </div>

                    {/* Logo Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Pengaturan Logo</h3>

                        <div className={styles.formGroup}>
                            <ImagePicker
                                label="Logo Image"
                                value={settings.logo.url}
                                onChange={(url) => handleLogoChange('url', url)}
                            />
                            <p className={styles.helpText}>Recommended size: 150x50px. Supports PNG, SVG.</p>
                        </div>

                        <div className={styles.gridCols2}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Lebar (px)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={settings.logo.width}
                                    onChange={e => setSettings(prev => ({ ...prev, logo: { ...prev.logo, width: parseInt(e.target.value) } }))}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tinggi (px)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={settings.logo.height}
                                    onChange={e => setSettings(prev => ({ ...prev, logo: { ...prev.logo, height: parseInt(e.target.value) } }))}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Alt Text</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.logo.alt}
                                onChange={e => setSettings(prev => ({ ...prev, logo: { ...prev.logo, alt: e.target.value } }))}
                                placeholder="Deskripsi logo untuk aksesibilitas"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Settings */}
            {activeTab === 'hero' && (
                <div className={styles.spaceY6}>
                    {/* Template Selection */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Pilih Template Hero</h3>
                        <div className={styles.gridCols2}>
                            {[
                                { id: 'video', label: 'Video Background', desc: 'Video YouTube full screen tanpa teks overlay.' },
                                { id: 'static', label: 'Static Image', desc: 'Gambar diam dengan teks judul dan tombol.' },
                                { id: 'slideshow', label: 'Slideshow Galeri', desc: 'Carousel foto acak dari galeri dengan judul.' },
                                { id: 'news', label: 'Berita Terkini', desc: 'Slide artikel/berita terbaru otomatis.' }
                            ].map(template => (
                                <div
                                    key={template.id}
                                    className={`${styles.templateCard} ${settings.hero.template === template.id ? styles.activeTemplate : ''}`}
                                    onClick={() => setSettings(prev => ({ ...prev, hero: { ...prev.hero, template: template.id } }))}
                                >
                                    <div className={styles.templateIcon}>
                                        {template.id === 'video' && <Youtube size={24} />}
                                        {template.id === 'static' && <ImageIcon size={24} />}
                                        {template.id === 'slideshow' && <Layout size={24} />}
                                        {template.id === 'news' && <FileText size={24} />}
                                    </div>
                                    <div>
                                        <h4 className={styles.templateTitle}>{template.label}</h4>
                                        <p className={styles.templateDesc}>{template.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Configuration based on Template */}
                    {settings.hero.template === 'video' && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Konfigurasi Video</h3>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>YouTube URL</label>
                                <div className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
                                    <Youtube className={styles.textRed600} />
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={settings.hero.youtubeUrl}
                                        onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, youtubeUrl: e.target.value } }))}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                <p className={styles.helperText}>Video akan diputar otomatis (autoplay), loop, dan mute.</p>
                            </div>
                        </div>
                    )}

                    {settings.hero.template === 'static' && (
                        <>
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Background Image</h3>
                                <div className={styles.formGroup}>
                                    <ImagePicker
                                        label="Upload Background"
                                        value={settings.hero.backgroundImage}
                                        onChange={(url) => handleHeroChange('backgroundImage', url)}
                                    />
                                </div>
                            </div>
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Konten Teks</h3>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Judul Utama</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={settings.hero.title}
                                        onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Sub Judul</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={settings.hero.subtitle}
                                        onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }))}
                                    />
                                </div>
                            </div>
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Tombol Aksi</h3>
                                <div className={styles.gridCols2}>
                                    <div>
                                        <h4 className={`${styles.fontMedium} ${styles.mb3} ${styles.textGray700}`}>Tombol Utama</h4>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Teks</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={settings.hero.primaryButton.text}
                                                onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, primaryButton: { ...prev.hero.primaryButton, text: e.target.value } } }))}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>URL</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={settings.hero.primaryButton.url}
                                                onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, primaryButton: { ...prev.hero.primaryButton, url: e.target.value } } }))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`${styles.fontMedium} ${styles.mb3} ${styles.textGray700}`}>Tombol Kedua</h4>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Teks</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={settings.hero.secondaryButton.text}
                                                onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, secondaryButton: { ...prev.hero.secondaryButton, text: e.target.value } } }))}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>URL</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={settings.hero.secondaryButton.url}
                                                onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, secondaryButton: { ...prev.hero.secondaryButton, url: e.target.value } } }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {settings.hero.template === 'slideshow' && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Konfigurasi Slideshow</h3>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Judul Overlay</label>
                                <textarea
                                    className={styles.textarea}
                                    value={settings.hero.title}
                                    onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                                    placeholder="Judul yang muncul di atas slideshow..."
                                />
                            </div>
                            <p className={styles.helperText}>Slideshow akan mengambil foto secara acak dari Galeri.</p>
                        </div>
                    )}

                    {settings.hero.template === 'news' && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Konfigurasi Berita</h3>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Jumlah Berita Ditampilkan</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={settings.hero.newsCount || 3}
                                    onChange={e => setSettings(prev => ({ ...prev, hero: { ...prev.hero, newsCount: parseInt(e.target.value) } }))}
                                    min="1"
                                    max="10"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Welcome Settings */}
            {activeTab === 'welcome' && (
                <div className={styles.spaceY6}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Section Selamat Datang</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Judul Section</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.welcome.title}
                                onChange={e => setSettings(prev => ({ ...prev, welcome: { ...prev.welcome, title: e.target.value } }))}
                                placeholder="Contoh: Selamat Datang Keluarga Besar"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Deskripsi Sambutan</label>
                            <textarea
                                className={styles.textarea}
                                rows="5"
                                value={settings.welcome.description}
                                onChange={e => setSettings(prev => ({ ...prev, welcome: { ...prev.welcome, description: e.target.value } }))}
                                placeholder="Tuliskan kata sambutan atau deskripsi singkat..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <ImagePicker
                                label="Foto Sambutan (Keluarga/Reuni)"
                                value={settings.welcome.image}
                                onChange={(url) => setSettings(prev => ({ ...prev, welcome: { ...prev.welcome, image: url } }))}
                            />
                            <p className={styles.helperText}>Disarankan foto landscape atau foto bersama.</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Kutipan / Quote</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Isi Kutipan</label>
                            <textarea
                                className={styles.textarea}
                                rows="2"
                                value={settings.welcome.quote}
                                onChange={e => setSettings(prev => ({ ...prev, welcome: { ...prev.welcome, quote: e.target.value } }))}
                                placeholder="Contoh: Sipakario, Sipakarennu, Sipatokkong"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Penulis / Sumber Kutipan</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.welcome.quoteAuthor}
                                onChange={e => setSettings(prev => ({ ...prev, welcome: { ...prev.welcome, quoteAuthor: e.target.value } }))}
                                placeholder="Contoh: Nilai Luhur Keluarga"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Origin Settings */}
            {activeTab === 'origin' && (
                <div className={styles.spaceY6}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Konteks Asal Usul</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Judul Section</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.origin.title}
                                onChange={e => setSettings(prev => ({ ...prev, origin: { ...prev.origin, title: e.target.value } }))}
                                placeholder="Contoh: Asal Usul RKB-AMB"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Deskripsi / Konteks</label>
                            <textarea
                                className={styles.textarea}
                                rows="6"
                                value={settings.origin.description}
                                onChange={e => setSettings(prev => ({ ...prev, origin: { ...prev.origin, description: e.target.value } }))}
                                placeholder="Ceritakan tentang asal usul keluarga besar..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <ImagePicker
                                label="Foto Asal Usul"
                                value={settings.origin.image}
                                onChange={(url) => handleOriginChange('image', url)}
                            />
                            <p className={styles.helpText}>Format: PNG, JPG (Rekomendasi: 800x600px)</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Alt Text Foto</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.origin.imageAlt}
                                onChange={e => setSettings(prev => ({ ...prev, origin: { ...prev.origin, imageAlt: e.target.value } }))}
                                placeholder="Deskripsi foto untuk aksesibilitas"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline Settings */}
            {activeTab === 'timeline' && (
                <div className={styles.spaceY6}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Timeline Perjalanan RKB-AMB</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Judul Timeline</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.timeline.title}
                                onChange={e => setSettings(prev => ({ ...prev, timeline: { ...prev.timeline, title: e.target.value } }))}
                                placeholder="Contoh: Perjalanan RKB-AMB"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Subtitle</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.timeline.subtitle}
                                onChange={e => setSettings(prev => ({ ...prev, timeline: { ...prev.timeline, subtitle: e.target.value } }))}
                                placeholder="Contoh: Sejarah dan Milestone Penting"
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={`${styles.flexBetween} ${styles.mb4}`}>
                            <h3 className={styles.sectionTitle}>Event Timeline</h3>
                            <button
                                className={styles.btnPrimary}
                                onClick={() => {
                                    setSettings(prev => ({
                                        ...prev,
                                        timeline: {
                                            ...prev.timeline,
                                            events: [...prev.timeline.events, { year: '', title: '', description: '' }]
                                        }
                                    }));
                                }}
                            >
                                <Plus size={18} /> Tambah Event
                            </button>
                        </div>

                        {settings.timeline.events && settings.timeline.events.length > 0 ? (
                            <div className={styles.spaceY4}>
                                {settings.timeline.events.map((event, index) => (
                                    <div key={index} className={styles.timelineCard}>
                                        <div className={styles.timelineYearSection}>
                                            <label className={styles.labelSmall}>Tahun</label>
                                            <div className={styles.yearInputWrapper}>
                                                <input
                                                    type="text"
                                                    className={styles.yearInput}
                                                    value={event.year}
                                                    onChange={e => {
                                                        const newEvents = [...settings.timeline.events];
                                                        newEvents[index].year = e.target.value;
                                                        setSettings(prev => ({ ...prev, timeline: { ...prev.timeline, events: newEvents } }));
                                                    }}
                                                    placeholder="YYYY"
                                                />
                                                <Calendar size={14} style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', color: '#d1d5db', pointerEvents: 'none' }} />
                                            </div>
                                        </div>

                                        <div className={styles.timelineContentSection}>
                                            <div>
                                                <label className={styles.labelSmall}>Judul Event</label>
                                                <input
                                                    type="text"
                                                    className={styles.titleInput}
                                                    value={event.title}
                                                    onChange={e => {
                                                        const newEvents = [...settings.timeline.events];
                                                        newEvents[index].title = e.target.value;
                                                        setSettings(prev => ({ ...prev, timeline: { ...prev.timeline, events: newEvents } }));
                                                    }}
                                                    placeholder="Nama peristiwa penting..."
                                                />
                                            </div>
                                            <div>
                                                <label className={styles.labelSmall}>Deskripsi</label>
                                                <textarea
                                                    className={styles.descriptionInput}
                                                    rows="2"
                                                    value={event.description}
                                                    onChange={e => {
                                                        const newEvents = [...settings.timeline.events];
                                                        newEvents[index].description = e.target.value;
                                                        setSettings(prev => ({ ...prev, timeline: { ...prev.timeline, events: newEvents } }));
                                                    }}
                                                    placeholder="Ceritakan detail singkat tentang peristiwa ini..."
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSettings(prev => ({
                                                    ...prev,
                                                    timeline: {
                                                        ...prev.timeline,
                                                        events: prev.timeline.events.filter((_, i) => i !== index)
                                                    }
                                                }));
                                            }}
                                            className={styles.deleteBtnAbsolute}
                                            title="Hapus Event"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`${styles.textCenter} ${styles.py8} ${styles.textGray500}`}>
                                <p>Belum ada event timeline. Klik "Tambah Event" untuk memulai.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Settings */}
            {activeTab === 'footer' && (
                <div className={styles.spaceY6}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Informasi Footer</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Deskripsi Singkat</label>
                            <textarea
                                className={styles.textarea}
                                rows="3"
                                value={settings.footer.description}
                                onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }))}
                                placeholder="Deskripsi singkat tentang organisasi..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Teks Copyright</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={settings.footer.copyright}
                                onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, copyright: e.target.value } }))}
                                placeholder="Contoh: RKB-AMB. All rights reserved."
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Kontak & Alamat</h3>

                        <div className={styles.gridCols2}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    value={settings.footer.email}
                                    onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, email: e.target.value } }))}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>No. WhatsApp / Telepon</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={settings.footer.phone}
                                    onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, phone: e.target.value } }))}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Alamat Sekretariat</label>
                            <textarea
                                className={styles.textarea}
                                rows="2"
                                value={settings.footer.address}
                                onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, address: e.target.value } }))}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Social Media</h3>
                        <div className={styles.gridCols2}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Facebook URL</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={settings.footer.facebook}
                                    onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, facebook: e.target.value } }))}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Instagram URL</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={settings.footer.instagram}
                                    onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, instagram: e.target.value } }))}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Twitter / X URL</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={settings.footer.twitter}
                                    onChange={e => setSettings(prev => ({ ...prev, footer: { ...prev.footer, twitter: e.target.value } }))}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Action */}
            <div className={styles.actions}>
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <Save size={20} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </div>
    );
}
