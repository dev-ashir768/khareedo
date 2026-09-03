import type { Metadata } from "next";
import { Geist_Mono} from "next/font/google";
// import { sora } from "./fonts";
import "./globals.css";
import { inter } from "./fonts";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "Khareedo — Marketplace",
  description:
    "Your one-stop destination for everything you need. Discover thousands of products, unbeatable deals, and a seamless shopping experience all in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
