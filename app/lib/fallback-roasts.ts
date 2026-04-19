export interface FallbackInput {
  username: string
  profileData: any
  language: 'id' | 'en'
}

export function generateFallbackRoast({ username, profileData, language }: FallbackInput): string {
  const followers = profileData?.followers || 0
  const following = profileData?.following || 0
  const posts = profileData?.posts || 0
  const bio = profileData?.bio || profileData?.biography || ''

  const templates = language === 'en'
    ? buildEnglishTemplates({ username, followers, following, posts, bio })
    : buildIndonesianTemplates({ username, followers, following, posts, bio })

  return templates[Math.floor(Math.random() * templates.length)]
}

interface TemplateCtx {
  username: string
  followers: number
  following: number
  posts: number
  bio: string
}

function buildEnglishTemplates({ username, followers, following, posts, bio }: TemplateCtx): string[] {
  return [
    ...(followers < 500 ? [
      `💀 @${username} with ${followers} followers? My dead houseplant has a bigger fanbase! Even your imaginary friends are embarrassed to follow you! 👻`,
      `🔥 ${followers} followers? LMAO! I've seen more people at a gas station at 3AM! Your social media presence is so irrelevant, even spam bots left you on read! 🤣`,
    ] : []),
    ...(following > followers && following > 1000 ? [
      `😭 @${username} following ${following} people but only ${followers} follow back?! This isn't networking, it's digital BEGGING! Your follow button is more worn out than a Netflix "Skip Intro" button! 💀`,
      `🚨 Following ${following} accounts?! Your thumb must be EXHAUSTED from all that desperate tapping! This isn't an Instagram account, it's a digital restraining order waiting to happen! 🤡`,
    ] : []),
    ...(posts > 100 && followers < 1000 ? [
      `🗑️ ${posts} posts but only ${followers} followers?! The algorithm isn't broken, YOUR CONTENT IS! You're posting into the void so much it's starting to echo back "please stop"! 📸`,
      `💩 Posting ${posts} times and still only ${followers} followers?! Even your mom had to mute your notifications! Your feed is like a digital version of screaming into a pillow — nobody hears it and it's probably for the best! 😆`,
    ] : []),
    ...(!bio ? [
      `🤔 Empty bio? What are you, a government agent or just THAT boring? Your personality is as empty as your followers' interest in your existence! 😴`,
      `❓ No bio? Even AI chatbots have more personality than you! You're so basic, water looks spicy in comparison! At least write SOMETHING so people know you're not an abandoned account! 💸`,
    ] : []),
    `🚮 @${username} is the human equivalent of a "Skip Ad" button — everyone's desperate to get past you! Your feed is so tragic it should come with a trigger warning! 😂`,
    `🤡 @${username}'s Instagram is like a museum of mediocrity — lots of exhibits but nobody's visiting! You're giving "main character" energy with "extra in the background who gets cut from the final edit" results! 💀`,
    `⚰️ @${username} is so desperate for attention, you'd probably frame a cease and desist letter just to prove someone noticed you! Your social media strategy is like watching someone try to start a fire with wet matches — painful, pointless, and I can't look away! 🔥`,
    `🧟 Posted ${posts} times and still waiting for that viral moment? Honey, the only thing going viral from your account is second-hand embarrassment! Your content has the shelf life of an open avocado — instantly brown and nobody wants it! ⏳`,
  ]
}

function buildIndonesianTemplates({ username, followers, following, posts, bio }: TemplateCtx): string[] {
  return [
    ...(followers < 500 ? [
      `💀 @${username} dengan ${followers} followers? Kaktus di balkon gue aja punya fans lebih banyak! Bahkan temen khayalan lo aja malu buat follow akun lo! 👻`,
      `🔥 Cuma ${followers} followers? WKWKWK! Warung kopi jam 2 pagi aja lebih rame! Eksistensi lo di sosmed begitu gak penting, sampe bot spam aja males nge-spam lo! 🤣`,
    ] : []),
    ...(following > followers && following > 1000 ? [
      `😭 @${username} ngikutin ${following} orang tapi cuma ${followers} yang follow balik?! Ini bukan networking, ini MENGEMIS DIGITAL! Tombol follow lo lebih aus dari tombol "Skip Intro" Netflix! 💀`,
      `🚨 Following ${following} akun?! Jempol lo pasti CAPEK BANGET dari semua tap desperate itu! Ini bukan akun Instagram, ini calon kasus penuntutan digital! 🤡`,
    ] : []),
    ...(posts > 100 && followers < 1000 ? [
      `🗑️ ${posts} postingan tapi cuma ${followers} followers?! Algoritmanya gak rusak, KONTEN LO YANG RUSAK! Lo posting ke void sampe voidnya mulai nge-echo "tolong berhenti"! 📸`,
      `💩 Posting ${posts} kali tapi masih cuma ${followers} followers?! Bahkan nyokap lo aja harus mute notifikasi lo! Feed lo kayak versi digital dari teriak ke bantal — gak ada yang denger dan emang sebaiknya begitu! 😆`,
    ] : []),
    ...(!bio ? [
      `🤔 Bio kosong? Lo agen rahasia atau emang SEBORING itu? Kepribadian lo sekosong minat followers lo terhadap eksistensi lo! 😴`,
      `❓ Gak ada bio? Bahkan ChatGPT aja punya kepribadian lebih dari lo! Lo tuh so basic, air putih aja kepedesan buat lo! Minimal tulis SESUATU biar orang tau ini bukan akun yang ditinggal kabur! 💸`,
    ] : []),
    `🚮 @${username} adalah versi manusia dari tombol "Skip Ad" — semua orang pengen cepet-cepet ngelewatin lo! Feed lo begitu tragis sampe harusnya dikasih peringatan konten sensitif! 😂`,
    `🤡 Instagram @${username} kayak museum kenormalan — banyak pameran tapi gak ada pengunjung! Lo kira diri lo "main character" padahal aslinya cuma "figuran yang dipotong dari editan final"! 💀`,
    `⚰️ @${username} begitu desperate cari perhatian, lo mungkin bakal ngeramin surat peringatan hukum cuma buat buktiin ada yang merhatiin lo! Strategi sosmed lo kayak nonton orang nyoba nyalain api pake korek basah — menyakitkan, sia-sia, dan gue gak bisa berhenti ngeliatnya! 🔥`,
    `🧟 Udah posting ${posts} kali dan masih nunggu viral? Sayang, satu-satunya hal yang viral dari akun lo adalah rasa malu yang menular! Konten lo punya umur simpan seperti alpukat yang udah dibuka — langsung coklat dan gak ada yang mau! ⏳`,
  ]
}
