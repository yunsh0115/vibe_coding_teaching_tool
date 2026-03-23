"use client";

import Link from "next/link";
import { useState } from "react";

const destinations = [
  { id: "도쿄", label: "도쿄", emoji: "⛩️", country: "일본" },
  { id: "오사카", label: "오사카", emoji: "🏯", country: "일본" },
  { id: "방콕", label: "방콕", emoji: "🛕", country: "태국" },
  { id: "파리", label: "파리", emoji: "🗼", country: "프랑스" },
  { id: "뉴욕", label: "뉴욕", emoji: "🗽", country: "미국" },
  { id: "발리", label: "발리", emoji: "🌴", country: "인도네시아" },
  { id: "바르셀로나", label: "바르셀로나", emoji: "🏟️", country: "스페인" },
  { id: "싱가포르", label: "싱가포르", emoji: "🦁", country: "싱가포르" },
];

const companionOptions = [
  { id: "혼자", label: "혼자", emoji: "🧍" },
  { id: "친구와", label: "친구와", emoji: "👫" },
  { id: "연인과", label: "연인과", emoji: "💑" },
  { id: "가족과", label: "가족과", emoji: "👨‍👩‍👧" },
];

const occupationOptions = [
  { id: "직장인", label: "직장인", emoji: "💼" },
  { id: "학생", label: "학생", emoji: "🎓" },
  { id: "프리랜서", label: "프리랜서", emoji: "💻" },
  { id: "기타", label: "기타", emoji: "✨" },
];

const categoryColors: Record<string, string> = {
  식사: "text-orange-400",
  관광: "text-blue-400",
  이동: "text-white/40",
  숙박: "text-purple-400",
  쇼핑: "text-pink-400",
};

type Schedule = { time: string; place: string; activity: string; category: string };
type DayPlan = { day: number; date: string; title: string; schedule: Schedule[] };
type Itinerary = {
  destination: string;
  duration: string;
  summary: string;
  tips: string[];
  days: DayPlan[];
};

type Step = "destination" | "info" | "result";

export default function Stage2() {
  const [step, setStep] = useState<Step>("destination");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [companion, setCompanion] = useState("");
  const [occupation, setOccupation] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const canGenerate = startDate.length > 0 && endDate.length > 0 && companion.length > 0 && occupation.length > 0;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, startDate, endDate, companion, occupation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오류 발생");
      setItinerary(data);
      setActiveDay(0);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("destination");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setCompanion("");
    setOccupation("");
    setItinerary(null);
    setError(null);
  };

  const selectedDest = destinations.find((d) => d.id === destination);
  const steps: Step[] = ["destination", "info"];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">2단계 · AI 여행 코스 플래너</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12 w-full">
        {/* Step Indicator */}
        {step !== "result" && (
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === s ? "bg-white text-black"
                  : steps.indexOf(step) > i ? "bg-white/30 text-white"
                  : "bg-white/10 text-white/40"
                }`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Destination */}
        {step === "destination" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">어디로 여행 갈까요?</h2>
            <p className="text-white/40 text-sm mb-8">여행지를 선택하세요</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {destinations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDestination(d.id)}
                  className={`border rounded-2xl p-4 text-center transition-all ${
                    destination === d.id ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">{d.emoji}</div>
                  <div className="font-bold text-sm">{d.label}</div>
                  <div className="text-white/40 text-xs mt-1">{d.country}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("info")}
              disabled={!destination}
              className="mt-8 w-full bg-white text-black font-bold py-3 rounded-full disabled:opacity-30 hover:bg-white/90 transition-all"
            >
              다음 →
            </button>
          </div>
        )}

        {/* STEP 2: Info */}
        {step === "info" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">여행 정보를 알려주세요</h2>
              <p className="text-white/40 text-sm">{selectedDest?.emoji} {selectedDest?.label}</p>
            </div>

            {/* 날짜 */}
            <div>
              <p className="text-xs text-white/40 tracking-widest uppercase mb-3">여행 날짜</p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-2 block">출발일</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-2 block">귀국일</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 동행 */}
            <div>
              <p className="text-xs text-white/40 tracking-widest uppercase mb-3">누구와 함께?</p>
              <div className="grid grid-cols-4 gap-3">
                {companionOptions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCompanion(c.id)}
                    className={`border rounded-2xl p-4 text-center transition-all ${
                      companion === c.id ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-2xl mb-1">{c.emoji}</div>
                    <div className="text-xs font-bold">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 직업 */}
            <div>
              <p className="text-xs text-white/40 tracking-widest uppercase mb-3">직업</p>
              <div className="grid grid-cols-4 gap-3">
                {occupationOptions.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOccupation(o.id)}
                    className={`border rounded-2xl p-4 text-center transition-all ${
                      occupation === o.id ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="text-2xl mb-1">{o.emoji}</div>
                    <div className="text-xs font-bold">{o.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 선택 현황 */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full border ${startDate ? "border-white/40 text-white" : "border-white/10 text-white/30"}`}>
                {startDate || "출발일 미선택"}
              </span>
              <span className={`px-3 py-1 rounded-full border ${endDate ? "border-white/40 text-white" : "border-white/10 text-white/30"}`}>
                {endDate || "귀국일 미선택"}
              </span>
              <span className={`px-3 py-1 rounded-full border ${companion ? "border-white/40 text-white" : "border-white/10 text-white/30"}`}>
                {companion || "동행 미선택"}
              </span>
              <span className={`px-3 py-1 rounded-full border ${occupation ? "border-white/40 text-white" : "border-white/10 text-white/30"}`}>
                {occupation || "직업 미선택"}
              </span>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("destination")}
                className="flex-1 border border-white/20 text-white/60 font-bold py-3 rounded-full hover:border-white/40 transition-all"
              >
                ← 이전
              </button>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || loading}
                className="flex-1 bg-white text-black font-bold py-3 rounded-full disabled:opacity-30 hover:bg-white/90 transition-all"
              >
                {loading ? "생성 중..." : "✈️ 일정 만들기"}
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && itinerary && (
          <div>
            <div className="mb-8">
              <p className="text-xs text-white/40 tracking-widest uppercase mb-2">완성!</p>
              <h2 className="text-2xl font-bold">{itinerary.destination} {itinerary.duration}</h2>
              <p className="text-white/50 text-sm mt-1">{companion} · {occupation}</p>
              <p className="text-white/50 text-sm mt-2">{itinerary.summary}</p>
            </div>

            {/* Tips */}
            <div className="border border-white/10 rounded-2xl p-5 mb-6">
              <p className="text-xs text-white/40 tracking-widest uppercase mb-3">현지 팁</p>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                    <span className="text-white/30 shrink-0">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Day Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {itinerary.days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeDay === i ? "bg-white text-black" : "border border-white/20 text-white/50 hover:border-white/40"
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Day Schedule */}
            {itinerary.days[activeDay] && (
              <div className="border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold mb-1">{itinerary.days[activeDay].title}</h3>
                <p className="text-white/40 text-xs mb-5">{itinerary.days[activeDay].date}</p>
                <div className="space-y-4">
                  {itinerary.days[activeDay].schedule.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-white/30 text-xs w-12 shrink-0 pt-0.5">{s.time}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm">{s.place}</span>
                          <span className={`text-xs ${categoryColors[s.category] ?? "text-white/40"}`}>
                            {s.category}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs leading-relaxed">{s.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={reset}
                className="flex-1 border border-white/20 text-white/60 font-bold py-3 rounded-full hover:border-white/40 transition-all"
              >
                다시 만들기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
