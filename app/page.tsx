'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Instagram, Zap, Sparkles, ArrowRight, RefreshCw, Github } from 'lucide-react'
import RoastForm from './components/RoastForm'
import ProfileCard from './components/ProfileCard'
import RoastResult from './components/RoastResult'
import StatsBox from './components/StatsBox'

interface ProfileData {
  username: string
  fullName: string
  bio: string
  followers: number
  following: number
  posts: number
  profilePic: string
  isPrivate: boolean
  isVerified: boolean
}

interface FeedData {
  posts: any[]
  totalPosts: number
  averageLikes: number
  averageComments: number
  engagementRate: number
  mostLikedPost: any
  hashtags: string[]
  mentions: string[]
}

interface RoastData {
  roast: string
  timestamp: string
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [feedData, setFeedData] = useState<FeedData | null>(null)
  const [roastData, setRoastData] = useState<RoastData | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalRoasts: 0,
    todayRoasts: 0,
    lastVictim: '...'
  })
  const [roastError, setRoastError] = useState<string | null>(null)
  const [canAccess, setCanAccess] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState('id')

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateStats = async (username: string) => {
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  }

  const handleRoast = async (inputUsername: string, language: string = 'id') => {
    setCurrentLanguage(language) // Save selected language
    
    if (!inputUsername.trim()) {
      setError(language === 'en' ? 'Please enter a valid Instagram username' : 'Masukkan username Instagram yang valid')
      return
    }

    if (!canAccess) {
      setError(language === 'en' ? 'Rate limit exceeded. Please wait before trying again.' : 'Rate limit terlampaui. Silakan tunggu sebelum mencoba lagi.')
      return
    }

    setIsLoading(true)
    setError('')
    setProfileData(null)
    setFeedData(null)
    setRoastData(null)

    try {
      // 🚀 PARALLEL PROCESSING - Fetch profile and feed simultaneously
      const [profilePromise, feedPromise] = [
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: inputUsername })
        }),
        fetch('/api/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: inputUsername })
        })
      ]

      // Wait for profile first (critical data)
      const profileResponse = await profilePromise
      if (!profileResponse.ok) {
        const errorBody = await profileResponse.json();
        const errorDetails = errorBody.details ? `Detail: ${errorBody.details.join(', ')}` : `Status: ${profileResponse.status}`;
        throw new Error(`Gagal mengambil data profil. ${errorDetails}`);
      }

      const profile = await profileResponse.json()
      setProfileData(profile) // Show profile immediately

      // Wait for feed (optional data) 
      const feedResponse = await feedPromise
      let feed = null
      if (feedResponse.ok) {
        feed = await feedResponse.json()
        setFeedData(feed)
      }

      // Generate roast with both profile and feed data
      const roastResponse = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: inputUsername,
          profileData: profile,
          feedData: feed,
          language: language
        })
      })

      if (!roastResponse.ok) {
        const errorData = await roastResponse.json()
        if (roastResponse.status === 429) {
          throw new Error(errorData.message || 'Rate limit exceeded')
        }
        throw new Error(language === 'en' ? 'Failed to generate roast' : 'Gagal menghasilkan roast')
      }

      const roast = await roastResponse.json()
      setRoastData(roast)
      setUsername(inputUsername)

      // 🚀 Update stats in background (non-blocking)
      updateStats(inputUsername).catch(console.error) // Don't wait for this

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(language === 'en' ? 'An unknown error occurred' : 'Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUsername('')
    setProfileData(null)
    setFeedData(null)
    setRoastData(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg">
              <Flame className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">
              InstaRoaster
            </h1>
          </motion.div>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {currentLanguage === 'en' 
              ? 'Enter an Instagram username and let our savage AI analyze it for you! 🔥'
              : 'Masukkan username Instagram dan biarkan AI julid kami menganalisisnya untukmu! 🔥'
            }
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {!profileData ? (
            <>
              <StatsBox 
                totalRoasts={stats.totalRoasts}
                todayRoasts={stats.todayRoasts}
                lastVictim={stats.lastVictim}
                language={currentLanguage}
              />
              <div className="my-8" />
              <RoastForm 
                onSubmit={handleRoast}
                onLanguageChange={setCurrentLanguage}
                initialLanguage={currentLanguage}
                isLoading={isLoading}
                error={error}
                disabled={!!roastData}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <ProfileCard profile={profileData} language={currentLanguage} />
              
              <RoastResult roast={roastData} language={currentLanguage} />
              
              <motion.button
                onClick={resetForm}
                className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
                {currentLanguage === 'en' ? 'Roast Another Profile' : 'Roast Profil Lain'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="text-center py-10 px-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p className="mb-2 text-sm">
          Crafted by{' '}
          <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary-500">
            Adhi Septian
          </a>
        </p>
        <p className="mb-4 text-sm">
          {currentLanguage === 'en' 
            ? 'Thank you for trying InstaRoaster!'
            : 'Terima kasih telah mencoba InstaRoaster!'
          }
        </p>
        <div className="flex justify-center items-center gap-4 sm:gap-6">
          <a 
            href="https://www.instagram.com/adhisptian" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>adhisptian</span>
          </a>
        </div>
      </footer>
    </div>
  )
}