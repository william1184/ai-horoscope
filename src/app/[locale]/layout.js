import AppFooter from '@/components/Footer'; // Import the new Footer component
import AppHeader from '@/components/Header';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import localFont from "next/font/local";
import Head from "next/head";
import { notFound } from 'next/navigation';
import "./globals.css";


const fontFamily = localFont({
  src: [
    {
      path: '../../../public/fonts/GeistMonoVF.woff',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/GeistVF.woff',
      weight: '100 900',
      style: 'bold',
    },
  ],
})

export const metadata = {
  title: "Horoscope AI",
  description: "Gerar de previsões para seu dia a dia",
};

// Function to generate localized metadata
// export async function generateMetadata({ params: { locale } }) {
//   const t = await getTranslator(locale, 'HomePage'); // Load 'HomePage' namespace

//   return {
//     title: t('pageTitle'),
//     description: t('pageDescription'),
//     keywords: t('metaKeywords').split(', '), // Assuming keywords are comma-separated in JSON
//     authors: [{ name: t('metaAuthor') }],
//     openGraph: {
//       title: t('ogTitle'),
//       description: t('ogDescription'),
//     },
//   };
// }

// export const metadata: Metadata = {
//   title: {
//     absolute: 'Horoscope AI | Decentralized AI Search',
//     default: 'Horoscope AI',
//     template: 'Horoscope AI | %s',
//   },
//   description:
//     'Horoscope AI is an assistant for decentralized AI search. Explore the best of internet, near you.',
//   authors: [
//     { name: 'Horoscope AI', url: 'https://ai-horoscope-ten.vercel.app/' },
//     { name: 'Lucas Menezes', url: 'https://william1184.github.io/' },
//   ],
//   icons: {
//     icon: [
//       '/favicon.ico?v=2',
//       '/icon-192x192.png?v=2',
//       '/icon-512x512.png?v=2',
//       '/icon-1024x1024.png?v=2',
//       // 'icon.svg?v=2',
//     ],
//     apple: '/apple-touch-icon.png?v=2',
//   },
//   manifest: '/manifest.json?v=2',
//   applicationName: 'Horoscope AI',
//   //   viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
//   metadataBase: new URL('https://ai-horoscope-ten.vercel.app/'),
//   alternates: {
//     languages: {
//       en: '/en',
//       'pt-BR': '/pt-BR',
//       'zh-CN': '/zh-CN',
//     },
//   },
//   openGraph: {
//     images: '/share.png',
//     type: 'website',
//   },
//   twitter: {
//     site: '@Horoscope AIapp',
//     creator: '@lucasmezs',
//     card: 'summary_large_image',
//     images: '/share.png',
//   },
// }
export const viewport = {
  themeColor: 'white',
}

// export async function generateStaticParams() {
//   return routing.locales.map((locale) => ({
//     locale,
//   }));
// }


export default async function Layout({ children, params }) {
  // const messages = await getMessages(); // Gets all messages for the current locale
  // const t = await getTranslator(locale, 'HomePage'); // For translating strings in this Server Component
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const starCount = 25;
  const generatedStars = Array.from({ length: starCount }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }));

  return (

    <html
      lang={locale}
      className={fontFamily.className}
      suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Discover your daily horoscope predictions with Horoscope AI." />
        <meta name="keywords" content="horoscope, astrology, daily predictions, zodiac signs" />
        <meta name="author" content="Horoscope AI Team" />
        <meta property="og:title" content="Horoscope AI - Daily Predictions" />
        <meta property="og:description" content="Discover your daily horoscope predictions with Horoscope AI." />
      </Head>
      <body
        className={`antialiased bg-gradient-to-b from-black to-blue-900 font-mono`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="absolute inset-0 stars">
            {generatedStars.map((star, index) => (
              <div
                key={index}
                className="star"
                style={{ top: star.top, left: star.left }}
              ></div>
            ))}
          </div>
          <AppHeader metadata={metadata} locale={locale} />
          <main>
            {children}
          </main>
          <AppFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}