import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

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
    
    // ✅ FIX: Updated model name and configuration  
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Fixed from "gemini-pro"
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 200,
      },
    })
    
    const prompt = `Buatkan roasting lucu, savage, dan tanpa menggunakan hashtag untuk profil Instagram berikut.\nGunakan bahasa Indonesia yang santai, gaul, dan sering dipakai remaja zaman sekarang.\nPakai kata-kata populer seperti: cringe, vibes, flexing, mager, auto, baper, FOMO, insecure, dll.\nJangan menyinggung SARA. Jawaban maksimal 3 kalimat.\n\nUsername: ${username}\nBio: ${profileData?.bio || profileData?.biography || 'bio basic'}\nJumlah followers: ${profileData?.followers?.toLocaleString() || 'beberapa'}\nJumlah postingan: ${profileData?.posts?.toString() || 'beberapa'}\n`;
    
    console.log('Generating roast for:', username)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const roast = response.text()
    
    return NextResponse.json({
      success: true,
      username,
      profileData,
      roast: roast.trim(),
      model: "gemini-1.5-flash",
      timestamp: new Date().toISOString()
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