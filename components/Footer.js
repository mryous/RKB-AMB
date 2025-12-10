import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { settingsService } from '@/lib/settingsService';
import styles from './Footer.module.css';

export default async function Footer() {
    const settings = await settingsService.getSettings();
    const footer = settings?.footer || {};

    // Defaults
    const description = footer.description || 'Rukun Keluarga Besar Appanna Matoa Barru. Melestarikan sejarah, mempererat silaturahmi.';
    const email = footer.email || 'info@rkb-amb.org';
    const phone = footer.phone || '+62 812-3456-7890';
    const address = footer.address || 'Makassar, Sulawesi Selatan';
    const copyright = footer.copyright || `© ${new Date().getFullYear()} RKB-AMB. All rights reserved.`;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brandSection}>
                        <h3 className={styles.brandTitle}>
                            RKB-AMB
                        </h3>
                        <p className={styles.brandDesc}>
                            {description}
                        </p>
                        <div className={styles.socials}>
                            {footer.facebook && (
                                <a href={footer.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Facebook size={20} />
                                </a>
                            )}
                            {footer.instagram && (
                                <a href={footer.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Instagram size={20} />
                                </a>
                            )}
                            {footer.twitter && (
                                <a href={footer.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Twitter size={20} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Menu</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/history" className={styles.link}>Sejarah</Link></li>
                            <li className={styles.linkItem}><Link href="/family-tree" className={styles.link}>Silsilah</Link></li>
                            <li className={styles.linkItem}><Link href="/reunions" className={styles.link}>Reoni</Link></li>
                            <li className={styles.linkItem}><Link href="/gallery" className={styles.link}>Galeri</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Organisasi</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}><Link href="/organization" className={styles.link}>Pengurus</Link></li>
                            <li className={styles.linkItem}><Link href="/organization" className={styles.link}>AD/ART</Link></li>
                            <li className={styles.linkItem}><Link href="/organization" className={styles.link}>Program Kerja</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.sectionTitle}>Kontak</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}>Email: {email}</li>
                            <li className={styles.linkItem}>WhatsApp: {phone}</li>
                            <li className={styles.linkItem}>Sekretariat: {address}</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>{copyright}</p>
                </div>
            </div>
        </footer>
    );
}
