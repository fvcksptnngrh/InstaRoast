'use client'

import { motion } from 'framer-motion'
import { Flame, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

interface RoastData {
  roast: string
  timestamp: string
}

interface RoastResultProps {
  roast: RoastData | null
}

export default function RoastResult({ roast }: RoastResultProps) {
  const [copied, setCopied] = useState(false)

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
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 card-shadow"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Hasil Roast 🔥
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 mb-6"
      >
        <div className="space-y-4">
          {roast.roast.split('\n').map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Dibuat pada {new Date(roast.timestamp).toLocaleString('id-ID')}
        </motion.p>

        <div className="flex gap-3">
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-300"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Tersalin!' : 'Salin'}
          </motion.button>

          {typeof navigator.share === 'function' && (
            <motion.button
              onClick={shareRoast}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              Bagikan
            </motion.button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg"
      >
        <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
          ⚠️ Ingat: Ini semua hanya untuk bersenang-senang! Jangan diambil hati. 🔥
        </p>
      </motion.div>
    </motion.div>
  )
} 