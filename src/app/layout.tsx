import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globals.css';
import Toaster from '@/components/ui/toaster';
import { ToastProviderWrapper } from '@/components/ui/use-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Connecthub',
  description: 'A modern social platform with video calls and AI chat',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: 'iconButton',
            logoImageUrl: '/icons/yoom-logo.svg',
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#0E78F9',
            colorBackground: '#1C1F2E',
            colorInputBackground: '#252A41',
            colorInputText: '#fff',
          },
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <body className={`${inter.className} bg-dark-2`}>
            <ToastProviderWrapper>
              <Toaster />
              {children}
            </ToastProviderWrapper>
          </body>
        </ThemeProvider>
      </ClerkProvider>
    </html>
  );
}