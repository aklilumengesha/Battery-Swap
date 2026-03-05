"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routes } from "../../routes";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const didCheck = useRef(false);

  useEffect(() => {
    // Run ONCE only, never again
    if (didCheck.current) return;
    didCheck.current = true;

    const rawToken = sessionStorage.getItem('accessToken');
    if (!rawToken || rawToken === 'null') {
      router.replace(routes.SIGNIN);
      return;
    }

    let tokenValid = false;
    let userType = '';

    try {
      const token = JSON.parse(rawToken);
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        tokenValid = payload.exp * 1000 > Date.now();
      }
    } catch {
      tokenValid = false;
    }

    if (!tokenValid) {
      sessionStorage.clear();
      router.replace(routes.SIGNIN);
      return;
    }

    // Read user_type from sessionStorage cache
    const rawUser = sessionStorage.getItem('user');
    if (rawUser) {
      try {
        const cachedUser = JSON.parse(rawUser);
        userType = cachedUser?.user_type || '';
      } catch {
        // Ignore parse errors
      }
    }

    // Define page categories
    const PRODUCER_PAGES = ['/producer'];
    const CONSUMER_PAGES = ['/home', '/history', '/my-plan', '/pricing', '/scanner'];

    const isProducerPage = PRODUCER_PAGES.some(page => pathname.startsWith(page));
    const isConsumerPage = CONSUMER_PAGES.some(page => pathname.startsWith(page));

    // If producer visits consumer page, redirect to producer dashboard
    if (tokenValid && isConsumerPage && userType === 'producer') {
      router.replace('/producer/dashboard');
      return;
    }

    // If consumer visits producer page, redirect to home
    if (tokenValid && isProducerPage && userType === 'consumer') {
      router.replace('/home');
      return;
    }
  }, []); // EMPTY - runs once on mount only

  return <>{children}</>;
};

export default AuthLayout;
