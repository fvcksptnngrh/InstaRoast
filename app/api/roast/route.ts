import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/app/lib/rate-limiter'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'Gemini API key not configured'
    }, { status: 500 })
  }

  let username = ''
  let profileData: any = {}

  try {
    const body = await req.json()
    username = body.username
    profileData = body.profileData
    
    if (!username) {
      return NextResponse.json({
        success: false,
        error: 'Username is required'
      }, { status: 400 })
    }

    // ✅ NEW: Rate limiting check
    const rateLimitResult = await rateLimiter.checkRateLimit(username)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        message: rateLimitResult.message,
        remaining: rateLimitResult.remaining,
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }, { status: 429 })
    }
    
    // ✅ NEW: Adjust generation config for more creativity
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using the faster Flash model
      generationConfig: {
        temperature: 0.9,      // High creativity, but stable for Flash
        topK: 50,
        topP: 0.95,
        maxOutputTokens: 400,
      },
    })
    
    // ✅ NEW: "Direct & Brutal" Prompt for Gemini Flash
    const bio = profileData?.bio || profileData?.biography || "Tidak ada";
    const posts = profileData?.posts ?? 0;
    const followers = profileData?.followers || 0;
    const following = profileData?.following || 0;
    const isPrivate = profileData?.isPrivate ? "Private" : "Publik";
    
    const prompt = `
[INSTRUCTION]
Your ONLY job is to write a brutal, unfiltered, and sarcastic roast about the following Instagram profile.
Be direct, sharp, and funny. Use modern, casual Indonesian slang.
The only rule is NO SARA and NO physical attacks. Everything else is fair game.

[DATA TO ROAST]
- Username: @${username}
- Bio: "${bio}"
- Followers: ${followers}
- Following: ${following}
- Posts: ${posts}
- Status: ${isPrivate}

[ROASTING EXAMPLES]
- (If bio is empty): Bio aja kosong, gimana mau ngisi hati orang? Fokusnya cuma jadi silent reader story mantan kayaknya.
- (If following > followers): Nge-follow ribuan orang tapi yang follow balik cuma segitu? Ini namanya bukan main sosmed, tapi lagi audisi minta di-notice.
- (If private account): Akun digembok, postingan nol. Ini Instagram atau brankas bank? Isinya pasti cuma kumpulan aib yang takut kesebar.

Now, deliver your roast. No filter.
`;
    
    console.log('--- GENERATING WITH DIRECT & BRUTAL PROMPT ---')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const roast = response.text()
    
    return NextResponse.json({
      success: true,
      username,
      profileData,
      roast: roast.trim(),
      model: "gemini-1.5-flash", // Explicitly state the model used
      timestamp: new Date().toISOString(),
      rateLimit: {
        remaining: rateLimitResult.remaining,
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }
    })
    
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    // ✅ FIX: Better fallback roast system
    const fallbackRoast = generateFallbackRoast(username, profileData)
    return NextResponse.json({
      success: true,
      username,
      profileData,
      roast: fallbackRoast,
      model: "fallback",
      warning: `AI temporarily unavailable, using backup roast`,
      timestamp: new Date().toISOString()
    })
  }
}

// ✅ FIX: Smart fallback roasting
function generateFallbackRoast(username: string, profileData: any): string {
  const followers = profileData?.followers || 0
  const following = profileData?.following || 0
  const posts = profileData?.posts || 0
  const bio = profileData?.bio || profileData?.biography || ''
  
  const roastTemplates = [
    // Low followers roasts
    ...(followers < 500 ? [
      `@${username} dengan ${followers} followers? Auto insecure, bro! 🤣`,
      `${followers} followers? Ini bukan fanbase, ini grup keluarga! 👨‍👩‍👧‍👦`
    ] : []),
    
    // High following ratio roasts  
    ...(following > followers && following > 1000 ? [
      `@${username} ngikutin ${following} orang biar difollback? FOMO parah sih! 😅`
    ] : []),
    
    // Many posts few followers
    ...(posts > 100 && followers < 1000 ? [
      `${posts} postingan tapi followers cuma ${followers}? Cringe vibes banget! 📸`
    ] : []),
    
    // Empty bio roasts
    ...(!bio ? [
      `Bio kosong? Jangan-jangan lagi mager nulis, ya? 😴`,
      `Bio-nya kosong, kayak dompet pas tanggal tua! 💸`
    ] : []),
    
    // Generic roasts (always available)
    `@${username} pengen jadi selebgram tapi yang nge-like cuma temen sendiri! 😂`,
    `@${username} feed-nya vibes random, caption-nya auto baper! 😆`,
    `Udah ${posts} kali posting, viralnya masih loading... Sabar ya! ⏳`
  ]
  
  return roastTemplates[Math.floor(Math.random() * roastTemplates.length)]
}