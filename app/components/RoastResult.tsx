'use client'

import { motion } from 'framer-motion'
import { Flame, Copy, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface RoastData {
  roast: string
  timestamp: string
}

interface RoastResultProps {
  roast: RoastData | null
}

export default function RoastResult({ roast }: RoastResultProps) {
  const [copied, setCopied] = useState(false)
  const [isShareSupported, setIsShareSupported] = useState(false)

  useEffect(() => {
    // This check runs only on the client-side, preventing SSR errors.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof window !== 'undefined' && navigator.share) {
      setIsShareSupported(true)
    }
  }, [])

  const copyToClipboard = async () => {
    if (roast?.roast) {
      try {
        await navigator.clipboard.writeText(roast.roast)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Gagal menyalin teks: ', err)
      }
    }
  }

  const shareRoast = async () => {
    if (roast?.roast && navigator.share) {
      try {
        await navigator.share({
          title: 'Lihat roast savage ini! 🔥',
          text: roast.roast,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Gagal share: ', err)
      }
    }
  }

  if (!roast) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Menunggu hasil roast...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-md">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Hasil Roast
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 mb-6"
      >
        <div className="space-y-4">
          {roast.roast.split('\n').map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-lg leading-relaxed text-gray-800 dark:text-gray-200"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-last sm:order-first"
        >
          Dibuat pada {new Date(roast.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
        </motion.p>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-300 text-sm font-medium"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </motion.button>

          {isShareSupported && (
            <motion.button
              onClick={shareRoast}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
} 