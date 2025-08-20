const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * A generic service to generate content using Gemini.
 * @param {string} prompt The user-defined prompt template.
 * @param {object} contextData The data to be injected into the prompt.
 * @returns {Promise<string>} The AI-generated text.
 */
async function generateWithGemini(prompt, contextData) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found. Returning mock data.');
    return 'Mock AI Response: Gemini API key is not configured. This is a placeholder response.';
  }

  try {
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash-latest';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Replace placeholders like {data} or {articles} in the prompt
    const finalPrompt = prompt.replace(/{(\w+)}/g, (match, key) => {
      const value = contextData[key];
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return value;
    });

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    // Return a more user-friendly error or a fallback
    return 'Error: Could not generate AI content.';
  }
}

module.exports = { generateWithGemini };
