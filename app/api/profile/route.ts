import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

// Instagram Public API - No login required
async function fetchInstagramPublicProfile(username: string) {
  try {
    // Method 1: Instagram Web API (most reliable)
    const response = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const user = data.data?.user

    if (!user) {
      throw new Error('User data not found')
    }

    return {
      username: user.username,
      fullName: user.full_name,
      bio: user.biography || '',
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0,
      profilePic: user.profile_pic_url_hd || user.profile_pic_url || `https://picsum.photos/150/150?random=${Math.floor(Math.random() * 1000)}`,
      isPrivate: user.is_private || false,
      isVerified: user.is_verified || false
    }

  } catch (error) {
    console.error('Error fetching Instagram profile:', error)
    return null
  }
}

// Fallback mock data for development
const mockProfiles = {
  'cristiano': {
    username: 'cristiano',
    fullName: 'Cristiano Ronaldo',
    bio: 'Football player. CR7. Family man. 🏆⚽️',
    followers: 620000000,
    following: 555,
    posts: 3956,
    profilePic: 'https://picsum.photos/150/150?random=1',
    isPrivate: false,
    isVerified: true
  },
  'kyliejenner': {
    username: 'kyliejenner',
    fullName: 'Kylie Jenner',
    bio: 'Kylie Cosmetics by Kylie Jenner 💄',
    followers: 400000000,
    following: 100,
    posts: 1234,
    profilePic: 'https://picsum.photos/150/150?random=2',
    isPrivate: false,
    isVerified: true
  },
  'elonmusk': {
    username: 'elonmusk',
    fullName: 'Elon Musk',
    bio: 'Mars, cars, rockets, AI, robots, solar, batteries, tunnels, brain chips, boring company, xAI, Tesla, SpaceX, Neuralink',
    followers: 180000000,
    following: 500,
    posts: 567,
    profilePic: 'https://picsum.photos/150/150?random=3',
    isPrivate: false,
    isVerified: true
  }
}

export async function POST(request: NextRequest) {
  const { username } = await request.json()
  const errorLog: string[] = []
  const cacheKey = `profile_cache:${username}`
  const CACHE_DURATION_SECONDS = 2 * 60 * 60 // 2 jam

  if (!username) {
    return NextResponse.json({ error: 'Username wajib diisi' }, { status: 400 })
  }

  // --- Metode 0: Cek Redis Cache ---
  try {
    const cachedProfile = await redis.get(cacheKey)
    if (cachedProfile) {
      console.log(`SUCCESS: Data found for ${username} in Redis Cache.`);
      return NextResponse.json(JSON.parse(cachedProfile as string))
    }
  } catch (err: any) {
    errorLog.push(`Redis Cache Read Exception: ${err.message}`)
  }

  // --- Metode 1: Coba RapidAPI (Instagram Looter 2) ---
  try {
    const response = await fetch(
      `https://instagram-looter2.p.rapidapi.com/profile2?username=${username}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
          'X-RapidAPI-Host': 'instagram-looter2.p.rapidapi.com',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      let user = data.data || data.user || data;
      if (user && user.username) {
        console.log('SUCCESS: Data found via RapidAPI.');
        const profileData = {
          username: user.username,
          fullName: user.full_name || user.fullName,
          bio: user.biography || user.bio,
          followers: user.edge_followed_by?.count ?? user.follower_count ?? 0,
          following: user.edge_follow?.count ?? user.following_count ?? 0,
          posts: user.edge_owner_to_timeline_media?.count ?? user.media_count ?? 0,
          profilePic: user.profile_pic_url_hd || user.profile_pic_url,
          isPrivate: user.is_private ?? false,
          isVerified: user.is_verified ?? false,
        };

        // Simpan ke cache
        try {
          await redis.set(cacheKey, JSON.stringify(profileData), { ex: CACHE_DURATION_SECONDS });
          console.log(`CACHE: Profile for ${username} stored in Redis for ${CACHE_DURATION_SECONDS}s.`);
        } catch (cacheErr: any) {
           errorLog.push(`Redis Cache Write Exception: ${cacheErr.message}`);
        }

        return NextResponse.json(profileData);
      }
    } else {
      const errorText = await response.text();
      errorLog.push(`RapidAPI Gagal (Status: ${response.status}). Respons: ${errorText.substring(0, 100)}...`);
    }
  } catch (err: any) {
    errorLog.push(`RapidAPI Exception: ${err.message}`);
  }
  
  // --- Metode 2: Fallback ke Direct Instagram API ---
  try {
    const user = await fetchInstagramPublicProfile(username)
    if (user) {
      console.log('SUCCESS: Data found via Direct Instagram Fetch.');
      return NextResponse.json(user)
    } else {
      errorLog.push('Direct Instagram Fetch Gagal: Fungsi mengembalikan null.');
    }
  } catch (err: any) {
     errorLog.push(`Direct Instagram Exception: ${err.message}`);
  }

  // --- Metode 3: Fallback ke Mock Data ---
  if (username in mockProfiles) {
    console.log('SUCCESS: Data found in Mock Profiles.');
    return NextResponse.json(mockProfiles[username as keyof typeof mockProfiles])
  } else {
    errorLog.push('Data tidak ditemukan di Mock Profiles.');
  }

  // --- Jika Semua Gagal ---
  console.error("FINAL FAILURE: All methods failed.", errorLog);
  return NextResponse.json(
    { 
      error: 'Gagal mengambil data profil setelah mencoba semua metode.',
      details: errorLog 
    },
    { status: 500 }
  )
} 