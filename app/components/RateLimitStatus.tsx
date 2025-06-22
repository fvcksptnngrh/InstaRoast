'use client'

import { useState, useEffect } from 'react'

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
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800">Checking rate limit status...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-red-800">Error: {error}</span>
        </div>
      </div>
    )
  }

  if (!rateLimitInfo) return null

  const getTimeUntilReset = () => {
    const resetTime = new Date(rateLimitInfo.resetTime)
    const now = new Date()
    const diffMs = resetTime.getTime() - now.getTime()
    const diffMinutes = Math.ceil(diffMs / (1000 * 60))
    return diffMinutes
  }

  const isBlocked = !rateLimitInfo.canAccess
  const timeUntilReset = getTimeUntilReset()

  return (
    <div className={`border rounded-lg p-4 mb-4 ${
      isBlocked 
        ? 'bg-red-50 border-red-200' 
        : rateLimitInfo.isActive 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isBlocked ? (
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          ) : rateLimitInfo.isActive ? (
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          
          <div>
            <h3 className={`font-medium ${
              isBlocked ? 'text-red-800' : 
              rateLimitInfo.isActive ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {isBlocked ? 'Rate Limit Exceeded' : 
               rateLimitInfo.isActive ? 'Active Session' : 'Available'}
            </h3>
            <p className={`text-sm ${
              isBlocked ? 'text-red-600' : 
              rateLimitInfo.isActive ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {isBlocked 
                ? `Try again in ${timeUntilReset} minutes`
                : rateLimitInfo.isActive
                  ? 'You can continue using the service'
                  : `${rateLimitInfo.remainingSlots} slots available`
              }
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {rateLimitInfo.activeAccounts}/{rateLimitInfo.maxAccounts} active
          </div>
          <div className="text-xs text-gray-500">
            {rateLimitInfo.windowMinutes}min window
          </div>
        </div>
      </div>
      
      {!isBlocked && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Usage</span>
            <span>{rateLimitInfo.activeAccounts}/{rateLimitInfo.maxAccounts}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(rateLimitInfo.activeAccounts / rateLimitInfo.maxAccounts) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
} 