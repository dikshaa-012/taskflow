import Link from 'next/link';
import styles from './auth.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.bg} />
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>TaskFlow</Link>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
