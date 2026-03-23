"use client";

import Link from "next/link";
import { useState, useRef } from "react";

const destinations = [
  { id: "paris", label: "파리", emoji: "🗼", desc: "에펠탑과 함께" },
  { id: "tokyo", label: "도쿄", emoji: "⛩️", desc: "신주쿠 거리에서" },
  { id: "newyork", label: "뉴욕", emoji: "🗽", desc: "맨해튼 한가운데" },
  { id: "bali", label: "발리", emoji: "🌴", desc: "열대 해변에서" },
  { id: "rome", label: "로마", emoji: "🏛️", desc: "콜로세움 앞에서" },
  { id: "hawaii", label: "하와이", emoji: "🌺", desc: "와이키키 해변에서" },
  { id: "london", label: "런던", emoji: "🎡", desc: "빅벤 앞에서" },
  { id: "santorini", label: "산토리니", emoji: "🏝️", desc: "하얀 마을에서" },
];

const moods = [
  { id: "감성적", label: "감성적", desc: "따뜻하고 부드러운 색감" },
  { id: "모험적", label: "모험적", desc: "생동감 넘치는 분위기" },
  { id: "럭셔리", label: "럭셔리", desc: "고급스럽고 세련된 느낌" },
  { id: "레트로", label: "레트로", desc: "빈티지 필름 감성" },
];

type Step = "destination" | "mood" | "photo" | "result";

export default function Stage2() {
  const [step, setStep] = useState<Step>("destination");
  const [destination, setDestination] = useState("");
  const [mood, setMood] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageMimeType(file.type || "image/jpeg");

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageBase64 || !destination || !mood) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, mood, imageBase64, mimeType: imageMimeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "오류 발생");
      setResultUrl(`data:${data.mimeType};base64,${data.imageBase64}`);
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
    setMood("");
    setPreviewUrl(null);
    setImageBase64(null);
    setResultUrl(null);
    setError(null);
  };

  const selectedDest = destinations.find((d) => d.id === destination);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50 tracking-widest uppercase">Digital Product본부</p>
          <h1 className="text-xl font-bold mt-1">2단계 · AI 여행 사진 생성기</h1>
        </div>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
          ← 홈으로
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-12 w-full">
        {/* Step Indicator */}
        {step !== "result" && (
          <div className="flex items-center gap-2 mb-10">
            {(["destination", "mood", "photo"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    step === s
                      ? "bg-white text-black"
                      : ["destination", "mood", "photo"].indexOf(step) > i
                      ? "bg-white/30 text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
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
                    destination === d.id
                      ? "border-white bg-white/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">{d.emoji}</div>
                  <div className="font-bold text-sm">{d.label}</div>
                  <div className="text-white/40 text-xs mt-1">{d.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("mood")}
              disabled={!destination}
              className="mt-8 w-full bg-white text-black font-bold py-3 rounded-full disabled:opacity-30 hover:bg-white/90 transition-all"
            >
              다음 →
            </button>
          </div>
        )}

        {/* STEP 2: Mood */}
        {step === "mood" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">어떤 분위기로 찍을까요?</h2>
            <p className="text-white/40 text-sm mb-8">사진 스타일을 선택하세요</p>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`border rounded-2xl p-5 text-left transition-all ${
                    mood === m.id
                      ? "border-white bg-white/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="text-white/40 text-xs mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep("destination")}
                className="flex-1 border border-white/20 text-white/60 font-bold py-3 rounded-full hover:border-white/40 transition-all"
              >
                ← 이전
              </button>
              <button
                onClick={() => setStep("photo")}
                disabled={!mood}
                className="flex-1 bg-white text-black font-bold py-3 rounded-full disabled:opacity-30 hover:bg-white/90 transition-all"
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Photo Upload */}
        {step === "photo" && (
          <div>
            <h2 className="text-2xl font-bold mb-2">내 사진을 올려주세요</h2>
            <p className="text-white/40 text-sm mb-8">
              {selectedDest?.emoji} {selectedDest?.label} · {mood}
            </p>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-white/40 transition-all"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="mx-auto max-h-64 rounded-xl object-contain"
                />
              ) : (
                <>
                  <div className="text-4xl mb-3">📷</div>
                  <p className="text-white/60 text-sm">클릭해서 사진 선택</p>
                  <p className="text-white/30 text-xs mt-1">JPG, PNG 지원</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {error && (
              <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep("mood")}
                className="flex-1 border border-white/20 text-white/60 font-bold py-3 rounded-full hover:border-white/40 transition-all"
              >
                ← 이전
              </button>
              <button
                onClick={handleGenerate}
                disabled={!imageBase64 || loading}
                className="flex-1 bg-white text-black font-bold py-3 rounded-full disabled:opacity-30 hover:bg-white/90 transition-all"
              >
                {loading ? "생성 중..." : "✨ 여행 사진 만들기"}
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && resultUrl && (
          <div className="text-center">
            <p className="text-xs text-white/40 tracking-widest uppercase mb-4">완성!</p>
            <h2 className="text-2xl font-bold mb-8">
              {selectedDest?.emoji} {selectedDest?.label} 여행 사진
            </h2>
            <img
              src={resultUrl}
              alt="AI generated travel photo"
              className="mx-auto rounded-2xl max-w-full border border-white/10"
            />
            <div className="flex gap-3 mt-8 justify-center">
              <a
                href={resultUrl}
                download="ai-travel-photo.png"
                className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-all"
              >
                다운로드
              </a>
              <button
                onClick={reset}
                className="border border-white/20 text-white/60 font-bold px-8 py-3 rounded-full hover:border-white/40 transition-all"
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
