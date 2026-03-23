"use client";

import Link from "next/link";
import { useState } from "react";

const targetOptions = ["직장인", "학생", "누구나"];

function buildPrompts(appName: string, selectItem: string, extraInputs: string, aiOutput: string, target: string) {
  return [
    {
      step: 0,
      title: "역할 및 컨텍스트 설정",
      text: `너는 시니어 풀스택 개발자이자 ${aiOutput} 전문가야.
지금부터 "${appName}" 앱을 처음부터 함께 만들 거야.

기술 스택:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (스타일링)
- Google Gemini API (@google/generative-ai) – AI 기능
- 배포: Vercel

앱 개요:
- 타겟 사용자: ${target}
- 사용자가 ${selectItem}을(를) 선택하고, ${extraInputs} 정보를 입력하면
- AI가 맞춤형 ${aiOutput}을(를) 생성해서 보여주는 웹앱이야

코딩 규칙:
- 전체 배경 bg-black, 텍스트 text-white, 다크 미니멀 스타일
- 상태 관리는 useState, API 호출은 fetch 사용
- 컴포넌트는 app/ 폴더 안에, API는 app/api/ 안에 route.ts로 작성
- 지금은 코드 작성하지 말고 이 컨텍스트를 기억해둬. 다음 메시지부터 단계별로 지시할게.`,
    },
    {
      step: 1,
      title: "프로젝트 초기 설정",
      text: `Next.js 14 App Router + TypeScript + Tailwind CSS 프로젝트를 세팅해줘.
패키지는 @google/generative-ai 를 설치해.
프로젝트 이름은 "${appName}"이야.
폴더 구조는 아래처럼 만들어줘:
app/
  page.tsx          ← 메인 홈 (선택 화면)
  result/page.tsx   ← 결과 화면
  api/generate/route.ts ← Gemini API 라우트
.env.local 에 GEMINI_API_KEY= 항목 추가해줘.
전체 배경은 bg-black, 텍스트는 text-white, 다크 미니멀 스타일로 통일해줘.`,
    },
    {
      step: 2,
      title: "선택 UI 구현",
      text: `app/page.tsx 에 ${selectItem} 선택 카드 UI를 만들어줘.
카드는 grid 2열~4열로 배치하고, 각 카드는 이모지 + 이름 + 설명 구조야.
선택된 카드는 border-white bg-white/10, 미선택은 border-white/10 스타일.
useState로 선택값 관리하고, 선택 안 하면 다음 버튼 disabled 처리해줘.
다음 버튼은 w-full bg-white text-black font-bold py-3 rounded-full 스타일.
타겟 사용자는 ${target}이야.`,
    },
    {
      step: 3,
      title: "추가 정보 입력 UI",
      text: `선택 화면 다음 단계로 ${extraInputs} 입력 화면을 만들어줘.
날짜 입력은 input type="date" style={{ colorScheme: 'dark' }} 적용.
버튼 선택형 항목은 카드 또는 pill 형태로 구현해.
모든 항목이 입력돼야 "결과 만들기" 버튼이 활성화되도록 해줘 (disabled 조건 명확히).
선택 현황을 버튼 위에 작은 뱃지로 보여줘.
이전/다음 버튼은 flex gap-3 구조로 나란히 배치.`,
    },
    {
      step: 4,
      title: "Gemini API 연동",
      text: `app/api/generate/route.ts 에 POST 라우트를 만들어줘.
request body에서 사용자가 선택한 값을 받아서 Gemini에 전달해.
모델은 gemini-2.5-flash, generationConfig에 responseMimeType: "application/json", maxOutputTokens: 8192 설정.
Gemini에게 ${aiOutput} JSON을 생성하도록 프롬프트 작성해.
응답 JSON은 summary(한줄소개), tips(팁 3개), items(상세 목록 배열) 구조로 받아줘.
에러 시 { error: "메시지" } 형태로 반환해줘.`,
    },
    {
      step: 5,
      title: "결과 화면 구현 및 배포",
      text: `app/result/page.tsx 에 결과 화면을 만들어줘.
상단에 summary 표시, 그 아래 tips를 bullet로 보여줘.
items 배열은 카드 리스트로 렌더링 (장소명 bold + 설명 text-white/50).
로딩 중엔 spinner 표시, 에러 시 빨간 문자로 안내.
"다시 만들기" 버튼으로 처음으로 돌아갈 수 있게 해줘.
완성 후 vercel.com 에서 GitHub 연동해서 배포해줘. .env.local의 GEMINI_API_KEY를 Vercel 환경변수에 동일하게 추가해야 해.`,
    },
  ];
}

export default function PlanPage() {
  const [appName, setAppName] = useState("AI 여행 코스 플래너");
  const [selectItem, setSelectItem] = useState("여행지");
  const [extraInputs, setExtraInputs] = useState("날짜, 동행, 직업");
  const [aiOutput, setAiOutput] = useState("맞춤 여행 일정");
  const [target, setTarget] = useState("직장인");
  const [generated, setGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const prompts = buildPrompts(appName, selectItem, extraInputs, aiOutput, target);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">1단계 · 바이브 코딩 프롬프트 생성기</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12 w-full">
        {!generated ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">내 앱 정보를 입력하세요</h2>
              <p className="text-white/40 text-sm">값을 바꾸면 맞춤 프롬프트가 생성됩니다</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">앱 이름</label>
                <input
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
                  placeholder="예: AI 여행 코스 플래너"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">사용자가 선택하는 항목</label>
                <input
                  value={selectItem}
                  onChange={(e) => setSelectItem(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
                  placeholder="예: 여행지, 카페, 영화 장르"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">추가 입력 정보</label>
                <input
                  value={extraInputs}
                  onChange={(e) => setExtraInputs(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
                  placeholder="예: 날짜, 동행, 직업 / 예산, 인원수"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">AI가 만들어주는 결과물</label>
                <input
                  value={aiOutput}
                  onChange={(e) => setAiOutput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40"
                  placeholder="예: 여행 일정, 메뉴 추천, 영화 리스트"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">타겟 사용자</label>
                <div className="flex gap-3">
                  {targetOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTarget(t)}
                      className={`border rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                        target === t ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setGenerated(true)}
              disabled={!appName || !selectItem || !aiOutput}
              className="w-full bg-white text-black font-bold py-4 rounded-full text-lg disabled:opacity-30 hover:bg-white/90 transition-all"
            >
              ✨ 프롬프트 생성하기
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-white/40 tracking-widest uppercase mb-1">완성!</p>
                <h2 className="text-2xl font-bold">{appName}</h2>
                <p className="text-white/40 text-sm mt-1">순서대로 안티그래비티에 복붙하세요</p>
              </div>
              <button
                onClick={() => setGenerated(false)}
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                다시 만들기
              </button>
            </div>

            <div className="space-y-4">
              {prompts.map((p, i) => (
                <div key={i} className="border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center">
                        {p.step}
                      </span>
                      <h3 className="font-bold">{p.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(p.text, i)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all ${
                        copiedIndex === i
                          ? "bg-white text-black border-white"
                          : "border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {copiedIndex === i ? "복사됨!" : "복사"}
                    </button>
                  </div>
                  <pre className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-white/5 rounded-xl p-4">
                    {p.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
