import localFont from "next/font/local";
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 font-mono`}
      >
        <header>
          <nav className="flex align-items-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 font-mono">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
              <Link href="/" className="flex items-center">
                <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">{metadata.title}</span>
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
