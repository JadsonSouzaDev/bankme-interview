import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/molecules/footer";


const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Bankme | Offer credit the right way with your Mini Bank",
  description: "Open your credit company simply and affordably with Bankme. Offer receivables anticipation and loans and profit with the Mini Bank.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${nunitoSans.className}`}
      >
        <>
          <Footer />
          <main className="flex h-[50vh] mt-[25vh] relative items-center justify-center">
            {children}
          </main>
          <Toaster position="top-right" />
        </>
      </body>
    </html>
  );
}
