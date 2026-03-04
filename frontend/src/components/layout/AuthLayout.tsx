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

    try {
      const token = JSON.parse(rawToken);
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();

      if (expired) {
        sessionStorage.clear();
        router.replace(routes.SIGNIN);
      }
    } catch {
      sessionStorage.clear();
      router.replace(routes.SIGNIN);
    }
  }, []); // EMPTY - runs once on mount only

  return <>{children}</>;
};

export default AuthLayout;
