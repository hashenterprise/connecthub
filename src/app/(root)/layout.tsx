import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';
import { ToastProvider } from '@/components/ui/use-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          appearance={{
            baseTheme: 'dark',
            elements: {
              formButtonPrimary: 
                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
              card: 
                'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20',
            }
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <Sidebar />
                <main className="lg:pl-64 pt-24">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}