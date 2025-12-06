import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
    
    this.maxRetries = 3;
    this.baseDelay = 1000;
  }

  async generateText(prompt, options = {}) {
    return this._retryWithBackoff(async () => {
      const result = await this.textModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    });
  }

  async generateEmbedding(text) {
    return this._retryWithBackoff(async () => {
      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    });
  }

  async generateStructuredOutput(prompt, schema) {
    return this._retryWithBackoff(async () => {
      const fullPrompt = `${prompt}\n\nRespond ONLY with valid JSON matching this structure: ${JSON.stringify(schema)}`;
      
      const result = await this.textModel.generateContent(fullPrompt);
      const responseText = result.response.text();
      
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      try {
        return JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response:', cleanedText);
        throw new Error('AI returned invalid JSON format');
      }
    });
  }

  async _retryWithBackoff(operation) {
    let lastError;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        const isRateLimit = error.message?.includes('429') || 
                           error.message?.includes('rate limit') ||
                           error.message?.includes('quota');
        
        if (!isRateLimit || attempt === this.maxRetries - 1) {
          throw error;
        }
        
        const delay = this.baseDelay * Math.pow(2, attempt);
        console.log(`Rate limit hit, retrying in ${delay}ms... (attempt ${attempt + 1}/${this.maxRetries})`);
        
        await this._sleep(delay);
      }
    }
    
    throw lastError;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default GeminiClient;
