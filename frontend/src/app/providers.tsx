"use client";

import { Provider } from "react-redux";
import { store } from "../redux";
import { ThemeContextProvider } from "../contexts";
import { AuthLayout } from "../layouts";
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
    <Provider store={store}>
      <ThemeContextProvider>
        <AuthLayout location={location}>{children}</AuthLayout>
      </ThemeContextProvider>
    </Provider>
  );
}
