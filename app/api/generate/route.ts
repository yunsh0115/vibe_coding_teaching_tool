import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, companion, occupation } = await request.json();

    if (!destination || !startDate || !endDate) {
      return Response.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
당신은 여행 전문 플래너입니다. 아래 정보를 바탕으로 상세한 여행 일정을 작성해주세요.

여행지: ${destination}
출발일: ${startDate}
귀국일: ${endDate}
동행: ${companion ?? "혼자"}
직업: ${occupation ?? "직장인"}

다음 JSON 스키마에 맞게 응답해주세요:

{
  "destination": string,
  "duration": string,
  "summary": string,
  "tips": [string, string, string],
  "days": [
    {
      "day": number,
      "date": string,
      "title": string,
      "schedule": [
        {
          "time": string,
          "place": string,
          "activity": string,
          "category": "식사" | "관광" | "이동" | "숙박" | "쇼핑"
        }
      ]
    }
  ]
}

각 날짜마다 아침/점심/저녁 식사와 관광 명소를 포함한 5-7개 일정을 작성하세요.
동행 유형과 직업을 고려해 여행 스타일을 맞춰주세요. 예를 들어 가족과 함께라면 가족 친화적 코스, 직장인이라면 효율적인 일정으로 작성해주세요.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const data = JSON.parse(text);

    return Response.json(data);
  } catch (error) {
    console.error("Gemini API error:", error);
    return Response.json({ error: "일정 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
