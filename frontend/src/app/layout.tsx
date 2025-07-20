import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
          <div className="hidden lg:flex w-full h-[calc(100vh-100px)] gap-x-5 p-5">
            <Sidebar />
            {children}
          </div>
          <div className="bg-white lg:hidden fixed z-[99] top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-y-2">
            <span className="text-center">Not designed for this screen size!</span>
            <span className="text-center">Expand this window or use a device with a wider screen (like a PC)</span>
          </div>
      </body>
    </html>
  );
}
