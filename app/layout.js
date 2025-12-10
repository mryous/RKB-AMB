import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "RKB-AMB | Rukun Keluarga Besar Appanna Matoa Barru",
  description: "Website resmi Rukun Keluarga Besar Appanna Matoa Barru. Pusat dokumentasi sejarah dan silaturahmi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
