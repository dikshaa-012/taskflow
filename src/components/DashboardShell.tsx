'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './DashboardShell.module.css';
import { JWTPayload } from '@/lib/jwt';

interface Props {
  user: JWTPayload;
  children: React.ReactNode;
}

export default function DashboardShell({ user, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'All Tasks', icon: '▦' },
    { href: '/dashboard?status=pending', label: 'Pending', icon: '○' },
    { href: '/dashboard?status=in-progress', label: 'In Progress', icon: '◑' },
    { href: '/dashboard?status=completed', label: 'Completed', icon: '●' },
  ];

  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/dashboard" className={styles.logo}>TaskFlow</Link>
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userMeta}>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? '…' : 'Sign out'}
          </button>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
