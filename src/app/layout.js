import localFont from "next/font/local";
import Head from "next/head";
import Link from "next/link";
import "./globals.css";

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

export const metadata = {
  title: "Horoscope AI",
  description: "Gerar de previsões para seu dia a dia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Discover your daily horoscope predictions with Horoscope AI." />
        <meta name="keywords" content="horoscope, astrology, daily predictions, zodiac signs" />
        <meta name="author" content="Horoscope AI Team" />
        <meta property="og:title" content="Horoscope AI - Daily Predictions" />
        <meta property="og:description" content="Discover your daily horoscope predictions with Horoscope AI." />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-black to-blue-900 font-mono`}
      >
        <header>
          <nav className="flex align-items-center font-mono">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
              <Link href="/" className="flex items-center">
                <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
                  {metadata.title}
                </span>
              </Link>
            </div>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}