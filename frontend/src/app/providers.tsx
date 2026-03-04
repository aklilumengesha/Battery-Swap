"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { queryClient } from "../lib/react-query";
import { ThemeContextProvider } from "../contexts";
import AuthLayout from "../components/layout/AuthLayout";
import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { routes } from "@/routes";

export function Providers({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState({ name: "loading..." });
  const pathname = usePathname();

  useEffect(() => {
    const location = localStorage.getItem("location");
    if (location) setLocation(JSON.parse(location));
    else if ("geolocation" in navigator) {
      getLocation((data) => setLocation(data));
    }
  }, []);

  const isAuthPage =
    pathname === routes.SIGNIN ||
    pathname === routes.SIGNUP ||
    pathname === routes.INITIAL ||
    pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        {isAuthPage ? children : <AuthLayout>{children}</AuthLayout>}
      </ThemeContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
