import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.bg} />
      <nav className={styles.nav}>
        <span className={styles.logo}>TaskFlow</span>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Sign in</Link>
          <Link href="/register" className={styles.navBtn}>Get started</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}>Production-ready · Secure · Fast</div>
        <h1 className={styles.title}>
          Manage tasks<br />
          <span className={styles.accent}>without the chaos</span>
        </h1>
        <p className={styles.subtitle}>
          A full-stack task management app with JWT auth, AES encryption,<br />
          and a clean interface built for real productivity.
        </p>
        <div className={styles.cta}>
          <Link href="/register" className={styles.ctaPrimary}>Start for free</Link>
          <Link href="/login" className={styles.ctaSecondary}>Sign in →</Link>
        </div>
      </section>

      <section className={styles.features}>
        {[
          { icon: '🔐', title: 'Secure Auth', desc: 'JWT in HTTP-only cookies. Passwords hashed with bcrypt. AES payload encryption.' },
          { icon: '⚡', title: 'Fast API', desc: 'Next.js API routes with MongoDB, pagination, filtering, and full-text search.' },
          { icon: '✅', title: 'CRUD Tasks', desc: 'Create, update, delete tasks with status tracking. Your data, only yours.' },
        ].map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
