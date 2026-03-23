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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
당신은 시니어 풀스택 개발자이자 AI 코딩 툴 전문가입니다.
아래 앱 정보를 바탕으로 기획서와, 안티그래비티(AI 코딩 툴)에 그대로 복붙하면 즉시 개발이 가능한 수준의 단계별 프롬프트를 작성하세요.

앱 정보:
- 앱 이름: ${appName}
- 주요 기능: ${features.join(", ")}
- 타겟 사용자: ${target}
- 플랫폼: ${platform ?? "웹 (PC/모바일)"}
- 기술 스택: Next.js 14 (App Router), Tailwind CSS, TypeScript, Gemini API (@google/generative-ai)

프롬프트 작성 규칙:
1. 각 프롬프트는 AI 코딩 툴에게 직접 내리는 명령문 형식으로 작성
2. 생성할 파일 경로(예: app/page.tsx, app/api/generate/route.ts)를 명시
3. 컴포넌트명, 함수명, 변수명, 타입명을 구체적으로 지정
4. UI는 black 배경, white 텍스트의 다크 미니멀 스타일로 Tailwind CSS 사용 명시
5. 상태 관리는 useState, API 호출은 fetch 사용 명시
6. 각 단계는 이전 단계 결과물 위에 이어서 작업하는 방식으로 연결
7. Gemini API 연동 단계에서는 환경변수 GEMINI_API_KEY 사용 명시
8. 프롬프트는 충분히 상세하게, 최소 5문장 이상으로 작성

다음 JSON 스키마에 맞게 응답해주세요:

{
  "기획서": {
    "앱이름": string,
    "한줄소개": string,
    "개요": string,
    "주요기능": [{ "기능명": string, "설명": string }],
    "기술스택": [{ "분류": string, "기술": string }],
    "화면구성": [{ "화면명": string, "설명": string }]
  },
  "프롬프트": [
    { "단계": number, "제목": string, "설명": string, "프롬프트": string }
  ]
}

프롬프트는 반드시 5단계로 작성하세요:
1단계: Next.js 프로젝트 초기 설정 및 폴더 구조 생성
2단계: 메인 UI 레이아웃 및 컴포넌트 구현
3단계: 핵심 인터랙션 및 상태 관리 구현
4단계: Gemini API 연동 및 백엔드 route 구현
5단계: 마무리 스타일링 및 Vercel 배포 설정
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const data = JSON.parse(text);

    return Response.json(data);
  } catch (error) {
    console.error("Plan generation error:", error);
    return Response.json({ error: "기획서 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
