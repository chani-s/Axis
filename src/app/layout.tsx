"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Fredoka } from '@next/font/google';

const roboto = Fredoka({
  weight: ['400', '400'],
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
        <link rel="icon" href="favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700" rel="stylesheet"></link>
        <title>Axis</title>
      </head>
      <body className={roboto.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* <div className={styles.container}> */}

          {/* <img src="/imgs/logo0.png" alt="logo" className={styles.logo} />
      <Link className={styles.navLink} href="/about">אודות</Link>
      <Link className={styles.navLink} href="/login">כניסה</Link>
      <Link className={styles.navLink} href="/signup">הרשמה</Link>
      <Link className={styles.navLink} href="/chat/user">עמוד צ'אט</Link>
      */}
        </QueryClientProvider>
      </body>
    </html>
  );
}



