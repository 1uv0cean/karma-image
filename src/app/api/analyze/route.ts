import { analyzeFaceAndSoul } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, quizResults, userDesire, lang } = body;

    if (!image || !quizResults) {
      return NextResponse.json(
        { error: "Missing image or quiz results" },
        { status: 400 }
      );
    }

    const analysis = await analyzeFaceAndSoul(image, quizResults, userDesire || "General Fortune", lang || "ko");
    
    // Image generation removed as per new requirements
    const generatedImage = null;

    return NextResponse.json({ ...analysis, generatedImage });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}
