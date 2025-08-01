import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/app/lib/rate-limiter'
import { geminiAI } from '@/app/lib/gemini'

// Multi-language prompt generator
function generateRoastPrompt(language: string, username: string, bio: string, followers: number, following: number, posts: number, isPrivate: string): string {
  if (language === 'en') {
    return `Roast @${username} 💀 They have ${followers} followers, ${following} following, ${posts} posts, bio: "${bio}", account is ${isPrivate}. Be savage and funny, use modern slang and emojis. Keep it brutal but clever! 😈🔥`;
  }
  
  // Default Indonesian
  return `Roast @${username} 💀 Dia punya ${followers} followers, ${following} following, ${posts} posts, bionya "${bio}", akunnya ${isPrivate}. Jadi savage tapi lucu, pake bahasa gaul dan emot. Bikin brutal tapi pinter! 😈🔥`;
}

export async function POST(req: NextRequest) {
  // Check if Gemini API key is configured
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'No Gemini API key configured'
    }, { status: 500 })
  }

  let username = ''
  let profileData: any = {}
  let language = 'id' // Default to Indonesian

  try {
    const body = await req.json()
    username = body.username
    profileData = body.profileData
    language = body.language || 'id'
    
    if (!username) {
      return NextResponse.json({
        success: false,
        error: 'Username is required'
      }, { status: 400 })
    }
    
    if (!['id', 'en'].includes(language)) {
      return NextResponse.json({
        success: false,
        error: 'Language must be either "id" or "en"'
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
    
    // ✅ NEW: Multi-language prompt generation
    const bio = profileData?.bio || profileData?.biography || (language === 'id' ? "Tidak ada" : "None");
    const posts = profileData?.posts ?? 0;
    const followers = profileData?.followers || 0;
    const following = profileData?.following || 0;
    const isPrivate = profileData?.isPrivate ? (language === 'id' ? "Private" : "Private") : (language === 'id' ? "Publik" : "Public");
    
    const prompt = generateRoastPrompt(language, username, bio, followers, following, posts, isPrivate);
    
    console.log('--- GENERATING WITH DIRECT & BRUTAL PROMPT ---')
    
    let roast = '';
    let modelUsed = '';
    
    // Use Gemini API
    try {
      console.log('Using Gemini API...');
      if (!geminiAI) {
        throw new Error('Gemini AI client not initialized');
      }
      
      const result = await geminiAI.generateContent(prompt, {
        model: 'gemini-1.5-flash',
        temperature: 0.9, // High temperature for creative responses
        maxOutputTokens: 1000, // Increased token limit for longer roasts
        topP: 1,
        topK: 1
      });
      roast = result.text();
      modelUsed = 'gemini-1.5-flash';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error; // Re-throw the error to be caught by the outer try/catch
    }
    
    return NextResponse.json({
      success: true,
      username,
      profileData,
      roast: roast.trim(),
      model: modelUsed, // Explicitly state the model used
      timestamp: new Date().toISOString(),
      rateLimit: {
        remaining: rateLimitResult.remaining,
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }
    })
    
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    // ✅ FIX: Better fallback roast system with language support
    const fallbackRoast = generateFallbackRoast(username, profileData, language)
    return NextResponse.json({
      success: true,
      username,
      profileData,
      roast: fallbackRoast,
      model: "fallback",
      warning: language === 'en' ? 'Gemini AI temporarily unavailable, using backup roast' : 'Gemini AI sementara tidak tersedia, menggunakan roast cadangan',
      timestamp: new Date().toISOString()
    })
  }
}

// ✅ FIX: Wild and savage fallback roasting with multi-language support
function generateFallbackRoast(username: string, profileData: any, language: string = 'id'): string {
  const followers = profileData?.followers || 0
  const following = profileData?.following || 0
  const posts = profileData?.posts || 0
  const bio = profileData?.bio || profileData?.biography || ''
  
  if (language === 'en') {
    const roastTemplates = [
      // Low followers roasts
      ...(followers < 500 ? [
        `💀 @${username} with ${followers} followers? My dead houseplant has a bigger fanbase! Even your imaginary friends are embarrassed to follow you! 👻`,
        `🔥 ${followers} followers? LMAO! I've seen more people at a gas station at 3AM! Your social media presence is so irrelevant, even spam bots left you on read! 🤣`
      ] : []),
      
      // High following ratio roasts  
      ...(following > followers && following > 1000 ? [
        `😭 @${username} following ${following} people but only ${followers} follow back?! This isn't networking, it's digital BEGGING! Your follow button is more worn out than a Netflix "Skip Intro" button! 💀`,
        `🚨 Following ${following} accounts?! Your thumb must be EXHAUSTED from all that desperate tapping! This isn't an Instagram account, it's a digital restraining order waiting to happen! 🤡`
      ] : []),
      
      // Many posts few followers
      ...(posts > 100 && followers < 1000 ? [
        `🗑️ ${posts} posts but only ${followers} followers?! The algorithm isn't broken, YOUR CONTENT IS! You're posting into the void so much it's starting to echo back "please stop"! 📸`,
        `💩 Posting ${posts} times and still only ${followers} followers?! Even your mom had to mute your notifications! Your feed is like a digital version of screaming into a pillow - nobody hears it and it's probably for the best! 😆`
      ] : []),
      
      // Empty bio roasts
      ...(!bio ? [
        `🤔 Empty bio? What are you, a government agent or just THAT boring? Your personality is as empty as your followers' interest in your existence! 😴`,
        `❓ No bio? Even AI chatbots have more personality than you! You're so basic, water looks spicy in comparison! At least write SOMETHING so people know you're not an abandoned account! 💸`
      ] : []),
      
      // Generic roasts (always available)
      `🚮 @${username} is the human equivalent of a "Skip Ad" button - everyone's desperate to get past you! Your feed is so tragic it should come with a trigger warning! 😂`,
      `🤡 @${username}'s Instagram is like a museum of mediocrity - lots of exhibits but nobody's visiting! You're giving "main character" energy with "extra in the background who gets cut from the final edit" results! 💀`,
      `⚰️ @${username} is so desperate for attention, you'd probably frame a cease and desist letter just to prove someone noticed you! Your social media strategy is like watching someone try to start a fire with wet matches - painful, pointless, and I can't look away! 🔥`,
      `🧟 Posted ${posts} times and still waiting for that viral moment? Honey, the only thing going viral from your account is second-hand embarrassment! Your content has the shelf life of an open avocado - instantly brown and nobody wants it! ⏳`
    ]
    
    return roastTemplates[Math.floor(Math.random() * roastTemplates.length)]
  }
  
  // Indonesian roasts
  const roastTemplates = [
    // Low followers roasts
    ...(followers < 500 ? [
      `💀 @${username} dengan ${followers} followers? Kaktus di balkon gue aja punya fans lebih banyak! Bahkan temen khayalan lo aja malu buat follow akun lo! 👻`,
      `🔥 Cuma ${followers} followers? WKWKWK! Warung kopi jam 2 pagi aja lebih rame! Eksistensi lo di sosmed begitu gak penting, sampe bot spam aja males nge-spam lo! 🤣`
    ] : []),
    
    // High following ratio roasts  
    ...(following > followers && following > 1000 ? [
      `😭 @${username} ngikutin ${following} orang tapi cuma ${followers} yang follow balik?! Ini bukan networking, ini MENGEMIS DIGITAL! Tombol follow lo lebih aus dari tombol "Skip Intro" Netflix! 💀`,
      `🚨 Following ${following} akun?! Jempol lo pasti CAPEK BANGET dari semua tap desperate itu! Ini bukan akun Instagram, ini calon kasus penuntutan digital! 🤡`
    ] : []),
    
    // Many posts few followers
    ...(posts > 100 && followers < 1000 ? [
      `🗑️ ${posts} postingan tapi cuma ${followers} followers?! Algoritmanya gak rusak, KONTEN LO YANG RUSAK! Lo posting ke void sampe voidnya mulai nge-echo "tolong berhenti"! 📸`,
      `💩 Posting ${posts} kali tapi masih cuma ${followers} followers?! Bahkan nyokap lo aja harus mute notifikasi lo! Feed lo kayak versi digital dari teriak ke bantal - gak ada yang denger dan emang sebaiknya begitu! 😆`
    ] : []),
    
    // Empty bio roasts
    ...(!bio ? [
      `🤔 Bio kosong? Lo agen rahasia atau emang SEBORING itu? Kepribadian lo sekosong minat followers lo terhadap eksistensi lo! 😴`,
      `❓ Gak ada bio? Bahkan ChatGPT aja punya kepribadian lebih dari lo! Lo tuh so basic, air putih aja kepedesan buat lo! Minimal tulis SESUATU biar orang tau ini bukan akun yang ditinggal kabur! 💸`
    ] : []),
    
    // Generic roasts (always available)
    `🚮 @${username} adalah versi manusia dari tombol "Skip Ad" - semua orang pengen cepet-cepet ngelewatin lo! Feed lo begitu tragis sampe harusnya dikasih peringatan konten sensitif! 😂`,
    `🤡 Instagram @${username} kayak museum kenormalan - banyak pameran tapi gak ada pengunjung! Lo kira diri lo "main character" padahal aslinya cuma "figuran yang dipotong dari editan final"! 💀`,
    `⚰️ @${username} begitu desperate cari perhatian, lo mungkin bakal ngeramin surat peringatan hukum cuma buat buktiin ada yang merhatiin lo! Strategi sosmed lo kayak nonton orang nyoba nyalain api pake korek basah - menyakitkan, sia-sia, dan gue gak bisa berhenti ngeliatnya! 🔥`,
    `🧟 Udah posting ${posts} kali dan masih nunggu viral? Sayang, satu-satunya hal yang viral dari akun lo adalah rasa malu yang menular! Konten lo punya umur simpan seperti alpukat yang udah dibuka - langsung coklat dan gak ada yang mau! ⏳`
  ]
  
  return roastTemplates[Math.floor(Math.random() * roastTemplates.length)]
}