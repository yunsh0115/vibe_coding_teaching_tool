import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { destination, mood, imageBase64, mimeType } = await request.json();

    if (!imageBase64 || !destination || !mood) {
      return Response.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
    });

    const prompt = `이 사진에 있는 사람을 ${destination}에 실제로 여행 온 것처럼 자연스럽게 배치해주세요. 배경은 ${destination}의 유명한 랜드마크나 풍경으로 설정하고, 분위기는 ${mood} 스타일로 만들어주세요. 사람의 얼굴과 외모를 최대한 유지해주세요.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        // @ts-expect-error: responseModalities is supported but not yet in type definitions
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart?.inlineData) {
      return Response.json({ error: "이미지 생성에 실패했습니다." }, { status: 500 });
    }

    return Response.json({
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json({ error: "이미지 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
