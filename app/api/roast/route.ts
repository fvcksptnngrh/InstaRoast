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
    
    // ✅ NEW: Adjust generation config for more creativity
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 1.0,      // Max creativity
        topK: 40,            // Widen the choice of next words
        topP: 0.95,          // Standard nucleus sampling
        maxOutputTokens: 250,
      },
    })
    
    // ✅ NEW: Chain-of-Thought Prompting
    const bio = profileData?.bio || profileData?.biography || "Tidak ada bio";
    const posts = profileData?.posts ?? 0;
    const followers = profileData?.followers || 0;
    const following = profileData?.following || 0;
    const isPrivate = profileData?.isPrivate ? "Private" : "Publik";
    
    const prompt = `
Persona: Kamu adalah seorang komika stand-up yang cerdas dan jago observasi. Job-mu adalah melihat profil Instagram dan mengubahnya menjadi materi roasting yang singkat dan ngena.

Tugasmu:
1.  **Pikirkan dulu dalam hati (langkah-demi-langkah):**
    *   Lihat data profil ini: Username: @${username}, Bio: "${bio}", Followers: ${followers}, Following: ${following}, Postingan: ${posts}, Status: ${isPrivate}.
    *   Apa yang aneh atau lucu dari kombinasi data ini? Apakah ada ketidaksesuaian? (misal: followers banyak tapi postingan nol, bio sok bijak tapi akun private, following ribuan tapi followers puluhan).
    *   Pilih SATU sudut pandang paling menarik untuk dijadikan bahan roasting.

2.  **Sampaikan Roast-nya:**
    *   Setelah kamu punya ide, sampaikan roast-nya dalam 1-2 kalimat yang santai, pedas, dan lucu.
    *   Gunakan bahasa tongkrongan yang natural.
    *   Langsung ke intinya, jangan bertele-tele.

Contoh Proses Berpikir:
(Data: @user, Bio: "Live, Laugh, Love", Followers: 100, Postingan: 0, Private: Ya)
1.  *Pikiran:* "Oke, bio-nya klise banget 'Live, Laugh, Love'. Akunnya private, postingan nol. Ini akun jelas buat tujuan spesifik, bukan buat publik. Kombinasi bio positif dengan kelakuan misterius ini lucu."
2.  *Hasil Roast:* "Bio-nya sih 'Live, Laugh, Love', tapi akunnya digembok dan postingan nol. Ini 'Live, Laugh, Love' di story close friends doang ya, sambil ngeliatin story mantan?"

Sekarang, lakukan hal yang sama untuk profil di bawah ini. JANGAN tampilkan proses berpikirmu, hanya sampaikan hasil roast akhirnya.

Data Profil Target:
- Username: @${username}
- Bio: "${bio}"
- Followers: ${followers}
- Following: ${following}
- Postingan: ${posts}
- Status Akun: ${isPrivate}
`;
    
    console.log('--- GENERATING WITH CHAIN-OF-THOUGHT PROMPT ---')
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