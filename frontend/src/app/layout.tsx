import "antd/dist/reset.css";
import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BatterySwap",
  description: "Swap your batteries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
