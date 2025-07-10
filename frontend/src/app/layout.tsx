import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ['300','400','500','700','800'], 
  display: "swap", 
});

export const metadata: Metadata = {
  title: "Registrations Forecasting",
  description: "A tool for forecasting number of registrations before the event begins",
  icons: "/favicon.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-[#F1F3F5]`}>
          <Header />
          <div className="w-full h-[calc(100vh-100px)] flex gap-x-5 p-5">
            <Sidebar />
            {children}
          </div>
      </body>
    </html>
  );
}
