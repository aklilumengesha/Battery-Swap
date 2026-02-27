"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../lib/react-query";
import { ThemeContextProvider } from "../contexts";
import AuthLayout from "../components/layout/AuthLayout";
import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";

export function Providers({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState({ name: "loading..." });

  useEffect(() => {
    const location = localStorage.getItem("location");
    if (location) setLocation(JSON.parse(location));
    else if ("geolocation" in navigator) {
      getLocation((data) => setLocation(data));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthLayout location={location}>{children}</AuthLayout>
      </ThemeContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
