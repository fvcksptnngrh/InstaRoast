'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Zap, Sparkles, Globe } from 'lucide-react'

interface RoastFormProps {
  onSubmit: (username: string, language: string) => void
  onLanguageChange?: (language: string) => void
  isLoading: boolean
  error: string
  disabled?: boolean
  initialLanguage?: string
}

export default function RoastForm({ onSubmit, onLanguageChange, isLoading, error, disabled = false, initialLanguage = 'id' }: RoastFormProps) {
  const [username, setUsername] = useState('')
  const [language, setLanguage] = useState(initialLanguage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    onSubmit(username.trim(), language)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/20 dark:ring-black/20"
          >
            <Instagram className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {language === 'en' ? 'Start Savage Analysis' : 'Mulai Analisis Julid'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {language === 'en' ? 'Discover the "red flags" of any profile' : 'Cari tau "red flag" dari sebuah profil'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selector */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Globe className="w-4 h-4 inline mr-1" />
              {language === 'en' ? 'Roast Language' : 'Bahasa Roast'}
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading || disabled}
            >
              <option value="id">🇮🇩 Bahasa Indonesia</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {language === 'en' ? 'Instagram Username' : 'Username Instagram'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-gray-400">@</span>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'en' ? 'e.g: cristiano' : 'misal: cristiano'}
                className="w-full pl-9 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-sm"
            >
              <p className="font-bold mb-1">{language === 'en' ? 'Error Occurred' : 'Terjadi Kesalahan'}</p>
              <p>{error}</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !username.trim() || disabled}
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-primary-500/40 text-lg"
            whileHover={{ scale: (isLoading || disabled) ? 1 : 1.03 }}
            whileTap={{ scale: (isLoading || disabled) ? 1 : 0.97 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                {language === 'en' ? 'Roasting...' : 'Sedang Roasting...'}
              </>
            ) : disabled ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{language === 'en' ? 'Rate Limit Exceeded' : 'Rate Limit Terlampaui'}</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>{language === 'en' ? 'Start Roasting' : 'Mulai Roasting'}</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? 'Powered by DeepSeek AI. Made for entertainment purposes.' 
              : 'Powered by DeepSeek AI. Dibuat untuk tujuan hiburan.'
            }
          </p>
        </div>
      </div>
    </motion.div>
  )
}