"use client";

import Link from "next/link";
import { useState } from "react";

const targetOptions = ["직장인", "학생", "누구나"];

function buildPrompt(appName: string, selectItem: string, extraInputs: string, aiOutput: string, target: string) {
  return `너는 시니어 풀스택 개발자야. 아래 스펙으로 웹앱을 처음부터 완성해줘.

앱 이름: ${appName}
타겟 사용자: ${target}
기능: 사용자가 ${selectItem}을(를) 선택하고 ${extraInputs} 정보를 입력하면 AI가 맞춤형 ${aiOutput}을(를) 생성해서 보여줌

기술 스택:
- Next.js (App Router) + TypeScript + Tailwind CSS
- Google Gemini API (@google/generative-ai)
- 배포: Vercel

구현 순서:
1. 프로젝트 세팅 (패키지 설치, 폴더 구조, .env.local)
2. 메인 페이지: ${selectItem} 선택 카드 UI + ${extraInputs} 입력 폼
3. API 라우트 (app/api/generate/route.ts): Gemini 호출 → ${aiOutput} JSON 반환
4. 결과 페이지: 생성된 ${aiOutput} 렌더링 + 다시 만들기 버튼

디자인: 전체 bg-black, text-white 다크 미니멀 스타일
Gemini 모델: gemini-2.5-flash`;
}

export default function PlanPage() {
  const [appName, setAppName] = useState("AI 여행 코스 플래너");
  const [selectItem, setSelectItem] = useState("여행지");
  const [extraInputs, setExtraInputs] = useState("날짜, 동행, 직업");
  const [aiOutput, setAiOutput] = useState("맞춤 여행 일정");
  const [target, setTarget] = useState("직장인");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = buildPrompt(appName, selectItem, extraInputs, aiOutput, target);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Product 1팀</p>
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
                <p className="text-white/40 text-sm mt-1">복사해서 Claude에 붙여넣으세요</p>
              </div>
              <button
                onClick={() => setGenerated(false)}
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                다시 만들기
              </button>
            </div>

            <div className="border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">앱 개발 프롬프트</h3>
                <button
                  onClick={handleCopy}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${
                    copied
                      ? "bg-white text-black border-white"
                      : "border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>
              <pre className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-white/5 rounded-xl p-4">
                {prompt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
