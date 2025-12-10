import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Calendar, BookOpen } from 'lucide-react';
import styles from './page.module.css';
import LatestPosts from '@/components/home/LatestPosts';
import Hero from '@/components/Hero';
import { settingsService } from '@/lib/settingsService';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await settingsService.getSettings();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <Hero settings={settings} />

      {/* Welcome Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <div className="space-y-6">
              <h2 className={styles.welcomeTitle}>
                {settings?.welcome?.title || "Selamat Datang Keluarga Besar"}
              </h2>
              <p className={styles.welcomeText}>
                {settings?.welcome?.description || "Website ini didedikasikan sebagai pusat dokumentasi dan silaturahmi bagi seluruh keturunan. Di sini kita dapat menelusuri jejak sejarah, mempererat hubungan antar cabang keluarga, dan berbagi kabar terkini."}
              </p>
              <div className={styles.quoteBox}>
                <p className={styles.quoteText}>
                  "{settings?.welcome?.quote || "Sipakario, Sipakarennu, Sipatokkong"}"
                </p>
                <p className={styles.quoteAuthor}>- {settings?.welcome?.quoteAuthor || "Nilai Luhur Keluarga"}</p>
              </div>
            </div>
            <div className={styles.imagePlaceholder}>
              {settings?.welcome?.image ? (
                <>
                  <Image
                    src={settings.welcome.image}
                    alt="Foto Keluarga Besar"
                    className={styles.welcomeImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={styles.welcomeOverlay}></div>
                </>
              ) : (
                <>
                  <div className={styles.welcomeOverlay}></div>
                  <div style={{ position: 'relative', zIndex: 20 }}>
                    [Foto Keluarga Besar / Reuni Terbaru]
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Features */}
      < section className={styles.featuresSection} >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Jelajahi RKB-AMB</h2>
            <p className={styles.sectionSubtitle}>
              Temukan berbagai informasi dan fitur yang telah kami siapkan untuk keluarga.
            </p>
          </div>

          <div className={styles.gridThree}>
            <FeatureCard
              icon={<Users size={40} />}
              title="Silsilah Keluarga"
              description="Telusuri garis keturunan dan temukan hubungan kekerabatan antar anggota keluarga."
              link="/family-tree"
            />
            <FeatureCard
              icon={<BookOpen size={40} />}
              title="Sejarah & Arsip"
              description="Pelajari asal-usul keluarga dan akses dokumen sejarah yang berharga."
              link="/history"
            />
            <FeatureCard
              icon={<Calendar size={40} />}
              title="Agenda & Reoni"
              description="Informasi kegiatan silaturahmi, reoni, dan acara keluarga lainnya."
              link="/reunions"
            />
          </div>
        </div>
      </section >

      {/* Latest Posts */}
      < LatestPosts />

      {/* Call to Action */}
      < section className={styles.ctaSection} >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Bergabunglah dengan Database Keluarga</h2>
          <p className={styles.sectionSubtitle} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
            Bantu kami melengkapi data keluarga dengan mendaftarkan diri dan keluarga inti Anda.
          </p>
          <Link href="/contact" className={styles.btnSecondary}>
            Daftar Sekarang
          </Link>
        </div>
      </section >
    </div >
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link href={link} className={styles.featureCard}>
      <div className={styles.featureIcon}>
        {icon}
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
      <div className={styles.featureLink}>
        Selengkapnya <ArrowRight size={16} className="ml-1" />
      </div>
    </Link>
  );
}
