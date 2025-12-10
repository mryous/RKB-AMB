import { Mail, Phone, MapPin, Send } from 'lucide-react';
import styles from './page.module.css';

export default function ContactPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Hubungi Kami</h1>
                        <p className={styles.subtitle}>
                            Pendaftaran anggota baru, saran, atau pertanyaan seputar keluarga besar.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Contact Info */}
                        <div className={styles.infoSection}>
                            <div>
                                <h2 className={styles.infoTitle}>Informasi Kontak</h2>
                                <div className={styles.infoList}>
                                    <ContactItem
                                        icon={<Mail />}
                                        title="Email Resmi"
                                        content="sekretariat@rkb-amb.org"
                                    />
                                    <ContactItem
                                        icon={<Phone />}
                                        title="WhatsApp Admin"
                                        content="+62 812-3456-7890"
                                    />
                                    <ContactItem
                                        icon={<MapPin />}
                                        title="Sekretariat Pusat"
                                        content="Jl. Contoh No. 123, Makassar, Sulawesi Selatan"
                                    />
                                </div>
                            </div>

                            <div className={styles.committeeCard}>
                                <h3 className={styles.committeeTitle}>Pengurus Inti</h3>
                                <ul className={styles.committeeList}>
                                    <li><strong>Ketua Umum:</strong> Bpk. Fulan bin Fulan</li>
                                    <li><strong>Sekjen:</strong> Bpk. Fulan bin Fulan</li>
                                </ul>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>Pendaftaran Anggota Keluarga</h2>
                            <form className={styles.form}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Nama Lengkap</label>
                                        <input type="text" className={styles.input} placeholder="Sesuai KTP" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Panggilan</label>
                                        <input type="text" className={styles.input} placeholder="Nama Panggilan" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Cabang Keluarga</label>
                                    <select className={styles.select}>
                                        <option value="">Pilih Cabang...</option>
                                        <option value="sinosi">Cabang Sinosi - Ijare</option>
                                        <option value="dalle">Cabang Hj. Dalle - H. Mallippang</option>
                                        <option value="sabbang">Cabang Hj. Sabbang - H. Mattarima</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nama Orang Tua (Ayah/Ibu dari AMB)</label>
                                    <input type="text" className={styles.input} placeholder="Nama Orang Tua" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Domisili Saat Ini</label>
                                    <input type="text" className={styles.input} placeholder="Kota, Provinsi" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nomor WhatsApp</label>
                                    <input type="tel" className={styles.input} placeholder="08..." />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Upload Foto (Opsional)</label>
                                    <input type="file" className={styles.input} />
                                </div>

                                <button type="button" className={styles.btnSubmit}>
                                    <Send size={20} /> Kirim Pendaftaran
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon, title, content }) {
    return (
        <div className={styles.contactItem}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <div>
                <h3 className={styles.itemTitle}>{title}</h3>
                <p className={styles.itemContent}>{content}</p>
            </div>
        </div>
    );
}
