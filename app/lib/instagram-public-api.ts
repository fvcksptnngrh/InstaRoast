// Instagram Public JSON API - Free but limited
// Note: This method may not work consistently as Instagram changes their API

interface PublicProfileData {
  username: string
  fullName: string
  biography: string
  followers: number
  following: number
  posts: number
  profilePicUrl: string
  isPrivate: boolean
  isVerified: boolean
}

interface PublicPostData {
  id: string
  caption: string
  mediaUrl: string
  mediaType: string
  permalink: string
  timestamp: string
}

export class InstagramPublicAPI {
  // Method 1: Using Instagram's public JSON endpoint
  async getPublicProfile(username: string): Promise<PublicProfileData | null> {
    try {
      const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Parse the response based on Instagram's structure
      const user = data.graphql?.user || data.entry_data?.ProfilePage?.[0]?.graphql?.user
      
      if (!user) {
        throw new Error('User data not found in response')
      }

      return {
        username: user.username,
        fullName: user.full_name,
        biography: user.biography || '',
        followers: user.edge_followed_by?.count || 0,
        following: user.edge_follow?.count || 0,
        posts: user.edge_owner_to_timeline_media?.count || 0,
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url,
        isPrivate: user.is_private || false,
        isVerified: user.is_verified || false
      }

    } catch (error) {
      console.error('Error fetching public profile:', error)
      return null
    }
  }

  // Method 2: Using Instagram's web API
  async getPublicProfileWeb(username: string): Promise<PublicProfileData | null> {
    try {
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
        throw new Error('User data not found in response')
      }

      return {
        username: user.username,
        fullName: user.full_name,
        biography: user.biography || '',
        followers: user.edge_followed_by?.count || 0,
        following: user.edge_follow?.count || 0,
        posts: user.edge_owner_to_timeline_media?.count || 0,
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url,
        isPrivate: user.is_private || false,
        isVerified: user.is_verified || false
      }

    } catch (error) {
      console.error('Error fetching public profile (web):', error)
      return null
    }
  }

  // Method 3: Using Instagram's mobile API (more reliable)
  async getPublicProfileMobile(username: string): Promise<PublicProfileData | null> {
    try {
      const response = await fetch(`https://i.instagram.com/api/v1/users/${username}/info/`, {
        headers: {
          'User-Agent': 'Instagram 219.0.0.12.117 Android',
          'Accept': 'application/json',
          'Accept-Language': 'en-US',
          'X-IG-App-ID': '936619743392459',
          'X-IG-WWW-Claim': '0',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const user = data.user

      if (!user) {
        throw new Error('User data not found in response')
      }

      return {
        username: user.username,
        fullName: user.full_name,
        biography: user.biography || '',
        followers: user.follower_count || 0,
        following: user.following_count || 0,
        posts: user.media_count || 0,
        profilePicUrl: user.profile_pic_url,
        isPrivate: user.is_private || false,
        isVerified: user.is_verified || false
      }

    } catch (error) {
      console.error('Error fetching public profile (mobile):', error)
      return null
    }
  }

  // Get public posts (limited data)
  async getPublicPosts(username: string, limit: number = 12): Promise<PublicPostData[]> {
    try {
      const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const user = data.graphql?.user || data.entry_data?.ProfilePage?.[0]?.graphql?.user
      
      if (!user || !user.edge_owner_to_timeline_media?.edges) {
        return []
      }

      const posts = user.edge_owner_to_timeline_media.edges
        .slice(0, limit)
        .map((edge: any) => {
          const node = edge.node
          return {
            id: node.id,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
            mediaUrl: node.display_url,
            mediaType: node.is_video ? 'VIDEO' : 'IMAGE',
            permalink: `https://www.instagram.com/p/${node.shortcode}/`,
            timestamp: new Date(node.taken_at_timestamp * 1000).toISOString()
          }
        })

      return posts

    } catch (error) {
      console.error('Error fetching public posts:', error)
      return []
    }
  }
}

// Usage example
export async function getInstagramPublicData(username: string) {
  const api = new InstagramPublicAPI()
  
  // Try multiple methods for better reliability
  let profile = await api.getPublicProfile(username)
  
  if (!profile) {
    profile = await api.getPublicProfileWeb(username)
  }
  
  if (!profile) {
    profile = await api.getPublicProfileMobile(username)
  }
  
  const posts = await api.getPublicPosts(username, 10)
  
  return { profile, posts }
} 