'use client'

import { motion } from 'framer-motion'
import { Flame, X } from 'lucide-react'

interface HeaderProps {
  onReset: () => void
  showReset: boolean
}

export default function Header({ onReset, showReset }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">InstaRoaster</span>
        </motion.div>

        {showReset && (
          <motion.button
            onClick={onReset}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
            Reset
          </motion.button>
        )}
      </div>
    </motion.header>
  )
} 