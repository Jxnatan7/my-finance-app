'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/src/contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import 'react-toastify/dist/ReactToastify.css';
import NoSSR from "@/src/components/NoSSR";


const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <NoSSR>
          <QueryClientProvider client={queryClient}>
              <AuthProvider>
                  <ToastContainer
                      position="top-center"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                  />
                  <html lang="en">
                  <body className={inter.className}>{children}</body>
                  </html>
              </AuthProvider>
          </QueryClientProvider>
      </NoSSR>
  );
}