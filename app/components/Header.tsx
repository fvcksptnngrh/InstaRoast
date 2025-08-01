'use client'

import { motion } from 'framer-motion'
import { Flame, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold gradient-text flex items-center gap-2">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg">
            <Flame className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          InstaRoaster
        </span>
      </div>
      <ThemeToggle />
    </header>
  )
}