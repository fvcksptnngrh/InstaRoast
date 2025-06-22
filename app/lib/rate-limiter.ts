import { redis } from './redis'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  message?: string
}

export class RateLimiter {
  private readonly windowMs: number = 20 * 60 * 1000 // 20 minutes in milliseconds
  private readonly maxAccounts: number = 4

  async checkRateLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const key = `rate_limit:${identifier}`

    try {
      // Get current active accounts in the time window
      const activeAccounts = await this.getActiveAccounts(windowStart)
      
      // Check if this account is already in the active list
      const isAccountActive = activeAccounts.some(account => account.id === identifier)
      
      if (isAccountActive) {
        // Account is already active, allow access
        return {
          allowed: true,
          remaining: this.maxAccounts - activeAccounts.length,
          resetTime: windowStart + this.windowMs
        }
      }
      
      // Check if we can add a new account
      if (activeAccounts.length >= this.maxAccounts) {
        const oldestAccount = activeAccounts[0]
        const timeUntilReset = oldestAccount.timestamp + this.windowMs - now
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: oldestAccount.timestamp + this.windowMs,
          message: `Rate limit exceeded. Only ${this.maxAccounts} accounts allowed per 20 minutes. Try again in ${Math.ceil(timeUntilReset / 60000)} minutes.`
        }
      }
      
      // Add this account to active list
      await this.addActiveAccount(identifier, now)
      
      return {
        allowed: true,
        remaining: this.maxAccounts - activeAccounts.length - 1,
        resetTime: now + this.windowMs
      }
      
    } catch (error) {
      console.error('Rate limiter error:', error)
      // If Redis fails, allow the request (fail open)
      return {
        allowed: true,
        remaining: 999,
        resetTime: now + this.windowMs
      }
    }
  }

  private async getActiveAccounts(windowStart: number): Promise<Array<{id: string, timestamp: number}>> {
    const key = 'rate_limit:active_accounts'
    const accounts = await redis.zrangebyscore(key, windowStart, '+inf', 'WITHSCORES')
    
    const activeAccounts: Array<{id: string, timestamp: number}> = []
    for (let i = 0; i < accounts.length; i += 2) {
      activeAccounts.push({
        id: accounts[i],
        timestamp: parseInt(accounts[i + 1])
      })
    }
    
    // Sort by timestamp (oldest first)
    return activeAccounts.sort((a, b) => a.timestamp - b.timestamp)
  }

  private async addActiveAccount(identifier: string, timestamp: number): Promise<void> {
    const key = 'rate_limit:active_accounts'
    
    // Add to sorted set with timestamp as score
    await redis.zadd(key, timestamp, identifier)
    
    // Clean up old entries (older than 20 minutes)
    const cutoff = timestamp - this.windowMs
    await redis.zremrangebyscore(key, '-inf', cutoff)
    
    // Set expiry on the key (optional, for cleanup)
    await redis.expire(key, this.windowMs / 1000)
  }

  async getRateLimitInfo(identifier: string): Promise<{
    isActive: boolean
    activeAccounts: number
    remainingSlots: number
    resetTime: number
  }> {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const activeAccounts = await this.getActiveAccounts(windowStart)
    
    const isActive = activeAccounts.some(account => account.id === identifier)
    const remainingSlots = Math.max(0, this.maxAccounts - activeAccounts.length)
    const resetTime = activeAccounts.length > 0 ? activeAccounts[0].timestamp + this.windowMs : now + this.windowMs
    
    return {
      isActive,
      activeAccounts: activeAccounts.length,
      remainingSlots,
      resetTime
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter() 