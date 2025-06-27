'use client'

import { motion } from 'framer-motion'
import { Flame, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold gradient-text flex items-center gap-2">
          <span className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364 1.386l-1.591 1.591M21 12h-2.25m-1.386 6.364l-1.591-1.591M12 21v-2.25m-6.364-1.386l1.591-1.591M3 12h2.25m1.386-6.364l1.591 1.591M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          </span>
          InstaRoaster
        </span>
      </div>
      <ThemeToggle />
    </header>
  )
} 