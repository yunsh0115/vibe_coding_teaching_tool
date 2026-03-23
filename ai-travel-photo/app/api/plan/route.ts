import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { appName, features, target, platform } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
당신은 IT 기획 전문가입니다. 아래 정보를 바탕으로 바이브 코딩(AI 코딩 툴) 실습용 기획서와 단계별 프롬프트를 작성해주세요.

앱 정보:
- 앱 이름: ${appName}
- 주요 기능: ${features.join(", ")}
- 타겟 사용자: ${target}
- 플랫폼: ${platform}
- 기술 스택: Next.js, Tailwind CSS, Gemini API

다음 JSON 형식으로 정확히 응답해주세요. JSON 외의 텍스트는 절대 포함하지 마세요:

{
  "기획서": {
    "앱이름": "앱 이름",
    "한줄소개": "앱을 한 문장으로 설명",
    "개요": "앱의 목적과 가치를 2-3문장으로 설명",
    "주요기능": [
      { "기능명": "기능 이름", "설명": "기능 설명" }
    ],
    "기술스택": [
      { "분류": "프론트엔드", "기술": "Next.js, Tailwind CSS" },
      { "분류": "AI", "기술": "Google Gemini API" },
      { "분류": "배포", "기술": "Vercel" }
    ],
    "화면구성": [
      { "화면명": "화면 이름", "설명": "화면 설명" }
    ]
  },
  "프롬프트": [
    {
      "단계": 1,
      "제목": "프로젝트 초기 설정",
      "설명": "이 단계에서 하는 일 설명",
      "프롬프트": "Claude Code나 Cursor에 그대로 복붙할 수 있는 실제 프롬프트 (구체적이고 상세하게)"
    },
    {
      "단계": 2,
      "제목": "UI 레이아웃 구현",
      "설명": "이 단계에서 하는 일 설명",
      "프롬프트": "Claude Code나 Cursor에 그대로 복붙할 수 있는 실제 프롬프트"
    },
    {
      "단계": 3,
      "제목": "핵심 기능 구현",
      "설명": "이 단계에서 하는 일 설명",
      "프롬프트": "Claude Code나 Cursor에 그대로 복붙할 수 있는 실제 프롬프트"
    },
    {
      "단계": 4,
      "제목": "Gemini API 연동",
      "설명": "이 단계에서 하는 일 설명",
      "프롬프트": "Claude Code나 Cursor에 그대로 복붙할 수 있는 실제 프롬프트"
    },
    {
      "단계": 5,
      "제목": "마무리 및 배포 준비",
      "설명": "이 단계에서 하는 일 설명",
      "프롬프트": "Claude Code나 Cursor에 그대로 복붙할 수 있는 실제 프롬프트"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // JSON 파싱 (```json 블록 처리)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    const data = JSON.parse(jsonText);

    return Response.json(data);
  } catch (error) {
    console.error("Plan generation error:", error);
    return Response.json({ error: "기획서 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
