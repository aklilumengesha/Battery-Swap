import "antd/dist/reset.css";
import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
