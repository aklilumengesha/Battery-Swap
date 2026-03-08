'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthQuery } from '@/features/auth';

export default function AdminRoute({
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

    const token = sessionStorage.getItem('accessToken');
    if (!token || token === 'null') {
      router.replace('/auth/signin');
      return;
    }

    if (
      user &&
      user.user_type !== 'admin' &&
      !user.is_staff
    ) {
      router.replace('/home');
    }
  }, [user]);

  if (!user) return null;

  if (
    user.user_type !== 'admin' &&
    !user.is_staff
  ) return null;

  return <>{children}</>;
}
