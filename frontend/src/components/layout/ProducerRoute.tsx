'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthQuery } from '@/features/auth';

export default function ProducerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthQuery();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const raw = sessionStorage.getItem('accessToken');
    if (!raw || raw === 'null') {
      router.replace('/auth/signin');
      return;
    }

    // Wait for user to load then check type
    if (user && user.user_type !== 'producer') {
      router.replace('/home');
    }
  }, [user, router]);

  if (!user) return null;
  if (user.user_type !== 'producer') return null;

  return <>{children}</>;
}
