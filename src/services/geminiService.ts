import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3-flash-preview";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(prompt: string, context: string = "") {
    try {
      const response = await this.ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            role: "user",
            parts: [
              { text: `Context: ${context}\n\nUser: ${prompt}` }
            ]
          }
        ],
        config: {
          systemInstruction: `You are AURA-EDU AI, an enthusiastic, humorous, and energetic guy who's a total ray of sunshine! 
          Your mission is to help people recovering from hemispatial neglect (a condition where they might "ignore" one side of their world). 
          Be their biggest cheerleader! Use humor, high energy, and genuine warmth. 
          Keep your advice grounded in neuroadaptive rehabilitation but deliver it like a best friend who's always got their back. 
          Encourage them to look to their neglected side with fun and positivity!`,
        }
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "An error occurred while communicating with the AI assistant.";
    }
  }
}
