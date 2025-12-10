import { AuthGuard } from '@/components/auth-guard';
import { AppHeader } from '@/components/app-header';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="Student">
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
