import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/app/lib/rate-limiter'
import { generateRoast } from '@/app/lib/openai'
import { generateFallbackRoast } from '@/app/lib/fallback-roasts'

type Language = 'id' | 'en'

export async function POST(req: NextRequest) {
  let username = ''
  let profileData: any = {}
  let language: Language = 'id'

  try {
    const body = await req.json()
    username = body.username
    profileData = body.profileData || {}
    language = body.language === 'en' ? 'en' : 'id'

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      )
    }

    const rateLimitResult = await rateLimiter.checkRateLimit(username)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: rateLimitResult.message,
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
        { status: 429 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      const fallbackRoast = generateFallbackRoast({ username, profileData, language })
      return NextResponse.json({
        success: true,
        username,
        profileData,
        roast: fallbackRoast,
        model: 'fallback',
        warning:
          language === 'en'
            ? 'OpenAI not configured, using backup roast'
            : 'OpenAI belum dikonfigurasi, pakai roast cadangan',
        timestamp: new Date().toISOString(),
      })
    }

    try {
      const roast = await generateRoast({
        username,
        bio: profileData?.bio || profileData?.biography || '',
        followers: profileData?.followers || 0,
        following: profileData?.following || 0,
        posts: profileData?.posts ?? 0,
        isPrivate: Boolean(profileData?.isPrivate),
        language,
      })

      return NextResponse.json({
        success: true,
        username,
        profileData,
        roast,
        model: 'gpt-4o',
        timestamp: new Date().toISOString(),
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetTime: new Date(rateLimitResult.resetTime).toISOString(),
        },
      })
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError)
      const fallbackRoast = generateFallbackRoast({ username, profileData, language })
      return NextResponse.json({
        success: true,
        username,
        profileData,
        roast: fallbackRoast,
        model: 'fallback',
        warning:
          language === 'en'
            ? 'OpenAI temporarily unavailable, using backup roast'
            : 'OpenAI sementara tidak tersedia, pakai roast cadangan',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error('Roast route error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
