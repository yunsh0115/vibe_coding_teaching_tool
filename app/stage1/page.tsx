"use client";

import Link from "next/link";
import { useState } from "react";

type Step = {
  number: number;
  title: string;
  description: string;
  actions: string[];
  download?: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: "GitHub 가입",
    description: "github.com 에 접속해서 계정을 만듭니다.",
    actions: [
      "github.com 접속",
      "Sign up 클릭",
      "이메일, 비밀번호 입력 후 가입 완료",
    ],
  },
  {
    number: 2,
    title: "샘플 HTML 파일 준비",
    description: "아래 버튼으로 index.html을 다운로드 받고 폴더에 저장합니다.",
    actions: [
      "아래 다운로드 버튼 클릭",
      "바탕화면에 새 폴더 만들고 그 안에 저장",
    ],
    download: "/sample1.html",
  },
  {
    number: 3,
    title: "GitHub에 레포지토리 생성 & 파일 업로드",
    description: "GitHub 웹에서 바로 파일을 올립니다. 터미널 없이 됩니다.",
    actions: [
      "GitHub 상단 오른쪽 + 버튼 → New repository 클릭",
      "Repository name 입력 후 Create repository 클릭",
      "uploading an existing file 링크 클릭",
      "index.html 파일을 드래그 앤 드롭",
      "Commit changes 클릭",
    ],
  },
  {
    number: 4,
    title: "Vercel 가입",
    description: "vercel.com 에 접속해서 GitHub 계정으로 가입합니다.",
    actions: [
      "vercel.com 접속",
      "Continue with GitHub 클릭",
      "권한 허용 후 가입 완료",
    ],
  },
  {
    number: 5,
    title: "Vercel과 GitHub 연동 & 배포",
    description: "Vercel이 GitHub 레포지토리를 자동으로 배포하게 설정합니다.",
    actions: [
      "Vercel 대시보드에서 Add New → Project 클릭",
      "GitHub 레포지토리 선택",
      "Deploy 클릭",
    ],
  },
  {
    number: 6,
    title: "배포 확인",
    description: "Vercel이 제공한 URL로 접속해서 내 페이지가 올라갔는지 확인합니다.",
    actions: [
      "Vercel이 제공한 URL 클릭",
      "야나두!! 페이지 확인",
    ],
  },
  {
    number: 7,
    title: "HTML 수정 → 자동 배포 확인",
    description: "GitHub 웹에서 직접 파일을 수정하면 Vercel이 자동으로 재배포합니다.",
    actions: [
      "GitHub 레포지토리에서 index.html 클릭",
      "오른쪽 위 연필(✏️) 아이콘 클릭 → 내용 수정",
      "Commit changes 클릭",
      "Vercel 대시보드에서 자동 배포 시작되는 것 확인",
      "배포 완료 후 URL 접속해서 수정 내용 반영 확인",
    ],
  },
  {
    number: 8,
    title: "CI/CD 개념 정리",
    description: "방금 한 것이 바로 CI/CD입니다.",
    actions: [
      "CI (Continuous Integration): 코드 변경을 자동으로 감지",
      "CD (Continuous Deployment): 감지된 변경을 자동으로 배포",
      "GitHub push → Vercel 자동 배포 = CI/CD 파이프라인",
    ],
  },
];

export default function Stage1() {
  const [completed, setCompleted] = useState<number[]>([]);

  const toggle = (num: number) => {
    setCompleted((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">0단계 · GitHub &amp; Vercel</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      {/* Progress */}
      <div className="px-8 py-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/40">진행도</span>
          <span className="text-sm text-white/40">{completed.length} / {steps.length}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(completed.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <section className="px-8 pb-20 max-w-3xl mx-auto w-full space-y-4">
        {steps.map((step) => {
          const done = completed.includes(step.number);
          return (
            <div
              key={step.number}
              className={`border rounded-2xl p-6 transition-all ${
                done ? "border-white/40 bg-white/5" : "border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <span
                    className={`text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      done ? "bg-white text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {done ? "✓" : step.number}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-white/50 text-sm mt-1">{step.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {step.actions.map((action, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-white/30 shrink-0">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                    {step.download && (
                      <a
                        href={step.download}
                        download="index.html"
                        className="inline-block mt-4 px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                      >
                        ↓ index.html 다운로드
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggle(step.number)}
                  className={`shrink-0 text-xs px-4 py-2 rounded-full border transition-all ${
                    done
                      ? "bg-white text-black border-white"
                      : "border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {done ? "완료!" : "완료"}
                </button>
              </div>
            </div>
          );
        })}

        {completed.length === steps.length && (
          <div className="border border-white/20 rounded-2xl p-8 text-center mt-8">
            <p className="text-2xl font-bold mb-2">🎉 1단계 완료!</p>
            <p className="text-white/50 mb-6">이제 AI 앱을 만들어볼 차례입니다.</p>
            <Link
              href="/stage2"
              className="inline-block bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              2단계 시작하기 →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
