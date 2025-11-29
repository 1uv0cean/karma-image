import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeFaceAndSoul(imageBase64: string, quizResults: string[], userDesire: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `
    Analyze this face and the user's specific question/desire to perform a "Cold & Critical Fact-based Face Reading" (냉철한 팩트 관상 분석).
    Tone: Cold, Rational, Critical, Objective, and Direct.
    
    User's Specific Question/Desire: "${userDesire}"
    
    INSTRUCTION: 
    1. The user has provided a specific worry or question above. Address this with COLD HARD FACTS based on their physiognomy.
    2. Do NOT sugarcoat or give vague comforting advice. Be brutally honest about their strengths and fatal weaknesses.
    3. Analyze specific facial features (eyes, nose, mouth, jaw) to back up your claims.
    
    IMPORTANT: All text fields in the JSON output MUST be in Korean (Hangul).
    
    Output JSON with the following fields:
    - era: string (Face Score & Type: e.g., "관상 점수: 88점 / 대기만성형 리더")
    - class: string (One Line Summary: e.g., "초년보다 말년이 빛나는 대기만성형 관상")
    - description: string (Overall Summary: 2-3 sentences directly answering their specific question based on their face.)
    - wealth_tier: string (e.g., "상위 10% 잠재력", "자수성가형 부자", "안정적 중산층")
    - social_tier: string (e.g., "타고난 인싸", "신중한 전략가", "고독한 늑대")
    - personality: string (Detailed Personality Analysis: Analyze their inner character, strengths, and weaknesses based on eyes, eyebrows, and forehead. 3-4 sentences.)
    - wealth: string (Detailed Wealth Luck: Analyze nose, ears, and jawline for financial potential. 3-4 sentences.)
    - love: string (Detailed Love/Relationship Luck: Analyze eyes (tear ducts) and mouth for romantic tendencies. 3-4 sentences.)
    - advice: string (Life Advice: Practical advice to improve their luck and solve their specific problem. 2-3 sentences.)
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
