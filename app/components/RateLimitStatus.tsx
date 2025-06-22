'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface RateLimitInfo {
  isActive: boolean
  activeAccounts: number
  remainingSlots: number
  maxAccounts: number
  windowMinutes: number
  resetTime: string
  canAccess: boolean
}

interface RateLimitStatusProps {
  username: string
  onStatusChange?: (canAccess: boolean) => void
}

export default function RateLimitStatus({ username, onStatusChange }: RateLimitStatusProps) {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRateLimitInfo = async () => {
    if (!username) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/rate-limit?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (data.success) {
        setRateLimitInfo(data.rateLimit)
        onStatusChange?.(data.rateLimit.canAccess)
      } else {
        setError(data.error || 'Failed to get rate limit info')
      }
    } catch (err) {
      setError('Network error')
      console.error('Rate limit fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRateLimitInfo()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRateLimitInfo, 30000)
    return () => clearInterval(interval)
  }, [username])

  if (loading) {
    return (      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500 mr-3"></div>
          <span>Checking API status...</span>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-red-900/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-500/30 mb-8"
      >
        <div className="flex items-center text-red-600 dark:text-red-400">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Error checking API status: {error}</span>
        </div>
      </motion.div>
    )
  }

  if (!rateLimitInfo) return null

  const getTimeUntilReset = () => {
    const resetTime = new Date(rateLimitInfo.resetTime)
    const now = new Date()
    const diffMs = resetTime.getTime() - now.getTime()
    if (diffMs <= 0) return 0
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))
    return diffMinutes
  }

  const isBlocked = !rateLimitInfo.canAccess
  const timeUntilReset = getTimeUntilReset()

  const statusStyles = {
    blocked: {
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800 dark:text-red-300',
      textColor: 'text-red-600 dark:text-red-400',
    },
    active: {
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800 dark:text-green-300',
      textColor: 'text-green-600 dark:text-green-400',
    },
    available: {
      borderColor: 'border-l-yellow-500',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800 dark:text-yellow-300',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    }
  }

  const currentStatus = isBlocked ? 'blocked' : rateLimitInfo.isActive ? 'active' : 'available'
  const styles = statusStyles[currentStatus]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 border-l-4 ${styles.borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-4 ${styles.iconColor}`}>
            {currentStatus === 'blocked' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            )}
            {currentStatus === 'active' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {currentStatus === 'available' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
          </div>
          
          <div>
            <h3 className={`font-bold text-lg ${styles.titleColor}`}>
              {isBlocked ? 'API Limit Reached' : rateLimitInfo.isActive ? 'Active Session' : 'API Ready'}
            </h3>
            <p className={`text-sm ${styles.textColor}`}>
              {isBlocked 
                ? `Please try again in ${timeUntilReset} min`
                : rateLimitInfo.isActive
                  ? 'This user is already active'
                  : `${rateLimitInfo.remainingSlots} new user slots available`
              }
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {rateLimitInfo.activeAccounts}<span className="text-sm font-normal text-gray-500">/{rateLimitInfo.maxAccounts}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Active Users
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-primary-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(rateLimitInfo.activeAccounts / rateLimitInfo.maxAccounts) * 100}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  )
} 