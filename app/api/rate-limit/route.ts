import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/app/lib/rate-limiter'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({
      success: false,
      error: 'Username parameter is required'
    }, { status: 400 })
  }

  try {
    const rateLimitInfo = await rateLimiter.getRateLimitInfo(username)
    
    return NextResponse.json({
      success: true,
      username,
      rateLimit: {
        isActive: rateLimitInfo.isActive,
        activeAccounts: rateLimitInfo.activeAccounts,
        remainingSlots: rateLimitInfo.remainingSlots,
        maxAccounts: 4,
        windowMinutes: 20,
        resetTime: new Date(rateLimitInfo.resetTime).toISOString(),
        canAccess: rateLimitInfo.isActive || rateLimitInfo.remainingSlots > 0
      }
    })
  } catch (error) {
    console.error('Rate limit info error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get rate limit information'
    }, { status: 500 })
  }
} 