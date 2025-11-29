import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeFaceAndSoul(imageBase64: string, quizResults: string[], userDesire: string, lang: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const languageMap: Record<string, string> = {
    ko: "Korean (Hangul)",
    en: "English",
    ja: "Japanese",
    th: "Thai"
  };

  const targetLanguage = languageMap[lang] || "Korean (Hangul)";

  const prompt = `
    Analyze this face and the user's specific question/desire to perform a "Cold & Critical Fact-based Face Reading" (냉철한 팩트 관상 분석).
    Tone: Cold, Rational, Critical, Objective, and Direct.
    
    User's Specific Question/Desire: "${userDesire}"
    
    INSTRUCTION: 
    1. The user has provided a specific worry or question above. Address this with COLD HARD FACTS based on their physiognomy.
    2. Do NOT sugarcoat or give vague comforting advice. Be brutally honest about their strengths and fatal weaknesses.
    3. Analyze specific facial features (eyes, nose, mouth, jaw) to back up your claims.
    4. **CRITICAL**: The \`user_question_answer\` field MUST directly and specifically answer the user's question/desire. Do not give generic advice here.
    
    IMPORTANT: All text fields in the JSON output MUST be in ${targetLanguage}.
    
    Output JSON with the following fields:
    - era: string (Face Score & Type: e.g., "Face Score: 88 / Late Bloomer Leader")
    - class: string (One Line Summary: e.g., "A late bloomer whose later years shine brighter than their early ones")
    - user_question_answer: string (Direct Answer: A specific, 3-4 sentence answer to the user's question "${userDesire}". Use physiognomy evidence.)
    - wealth_tier: string (e.g., "Top 10% Potential", "Self-made Rich", "Stable Middle Class")
    - social_tier: string (e.g., "Born Insider", "Cautious Strategist", "Lone Wolf")
    - personality: string (Detailed Personality Analysis: Analyze their inner character, strengths, and weaknesses based on eyes, eyebrows, and forehead. 3-4 sentences.)
    - wealth: string (Detailed Wealth Luck: Analyze nose, ears, and jawline for financial potential. 3-4 sentences.)
    - love: string (Detailed Love/Relationship Luck: Analyze eyes (tear ducts) and mouth for romantic tendencies. 3-4 sentences.)
    - advice: string (Life Advice: Practical advice to improve their luck and solve their specific problem. 2-3 sentences.)
    
    **CRITICAL**: Ensure 'era', 'class', 'wealth_tier', and 'social_tier' are ALSO translated into ${targetLanguage}. Do NOT output them in Korean unless the target language is Korean.
  `;

  // Remove data:image/jpeg;base64, prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();
  
  // Clean up markdown code blocks if present
  const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  try {
    const analysisData = JSON.parse(jsonStr);
    return {
      ...analysisData,
      generatedImage: null // No image generation
    };
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    // Fallback
    return {
      era: "분석 불가",
      class: "다시 시도해주세요",
      description: "얼굴을 인식하지 못했습니다. 더 선명한 사진으로 다시 시도해주세요.",
      wealth_tier: "알 수 없음",
      social_tier: "알 수 없음",
      personality: "분석 실패",
      wealth: "분석 실패",
      love: "분석 실패",
      advice: "다시 시도해주세요",
      generatedImage: null
    };
  }
}
