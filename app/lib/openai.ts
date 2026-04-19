import OpenAI from 'openai'

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface RoastInput {
  username: string
  bio: string
  followers: number
  following: number
  posts: number
  isPrivate: boolean
  language: 'id' | 'en'
}

const SYSTEM_PROMPTS = {
  id: `Lo adalah roaster Instagram paling savage di Indonesia. Gaya lo brutal, lucu, pinter, pake bahasa gaul Jaksel-Indo, dan ga takut nyakitin perasaan. Jangan pake kata-kata kasar yang vulgar, tapi harus tajem dan bikin orang ketawa sekaligus sakit hati. Selalu pake emoji yang relevan. Panjangnya 3-5 kalimat, padat dan nendang.`,
  en: `You are the most savage Instagram roaster on the internet. Your style is brutal, witty, clever, modern internet slang, and unafraid to hurt feelings. Keep it sharp and cutting without being vulgar — make people laugh and wince at the same time. Always use relevant emojis. Keep it 3-5 sentences, punchy and brutal.`,
}

function buildUserPrompt(input: RoastInput): string {
  const { username, bio, followers, following, posts, isPrivate, language } = input
  const privacyLabel = isPrivate
    ? (language === 'id' ? 'Private' : 'Private')
    : (language === 'id' ? 'Publik' : 'Public')

  if (language === 'en') {
    return `Roast this Instagram account:
- Username: @${username}
- Bio: "${bio}"
- Followers: ${followers}
- Following: ${following}
- Posts: ${posts}
- Account: ${privacyLabel}`
  }

  return `Roast akun Instagram berikut:
- Username: @${username}
- Bio: "${bio}"
- Followers: ${followers}
- Following: ${following}
- Posts: ${posts}
- Akun: ${privacyLabel}`
}

export async function generateRoast(input: RoastInput): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not initialized (OPENAI_API_KEY missing)')
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS[input.language] },
      { role: 'user', content: buildUserPrompt(input) },
    ],
    temperature: 0.9,
    max_tokens: 500,
  })

  const text = completion.choices[0]?.message?.content?.trim()
  if (!text) {
    throw new Error('OpenAI returned empty response')
  }
  return text
}
