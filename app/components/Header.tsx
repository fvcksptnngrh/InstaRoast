'use client'

import { motion } from 'framer-motion'
import { Flame, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onReset: () => void
  showReset: boolean
}

export default function Header({ onReset, showReset }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <motion.div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">InstaRoaster</span>
        </motion.div>

        {showReset && (
          <motion.button
            onClick={onReset}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/40 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 font-semibold rounded-lg transition-all duration-200 text-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>
        )}

        <ThemeToggle />
      </div>
    </motion.header>
  )
} 