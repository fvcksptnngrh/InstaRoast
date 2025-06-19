// Instagram Web Scraping with Puppeteer - Free but risky
// Note: This may violate Instagram's ToS and could get blocked

import puppeteer from 'puppeteer'

interface ScrapedProfile {
  username: string
  fullName: string
  bio: string
  followers: number
  following: number
  posts: number
  profilePic: string
  isPrivate: boolean
  isVerified: boolean
}

interface ScrapedPost {
  id: string
  caption: string
  mediaUrl: string
  likeCount: number
  commentCount: number
  timestamp: string
}

export class InstagramScraper {
  private browser: puppeteer.Browser | null = null

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async scrapeProfile(username: string): Promise<ScrapedProfile | null> {
    if (!this.browser) {
      await this.init()
    }

    try {
      const page = await this.browser!.newPage()
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      // Go to Instagram profile
      await page.goto(`https://www.instagram.com/${username}/`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Wait for content to load
      await page.waitForTimeout(3000)

      // Extract profile data
      const profileData = await page.evaluate(() => {
        // Profile picture
        const profilePic = document.querySelector('img[data-testid="user-avatar"]')?.getAttribute('src') || ''
        
        // Bio
        const bioElement = document.querySelector('[data-testid="user-bio"]')
        const bio = bioElement?.textContent || ''
        
        // Stats
        const statElements = document.querySelectorAll('[data-testid="user-stat"]')
        let posts = 0, followers = 0, following = 0
        
        statElements.forEach((element, index) => {
          const text = element.textContent || ''
          const number = parseInt(text.replace(/[^\d]/g, ''))
          
          if (index === 0) posts = number
          else if (index === 1) followers = number
          else if (index === 2) following = number
        })
        
        // Full name
        const fullNameElement = document.querySelector('[data-testid="user-full-name"]')
        const fullName = fullNameElement?.textContent || username
        
        // Verification status
        const isVerified = !!document.querySelector('[data-testid="user-verified-badge"]')
        
        // Private status
        const isPrivate = !!document.querySelector('[data-testid="user-private-badge"]')
        
        return {
          username,
          fullName,
          bio,
          followers,
          following,
          posts,
          profilePic,
          isPrivate,
          isVerified
        }
      })

      await page.close()
      return profileData

    } catch (error) {
      console.error('Error scraping profile:', error)
      return null
    }
  }

  async scrapeFeed(username: string, limit: number = 10): Promise<ScrapedPost[]> {
    if (!this.browser) {
      await this.init()
    }

    try {
      const page = await this.browser!.newPage()
      
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
      
      // Go to Instagram profile
      await page.goto(`https://www.instagram.com/${username}/`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // Wait for posts to load
      await page.waitForTimeout(3000)

      // Extract posts data
      const postsData = await page.evaluate((postLimit) => {
        const posts: ScrapedPost[] = []
        const postElements = document.querySelectorAll('[data-testid="post"]')
        
        for (let i = 0; i < Math.min(postElements.length, postLimit); i++) {
          const post = postElements[i]
          
          // Extract post data
          const caption = post.querySelector('[data-testid="post-caption"]')?.textContent || ''
          const mediaUrl = post.querySelector('img')?.getAttribute('src') || ''
          const likeCount = parseInt(post.querySelector('[data-testid="post-likes"]')?.textContent?.replace(/[^\d]/g, '') || '0')
          const commentCount = parseInt(post.querySelector('[data-testid="post-comments"]')?.textContent?.replace(/[^\d]/g, '') || '0')
          
          posts.push({
            id: `post_${i}`,
            caption,
            mediaUrl,
            likeCount,
            commentCount,
            timestamp: new Date().toISOString()
          })
        }
        
        return posts
      }, limit)

      await page.close()
      return postsData

    } catch (error) {
      console.error('Error scraping feed:', error)
      return []
    }
  }

  // Alternative method using Instagram's public JSON data
  async scrapePublicData(username: string): Promise<any> {
    try {
      const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch public data')
      }
      
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('Error fetching public data:', error)
      return null
    }
  }
}

// Usage example
export async function scrapeInstagramProfile(username: string) {
  const scraper = new InstagramScraper()
  
  try {
    await scraper.init()
    const profile = await scraper.scrapeProfile(username)
    const feed = await scraper.scrapeFeed(username, 10)
    
    return { profile, feed }
  } finally {
    await scraper.close()
  }
} 