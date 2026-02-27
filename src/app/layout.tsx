import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  title: "B2B Client Showcase",
  description: "Next.js Demo for Smart Queue B2B APIs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-50 antialiased selection:bg-indigo-500/30">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
