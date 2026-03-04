"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { queryClient } from "../lib/react-query";
import { ThemeContextProvider } from "../contexts";
import AuthLayout from "../components/layout/AuthLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ALL routes that should never go through AuthLayout
  const isAuthPage =
    !pathname || pathname === "/" || pathname.startsWith("/auth/");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        {isAuthPage ? children : <AuthLayout>{children}</AuthLayout>}
      </ThemeContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
