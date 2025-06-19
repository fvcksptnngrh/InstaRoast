// Instagram Basic Display API - Free but limited
// Documentation: https://developers.facebook.com/docs/instagram-basic-display-api/

interface InstagramBasicProfile {
  id: string
  username: string
  account_type: string
  media_count: number
}

interface InstagramBasicMedia {
  id: string
  caption: string
  media_type: string
  media_url: string
  permalink: string
  thumbnail_url?: string
  timestamp: string
}

export class InstagramBasicAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // Get user profile
  async getUserProfile(): Promise<InstagramBasicProfile> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    
    return response.json()
  }

  // Get user media
  async getUserMedia(limit: number = 20): Promise<InstagramBasicMedia[]> {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${this.accessToken}&limit=${limit}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch user media')
    }
    
    const data = await response.json()
    return data.data || []
  }

  // Get media insights (requires business account)
  async getMediaInsights(mediaId: string): Promise<any> {
    const response = await fetch(
      `https://graph.instagram.com/${mediaId}/insights?metric=engagement,impressions,reach&access_token=${this.accessToken}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch media insights')
    }
    
    return response.json()
  }
}

// Helper function to get access token
export async function getInstagramAccessToken(code: string, clientId: string, clientSecret: string, redirectUri: string) {
  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get access token')
  }

  return response.json()
} 