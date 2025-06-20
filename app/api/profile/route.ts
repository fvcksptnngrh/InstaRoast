import { NextRequest, NextResponse } from 'next/server'

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
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://instagram-data1.p.rapidapi.com/user/info?username=${username}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '1c48ec8e70msh5ca9270d30d4920p13e8a5jsn5c6205d3bc24',
          'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from RapidAPI')
    }

    const data = await response.json()
    const user = data.user
    if (!user) {
      throw new Error('User not found')
    }

    return NextResponse.json({
      username: user.username,
      fullName: user.full_name,
      bio: user.biography || '',
      followers: user.edge_followed_by?.count || 0,
      following: user.edge_follow?.count || 0,
      posts: user.edge_owner_to_timeline_media?.count || 0,
      profilePic: user.profile_pic_url_hd || user.profile_pic_url || `https://picsum.photos/150/150?random=${Math.floor(Math.random() * 1000)}`,
      isPrivate: user.is_private || false,
      isVerified: user.is_verified || false
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
} 