import { NextRequest, NextResponse } from 'next/server'

// Template roast dalam Bahasa Indonesia gaul
const roastTemplates = [
  "Hadehh {username} nih ya... Punya {followers} followers tapi bio cuma '{bio}' doang, basic banget sih. Tiap hari scroll feed mulu, double tap kanan kiri, padahal konten sendiri garing. Btw rata-rata {averageLikes} likes doang? Mending fokus bikin konten yang bener deh. 🥱",
  
  "Duh {username}, keliatan banget pengen eksis ya? {posts} postingan isinya selfie semua, caption sok deep. Bio lu '{bio}' tuh kek anak twitter 2015 tau ga. Mana pake hashtag {hashtags} lagi, jaman kapan tuh? Pengen viral kali ya, tapi engagement-nya... yha gitu deh 💀",
  
  "Yaelah {username}, {followers} followers tapi kok kontennya gini-gini aja sih? Bio lu '{bio}' tuh udah mainstream banget tau ga. Kek copas dari Pinterest gitu. Mana postingan {posts} kali, tapi yang like cuma temen sekolah doang. Saran sih ya, mending touch grass dulu deh. 😩",
  
  "Eh {username}, {posts} postingan tapi isinya itu-itu mulu. Bio '{bio}' apaan tuh? Sok misterius banget. {followers} followers pasti beli ya? Soalnya yang like cuma {averageLikes} doang, itu juga kayaknya mutual spam deh. Sini gw kasih tips: coba bikin konten yang bener. 🤡",
  
  "Waduh {username} nih... Bio '{bio}' doang udah sok edgy. {posts} postingan isinya OOTD mulu, padahal fitnya b aja. Followers {followers} tapi yang engage cuma circle lu doang. Mending kurangin main Instagram deh, kasian mata gw liat konten lu. 💅"
]

const celebrityRoasts = {
  'cristiano': "Wkwk si {username} nih... Followers {followers} tapi masih aja posting topless mulu. Bio '{bio}' tuh kek LinkedIn template tau ga. Kita tau lu tajir, kita tau lu GOAT, tapi santai dong pose mirror selfie-nya. Mending post tutorial workout deh, daripada pamer abs mulu. Btw itu filter apa lighting sih? 🌟",
  
  'kyliejenner': "Si {username} mah beda ya... {posts} postingan isinya jualan mulu. Bio '{bio}' kek sales pitch, padahal kita tau lu udah auto cuan. {followers} followers mah gampang ya kalo udah famous dari lahir. Tapi gw penasaran deh, itu muka asli apa hasil suntik? Eh tapi keren sih bisnis sense-nya. 💅",
  
  'elonmusk': "Wkwk {username} be like: beli Twitter ga cukup, Instagram juga harus gw kuasain. Bio '{bio}' kepanjangan bgt, kek nulis skripsi. {followers} followers padahal postingan cuma {posts}, flexing banget. Btw itu Tesla autopilot beneran works ga sih? Apa cuma buat konten? 🚀"
}

// Template roast advanced dengan data feed dalam Bahasa Indonesia gaul
const advancedRoastTemplates = [
  "Si {username} nih ya... {posts} postingan tapi yang viral 0. Most liked post cuma {mostLikedLikes} likes doang, itu juga kayaknya mutual spam. Bio '{bio}' tuh udah mainstream banget, copas dari Pinterest ya? Hashtag {hashtags} juga udah expired kali. {followers} followers tapi average likes cuma {averageLikes}? Sus banget sih. 🤨",
  
  "Hadeh {username}... Tiap hari upload {posts} kali, tapi kontennya gitu-gitu doang. Bio '{bio}' apaan tuh? Kek anak Tumblr 2013. Hashtag {hashtags} juga udah ga relevan kali. {averageComments} comments rata-rata? Itu juga pasti mutual engagement ya. Saran sih: coba bikin konten yang ga bikin scroll cepet. 🥱",
  
  "Duh {username}, keliatan banget pengen jadi influencer ya? {posts} postingan tapi yang like cuma {averageLikes} orang. Bio '{bio}' tuh kek caption Pinterest tau ga. Hashtag {hashtags} juga masih dipake? Hello? 2023 calling! Mending fokus bikin personality dulu deh, baru konten. 💅",
  
  "Yaelah {username}, {posts} postingan isinya repost mulu. Bio '{bio}' kek anak quotes, padahal aslinya... yha gitu. {followers} followers tapi average likes cuma {averageLikes}? Make sense sih, soalnya kontennya gitu doang. Btw {averageComments} comments rata-rata? Auto comment ya? 🤡",
  
  "Si {username} pengen eksis banget ya? {posts} postingan tapi ga ada yang memorable. Bio '{bio}' doang udah sok deep. Hashtag {hashtags} juga masih dipake? Move on dong. {followers} followers tapi engagement cuma {averageLikes} rata-rata? Mending touch grass dulu deh, baru balik main IG. 😮‍💨"
]

export async function POST(request: NextRequest) {
  try {
    const { username, profileData, feedData } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username diperlukan' },
        { status: 400 }
      )
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    let roastText = ''

    // Check if we have feed data for more detailed roasting
    if (feedData && feedData.posts && feedData.posts.length > 0) {
      // Use advanced roast template with feed data
      const template = advancedRoastTemplates[Math.floor(Math.random() * advancedRoastTemplates.length)]
      roastText = template
        .replace(/{username}/g, username)
        .replace(/{followers}/g, profileData?.followers?.toLocaleString() || 'beberapa')
        .replace(/{posts}/g, feedData.totalPosts?.toString() || 'beberapa')
        .replace(/{bio}/g, profileData?.bio || 'bio basic')
        .replace(/{averageLikes}/g, feedData.averageLikes?.toString() || '0')
        .replace(/{averageComments}/g, feedData.averageComments?.toString() || '0')
        .replace(/{mostLikedLikes}/g, feedData.mostLikedPost?.like_count?.toString() || '0')
        .replace(/{hashtags}/g, feedData.hashtags?.slice(0, 3).join(', ') || '#viral #fyp')
    } else if (celebrityRoasts[username.toLowerCase() as keyof typeof celebrityRoasts]) {
      // Use celebrity-specific roast
      roastText = celebrityRoasts[username.toLowerCase() as keyof typeof celebrityRoasts]
        .replace(/{username}/g, username)
        .replace(/{followers}/g, profileData?.followers?.toLocaleString() || 'beberapa')
        .replace(/{posts}/g, profileData?.posts?.toString() || 'beberapa')
        .replace(/{bio}/g, profileData?.bio || 'bio basic')
    } else {
      // Use basic template for regular users
      const template = roastTemplates[Math.floor(Math.random() * roastTemplates.length)]
      roastText = template
        .replace(/{username}/g, username)
        .replace(/{followers}/g, profileData?.followers?.toLocaleString() || 'beberapa')
        .replace(/{posts}/g, profileData?.posts?.toString() || 'beberapa')
        .replace(/{bio}/g, profileData?.bio || 'bio basic')
        .replace(/{averageLikes}/g, '0')
        .replace(/{hashtags}/g, '#viral #fyp')
    }

    const roast = {
      roast: roastText,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(roast)
  } catch (error) {
    console.error('Roast API error:', error)
    return NextResponse.json(
      { error: 'Gagal menghasilkan roast' },
      { status: 500 }
    )
  }
} 