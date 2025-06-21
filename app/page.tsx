'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Instagram, Zap, Sparkles, ArrowRight, RefreshCw, Github } from 'lucide-react'
import RoastForm from './components/RoastForm'
import ProfileCard from './components/ProfileCard'
import RoastResult from './components/RoastResult'
import Header from './components/Header'
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
    totalRoasts: 145,
    todayRoasts: 23,
    topRoaster: "cristiano",
    averageRating: 4.8
  })

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

  const handleRoast = async (inputUsername: string) => {
    if (!inputUsername.trim()) {
      setError('Masukkan username Instagram yang valid')
      return
    }

    setIsLoading(true)
    setError('')
    setProfileData(null)
    setFeedData(null)
    setRoastData(null)

    try {
      // Fetch profile data
      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername })
      })

      if (!profileResponse.ok) {
        throw new Error('Gagal mengambil data profil')
      }

      const profile = await profileResponse.json()
      setProfileData(profile)

      // Fetch feed data for more detailed roasting
      const feedResponse = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputUsername })
      })

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
          feedData: feed
        })
      })

      if (!roastResponse.ok) {
        throw new Error('Gagal menghasilkan roast')
      }

      const roast = await roastResponse.json()
      setRoastData(roast)
      setUsername(inputUsername)

      // Update stats after successful roast
      await updateStats(inputUsername)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onReset={resetForm} showReset={!!profileData} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              InstaRoaster
            </h1>
          </motion.div>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Masukkan username Instagram dan lihat AI kami membuat roast paling savage! 🔥
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {!profileData ? (
            <>
              <StatsBox 
                totalRoasts={stats.totalRoasts}
                todayRoasts={stats.todayRoasts}
                topRoaster={stats.topRoaster}
                averageRating={stats.averageRating}
              />
              <RoastForm onSubmit={handleRoast} isLoading={isLoading} error={error} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <ProfileCard profile={profileData} />
              
              <RoastResult roast={roastData} />
              
              <motion.button
                onClick={resetForm}
                className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
                Roast Profil Lain
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="mb-4">by adhi septian</p>
        <div className="flex justify-center items-center gap-6">
          <a 
            href="https://www.instagram.com/adhisptian" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </a>
          <a 
            href="https://github.com/fvcksptnngrh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-primary-500 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
} 