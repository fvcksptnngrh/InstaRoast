"use client"

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference first
    const isSystemThemeSetToDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = localStorage.getItem('theme')
    
    let shouldBeDark = false
    if (stored) {
      shouldBeDark = stored === 'dark'
    } else {
      shouldBeDark = isSystemThemeSetToDark
    }
    
    setIsDark(shouldBeDark)
    toggleTheme(shouldBeDark)
  }, [])

  useEffect(() => {
    // Add keyboard shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'D') {
        setIsDark(prev => {
          const newTheme = !prev
          toggleTheme(newTheme)
          return newTheme
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = (isChecked: boolean) => {
    if (isChecked) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleToggle = () => {
    setIsDark(prev => {
      const newTheme = !prev
      toggleTheme(newTheme)
      return newTheme
    })
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Sun Icon */}
      <Sun 
        className={`w-5 h-5 transition-colors duration-300 ${
          !isDark ? 'text-yellow-500' : 'text-gray-400'
        }`} 
      />
      
      {/* Toggle Switch */}
      <div className="relative">
        <input
          type="checkbox"
          role="switch"
          id="themingSwitcher"
          checked={isDark}
          onChange={handleToggle}
          className="sr-only"
          aria-label="Toggle dark mode"
        />
        <label
          htmlFor="themingSwitcher"
          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center ${
            isDark ? 'bg-gray-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ml-0.5 ${
              isDark ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </label>
      </div>
      
      {/* Moon Icon */}
      <Moon 
        className={`w-5 h-5 transition-colors duration-300 ${
          isDark ? 'text-blue-400' : 'text-gray-400'
        }`} 
      />
    </div>
  )
}