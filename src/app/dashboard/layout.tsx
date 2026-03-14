import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import DashboardShell from '@/components/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token || !verifyToken(token)) redirect('/login');

  const user = verifyToken(token)!;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
