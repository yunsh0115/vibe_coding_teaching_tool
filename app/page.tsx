import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5">
        <p className="text-sm text-white/50 tracking-widest uppercase">Product 1팀</p>
        <h1 className="text-xl font-bold mt-1">바이브 코딩 과정</h1>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-24 flex-1">
        <span className="text-xs tracking-widest text-white/40 uppercase mb-4">Welcome</span>
        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          야나두<br />
          바이브코딩<br />
          <span className="text-white/60">시작했어!</span>
        </h2>
        <p className="text-white/50 text-lg max-w-md mt-4">
          클릭 몇 번으로 나만의 AI 앱을 직접 만들고 배포까지 해봅니다.
        </p>
      </section>

      {/* Stage Cards */}
      <section className="px-8 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        <Link href="/stage1" className="group border border-white/10 rounded-2xl p-8 hover:border-white/40 hover:bg-white/5 transition-all">
          <span className="text-xs text-white/40 tracking-widest uppercase">0단계</span>
          <h3 className="text-2xl font-bold mt-2 mb-3">GitHub &amp; Vercel</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            GitHub에 코드를 올리고 Vercel로 배포하는 CI/CD 파이프라인을 직접 경험합니다.
          </p>
          <div className="mt-6 text-white/30 text-sm group-hover:text-white/60 transition-colors">
            시작하기 →
          </div>
        </Link>

        <Link href="/plan" className="group border border-white/10 rounded-2xl p-8 hover:border-white/40 hover:bg-white/5 transition-all">
          <span className="text-xs text-white/40 tracking-widest uppercase">1단계</span>
          <h3 className="text-2xl font-bold mt-2 mb-3">기획서 &amp; 프롬프트</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            앱 기획서를 AI로 자동 생성하고, 바이브 코딩에 쓸 프롬프트를 받아갑니다.
          </p>
          <div className="mt-6 text-white/30 text-sm group-hover:text-white/60 transition-colors">
            시작하기 →
          </div>
        </Link>

        <Link href="/stage2" className="group border border-white/10 rounded-2xl p-8 hover:border-white/40 hover:bg-white/5 transition-all">
          <span className="text-xs text-white/40 tracking-widest uppercase">2단계</span>
          <h3 className="text-2xl font-bold mt-2 mb-3">AI 여행 코스<br />플래너</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            가고 싶은 여행지와 날짜를 고르면 AI가 상세한 여행 코스를 짜줍니다.
          </p>
          <div className="mt-6 text-white/30 text-sm group-hover:text-white/60 transition-colors">
            체험하기 →
          </div>
        </Link>

        <Link href="/stage3" className="group border border-white/10 rounded-2xl p-8 hover:border-white/40 hover:bg-white/5 transition-all">
          <span className="text-xs text-white/40 tracking-widest uppercase">3단계</span>
          <h3 className="text-2xl font-bold mt-2 mb-3">Claude Code<br />정복하기</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Claude Code를 설치하고 터미널에서 AI와 함께 진짜 개발자처럼 작업합니다.
          </p>
          <div className="mt-6 text-white/30 text-sm group-hover:text-white/60 transition-colors">
            시작하기 →
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-5 text-center text-white/30 text-xs">
        © 2026 Yun. All rights reserved.
      </footer>
    </main>
  );
}
