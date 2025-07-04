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
  title: "Bankme | Oferte crédito do jeito certo com o seu Mini Banco",
  description: "Abra sua empresa de crédito de forma simples e barata com a Bankme. Oferte antecipação de recebíveis e empréstimos e rentabilize com o Mini Banco. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
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
