"use client";

import Link from "next/link";
import { useState } from "react";

const featureOptions = [
  { id: "여행지 선택", label: "여행지 선택", desc: "국가/도시 카드 UI" },
  { id: "분위기 선택", label: "분위기 선택", desc: "스타일 옵션 선택" },
  { id: "사진 업로드", label: "사진 업로드", desc: "내 사진 첨부" },
  { id: "AI 이미지 생성", label: "AI 이미지 생성", desc: "Gemini API 활용" },
  { id: "결과 다운로드", label: "결과 다운로드", desc: "생성된 이미지 저장" },
];

const targetOptions = ["직장인", "학생", "누구나"];
const platformOptions = ["웹 (PC/모바일)"];

type PlanResult = {
  기획서: {
    앱이름: string;
    한줄소개: string;
    개요: string;
    주요기능: { 기능명: string; 설명: string }[];
    기술스택: { 분류: string; 기술: string }[];
    화면구성: { 화면명: string; 설명: string }[];
  };
  프롬프트: {
    단계: number;
    제목: string;
    설명: string;
    프롬프트: string;
  }[];
};

export default function PlanPage() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [appName, setAppName] = useState("AI 여행사진 생성기");
  const [features, setFeatures] = useState<string[]>(featureOptions.map((f) => f.id));
  const [target, setTarget] = useState("직장인");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "prompts">("plan");

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          features,
          target,
          platform: "웹 (PC/모바일)",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오류 발생");
      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep("form");
    }
  };

  const copyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">기획서 &amp; 프롬프트 생성기</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12 w-full">

        {/* FORM */}
        {step === "form" && (
          <div className="space-y-10">
            <div>
              <span className="text-xs text-white/40 tracking-widest uppercase">Step 1</span>
              <h2 className="text-2xl font-bold mt-1 mb-1">내가 만들 앱 이름은?</h2>
              <p className="text-white/40 text-sm mb-4">기본값을 그대로 써도 좋아요</p>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                placeholder="예: AI 여행사진 생성기"
              />
            </div>

            <div>
              <span className="text-xs text-white/40 tracking-widest uppercase">Step 2</span>
              <h2 className="text-2xl font-bold mt-1 mb-1">어떤 기능을 넣을까요?</h2>
              <p className="text-white/40 text-sm mb-4">여러 개 선택 가능</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureOptions.map((f) => {
                  const selected = features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFeature(f.id)}
                      className={`border rounded-xl p-4 text-left transition-all ${
                        selected
                          ? "border-white bg-white/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{f.label}</span>
                        <span className={`text-xs ${selected ? "text-white" : "text-white/30"}`}>
                          {selected ? "✓" : "+"}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mt-1">{f.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-xs text-white/40 tracking-widest uppercase">Step 3</span>
              <h2 className="text-2xl font-bold mt-1 mb-1">누가 쓰는 앱인가요?</h2>
              <p className="text-white/40 text-sm mb-4">타겟 사용자를 선택하세요</p>
              <div className="flex gap-3">
                {targetOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTarget(t)}
                    className={`border rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                      target === t
                        ? "border-white bg-white/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={features.length === 0 || !appName.trim()}
              className="w-full bg-white text-black font-bold py-4 rounded-full text-lg disabled:opacity-30 hover:bg-white/90 transition-all"
            >
              ✨ 기획서 &amp; 프롬프트 생성하기
            </button>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6" />
            <p className="text-white/60 text-lg">Gemini가 기획서를 작성하고 있어요...</p>
            <p className="text-white/30 text-sm mt-2">잠깐만 기다려주세요</p>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-white/40 tracking-widest uppercase">완성!</p>
                <h2 className="text-2xl font-bold mt-1">{result.기획서.앱이름}</h2>
                <p className="text-white/50 text-sm mt-1">{result.기획서.한줄소개}</p>
              </div>
              <button
                onClick={() => setStep("form")}
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                다시 만들기
              </button>
            </div>

            {/* Tab */}
            <div className="flex border-b border-white/10 mb-8">
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === "plan"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                📄 기획서
              </button>
              <button
                onClick={() => setActiveTab("prompts")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === "prompts"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/60"
                }`}
              >
                ✨ 단계별 프롬프트
              </button>
            </div>

            {/* 기획서 Tab */}
            {activeTab === "plan" && (
              <div className="space-y-6">
                <div className="border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xs text-white/40 tracking-widest uppercase mb-3">개요</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{result.기획서.개요}</p>
                </div>

                <div className="border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xs text-white/40 tracking-widest uppercase mb-4">주요 기능</h3>
                  <div className="space-y-3">
                    {result.기획서.주요기능.map((f, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-white/30 text-sm shrink-0 mt-0.5">{i + 1}.</span>
                        <div>
                          <span className="font-medium text-sm">{f.기능명}</span>
                          <p className="text-white/50 text-xs mt-0.5">{f.설명}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xs text-white/40 tracking-widest uppercase mb-4">기술 스택</h3>
                  <div className="space-y-2">
                    {result.기획서.기술스택.map((t, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-white/40 w-24 shrink-0">{t.분류}</span>
                        <span className="text-white/80">{t.기술}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xs text-white/40 tracking-widest uppercase mb-4">화면 구성</h3>
                  <div className="space-y-3">
                    {result.기획서.화면구성.map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-white/30 text-sm shrink-0 mt-0.5">{i + 1}.</span>
                        <div>
                          <span className="font-medium text-sm">{s.화면명}</span>
                          <p className="text-white/50 text-xs mt-0.5">{s.설명}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("prompts")}
                  className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-white/90 transition-all"
                >
                  프롬프트 보기 →
                </button>
              </div>
            )}

            {/* 프롬프트 Tab */}
            {activeTab === "prompts" && (
              <div className="space-y-4">
                <p className="text-white/40 text-sm mb-6">
                  아래 프롬프트를 순서대로 Claude Code 또는 Cursor에 복붙하세요.
                </p>
                {result.프롬프트.map((p, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center shrink-0">
                          {p.단계}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm">{p.제목}</h4>
                          <p className="text-white/40 text-xs mt-0.5">{p.설명}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyPrompt(p.프롬프트, i)}
                        className={`shrink-0 text-xs px-4 py-2 rounded-full border transition-all ${
                          copiedIndex === i
                            ? "bg-white text-black border-white"
                            : "border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                        }`}
                      >
                        {copiedIndex === i ? "복사됨!" : "복사"}
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 mt-3">
                      <p className="text-white/70 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                        {p.프롬프트}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
