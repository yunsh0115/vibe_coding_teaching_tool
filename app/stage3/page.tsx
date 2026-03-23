"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Node.js 설치",
    desc: "Claude Code 실행에 필요한 Node.js를 먼저 설치합니다.",
    detail: "https://nodejs.org 에서 LTS 버전을 다운로드하여 설치하세요.",
    code: "node --version",
    codeDesc: "설치 확인",
  },
  {
    id: 2,
    title: "Claude Code 설치",
    desc: "터미널을 열고 아래 명령어로 Claude Code를 설치합니다.",
    detail: "npm을 이용해 전역으로 설치합니다. 설치 후 claude 명령어를 사용할 수 있습니다.",
    code: "npm install -g @anthropic-ai/claude-code",
    codeDesc: "설치 명령어",
  },
  {
    id: 3,
    title: "로그인",
    desc: "Claude 계정으로 로그인합니다.",
    detail: "처음 실행 시 브라우저가 열리며 Anthropic 계정으로 로그인하면 자동으로 연동됩니다.",
    code: "claude",
    codeDesc: "Claude Code 시작",
  },
  {
    id: 4,
    title: "프로젝트에서 실행",
    desc: "작업할 폴더로 이동 후 Claude Code를 실행합니다.",
    detail: "원하는 프로젝트 폴더에서 claude 명령어를 실행하면 AI와 함께 코딩을 시작할 수 있습니다.",
    code: "cd 내프로젝트폴더\nclaude",
    codeDesc: "프로젝트에서 시작",
  },
];

const tips = [
  {
    emoji: "💬",
    title: "자연어로 명령",
    desc: "\"로그인 기능 추가해줘\", \"버그 고쳐줘\" 처럼 말하듯이 요청하세요.",
  },
  {
    emoji: "📁",
    title: "파일 통째로 분석",
    desc: "코드 파일을 읽고 구조를 파악한 뒤 수정까지 한 번에 처리합니다.",
  },
  {
    emoji: "🔧",
    title: "터미널 명령 실행",
    desc: "git, npm, 테스트 실행 등 터미널 작업도 AI가 직접 처리합니다.",
  },
  {
    emoji: "🚀",
    title: "전체 앱 개발",
    desc: "기획부터 배포까지 Claude Code 하나로 완성할 수 있습니다.",
  },
];

export default function Stage3() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">3단계 · Claude Code 정복하기</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12 w-full">
        {/* Hero */}
        <div className="mb-12 text-center">
          <span className="text-xs tracking-widest text-white/40 uppercase">Step 3</span>
          <h2 className="text-3xl font-extrabold mt-3 mb-4">
            Claude Code<br />
            <span className="text-white/60">정복하기</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
            바이브 코딩을 넘어, 터미널에서 AI와 함께 실제 개발자처럼 작업하는 방법을 배웁니다.
          </p>
        </div>

        {/* Installation Steps */}
        <section className="mb-14">
          <h3 className="text-xs tracking-widest text-white/40 uppercase mb-6">설치 가이드</h3>
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div key={step.id} className="border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold mb-1">{step.title}</h4>
                    <p className="text-white/50 text-sm mb-3">{step.desc}</p>
                    <p className="text-white/30 text-xs mb-4">{step.detail}</p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all flex-1">
                        {step.code}
                      </pre>
                      <button
                        onClick={() => handleCopy(step.code, step.id)}
                        className="text-white/30 hover:text-white text-xs shrink-0 transition-colors"
                      >
                        {copiedId === step.id ? "복사됨!" : "복사"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h3 className="text-xs tracking-widest text-white/40 uppercase mb-6">Claude Code로 할 수 있는 것들</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip) => (
              <div key={tip.title} className="border border-white/10 rounded-2xl p-5">
                <div className="text-2xl mb-3">{tip.emoji}</div>
                <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
                <p className="text-white/40 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-3">준비 완료!</p>
          <h3 className="text-xl font-bold mb-2">이제 진짜 개발자입니다</h3>
          <p className="text-white/40 text-sm mb-6">
            Claude Code와 함께라면 어떤 앱도 만들 수 있습니다.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-all"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
