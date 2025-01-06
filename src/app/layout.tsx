"use client"
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import localFont from "next/font/local";
import Layout from '@/app/components/Layout/Layout';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Fredoka } from 'next/font/google';
import { usePathname } from "next/navigation";

const fredoka = Fredoka({
  weight: ['300', '400'],
  subsets: ['latin'],
});


const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700" rel="stylesheet"></link>
        <title>Axis</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${fredoka.className}`}>

        <QueryClientProvider client={queryClient}>

          <Layout>{children}</Layout>
        </QueryClientProvider>

      </body>
    </html>
  );
}



