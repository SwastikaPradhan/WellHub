'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { account } from '@/lib/appwrite';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await account.get(); // checks if user is logged in
        setLoading(false);
      } catch {
        router.push(`/signup?redirect=${pathname}`); // redirect to signup with redirect URL
      }
    };

    checkUser();
  }, [pathname, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return <>{children}</>;
}
