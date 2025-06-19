import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InstaRoaster - AI Instagram Profile Roaster',
  description: 'Get hilarious AI-generated roasts of Instagram profiles. Enter any username and watch the magic happen!',
  keywords: 'instagram, roast, ai, humor, social media, profile',
  authors: [{ name: 'InstaRoaster' }],
  openGraph: {
    title: 'InstaRoaster - AI Instagram Profile Roaster',
    description: 'Get hilarious AI-generated roasts of Instagram profiles',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {children}
        </div>
      </body>
    </html>
  )
} 