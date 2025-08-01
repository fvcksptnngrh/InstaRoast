// Gemini API Integration

/**
 * Gemini API client for generating AI responses
 * Documentation: https://ai.google.dev/docs
 */

export class GeminiAI {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate content using Gemini API
   * @param prompt The prompt to generate content from
   * @param options Additional options for the API call
   * @returns The generated text response
   */
  async generateContent(prompt: string, options: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  } = {}) {
    const {
      model = 'gemini-1.5-flash',
      temperature = 0.9,
      maxOutputTokens = 1000,
      topP = 1,
      topK = 1
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens,
            topP,
            topK
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        text: () => text,
        response: {
          text: () => text
        }
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

// Create and export Gemini client instance
export const geminiAI = process.env.GEMINI_API_KEY
  ? new GeminiAI(process.env.GEMINI_API_KEY)
  : null;