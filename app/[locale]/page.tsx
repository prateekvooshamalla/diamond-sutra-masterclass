
import Image from "next/image"
import type { Locale } from "@/Services/i18n"
import { getDictionary } from "@/Services/i18n"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
import Link from "next/link"
import { BookOpen, Landmark, Leaf, Sparkles, Users, Video } from "lucide-react"
import { redirect } from "next/navigation"

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const d = getDictionary(locale)

  return (
    <div className="relative bg-[#090A15] text-white overflow-x-hidden">

      {/* ── The Seasons font ── */}
      <style>{`
  @font-face {
    font-family: 'The Seasons';
    src: url('/fonts/TheSeasons-Regular.woff2') format('woff2'),
         url('/fonts/TheSeasons-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'The Seasons';
    src: url('/fonts/TheSeasons-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'The Seasons';
    src: url('/fonts/TheSeasons-Italic.woff2') format('woff2');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }

  .font-seasons {
    font-family: 'The Seasons', Georgia, serif;
  }
`}</style>

      <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-full max-w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-[150px]" />

      <div className="relative z-10">

        {/* ── Announcement bar ── */}
        <div className="border-b border-white/5 bg-[#090A15]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[10px] sm:px-6 sm:text-xs md:px-8 lg:px-12">
            <span className="truncate pr-2 text-[#D4AF37]/80">{d.announcement}</span>
            <div className="hidden sm:block shrink-0">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090A15]/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 md:px-8 md:py-4 lg:px-12">
            <div className="flex items-center gap-2 min-w-0">
              <Image src="/logo.png" width={36} height={36} alt="Palm Leaf Sutra Logo" className="bg-transparent shrink-0 sm:w-[44px] sm:h-[44px]" />
              <div className="leading-tight min-w-0">
                <p className="font-seasons text-sm font-bold text-white truncate sm:text-base lg:text-lg">{d.brandName}</p>
                <p className="hidden text-[10px] tracking-wide text-white/40 sm:block">{d.brandOrg}</p>
              </div>
            </div>

            <nav className="hidden items-center gap-5 text-sm text-white/50 md:flex lg:gap-8">
              <a href="#about" className="transition-colors hover:text-white whitespace-nowrap">{d.navAbout}</a>
              <a href="#masterclass" className="transition-colors hover:text-white whitespace-nowrap">{d.navMasterclass}</a>
              <a href="#heritage" className="transition-colors hover:text-white whitespace-nowrap">{d.navHeritage}</a>
              <a href="#contact" className="transition-colors hover:text-white whitespace-nowrap">{d.navContact}</a>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <div className="sm:hidden">
                <LanguageSwitcher locale={locale} />
              </div>
              <Link
                href={`/${locale}/auth`}
                className="hidden sm:inline-flex items-center bg-[#B64728] px-4 py-2 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E] sm:text-sm sm:px-5 sm:py-2.5"
              >
                {d.ctaEnroll}
              </Link>
            </div>
          </div>
        </header>

        <main>

          {/* ─── 1  Hero ─── */}
          <section id="masterclass" className="relative overflow-hidden bg-[#090A15]">
            <div className="mx-auto grid max-w-7xl lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_520px] lg:items-center">

              <div className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:px-8 md:pb-18 md:pt-12 lg:px-12 lg:pb-24 lg:pt-14">

                {/* Live badge */}
                <div className="mb-5 inline-flex items-center gap-2 border border-[#D4AF37]/30 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50 sm:px-3 sm:text-[10px]">
                  <span className="relative flex h-[5px] w-[5px] shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
                    <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#D4AF37]" />
                  </span>
                  {d.badgeLive}
                </div>

                {/* Headline */}
                <h1 className="font-seasons font-extrabold leading-[1.05] tracking-tight">
                  <span className="block text-[2.2rem] text-white sm:text-5xl md:text-6xl">{d.heroHeadline1}</span>
                  <span className="block text-[1.75rem] italic text-[#D4AF37] sm:text-4xl md:text-5xl">{d.heroHeadline2}</span>
                </h1>

                <p className="font-seasons mt-3 text-sm italic text-white/55 sm:text-lg md:text-xl">
                  {d.heroTagline}
                </p>

                <p className="font-seasons mt-3 text-sm italic text-[#D4AF37]/70 sm:text-base">
                  {d.heroHook}
                </p>

                <p className="mt-4 border-l-2 border-[#D4AF37]/35 pl-4 text-xs leading-relaxed text-white/52 sm:text-sm md:text-base">
                  {d.heroPara}
                </p>

                <div className="mt-3 space-y-0.5 pl-4">
                  <p className="text-xs font-medium text-white/60 sm:text-sm">{d.heroNotPhilosophy}</p>
                  <p className="font-seasons text-xs font-semibold italic text-[#D4AF37]/80 sm:text-sm">{d.heroTransformation}</p>
                </div>

                {/* Meta chips */}
                <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
                  {[d.chipDays, d.chipTime, d.chipZoom].map((chip) => (
                    <span key={chip} className="border border-white/12 bg-white/[0.04] px-2 py-1 text-[9px] font-medium text-white/60 sm:px-3 sm:py-1.5 sm:text-[11px]">
                      {chip}
                    </span>
                  ))}
                  <span className="border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-1 text-[9px] font-semibold text-[#D4AF37] sm:px-3 sm:py-1.5 sm:text-[11px]">
                    {d.chipInstructor}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-6 sm:mt-7">
                  <Link
                    href={`/${locale}/auth`}
                    className="block w-full bg-[#B64728] py-3 text-center text-sm font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E] sm:py-4"
                  >
                    {d.ctaEnroll}
                  </Link>
                  <p className="mt-2 text-[11px] text-white/25">{d.heroSeats}</p>
                </div>

                <div className="mt-4">
                  <a href="#heritage" className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white transition-colors hover:bg-white/5 sm:px-5 sm:text-sm">
                    {d.ctaExplore}
                  </a>
                </div>
              </div>

              {/* Right photo — desktop only */}
              <div className="hidden lg:flex items-center justify-end pr-8 xl:pr-12">
                <div className="relative w-full max-w-[400px] xl:max-w-[470px]">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090A15]">
                    <div className="aspect-[4/5]">
                      <Image src="/Palm leaf manuscript close-up.jpg" width={900} height={1100} alt={d.instructorName} className="h-full w-full object-cover object-top" priority unoptimized />
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <p className="font-seasons text-base font-bold text-white">{d.instructorName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">{d.instructorRole}</p>
                  </div>
                </div>
              </div>

              {/* Mobile/tablet hero image */}
              <div className="px-4 pb-10 sm:px-6 lg:hidden">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090A15]">
                  <div className="aspect-[16/9] sm:aspect-[4/3]">
                    <Image src="/Palm leaf manuscript close-up.jpg" width={900} height={675} alt={d.instructorName} className="h-full w-full object-cover object-top" priority unoptimized />
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <p className="font-seasons text-sm font-bold text-white">{d.instructorName}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">{d.instructorRole}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 2  Stats ─── */}
          <section className="bg-[#090A15] w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12">
            <div className="mx-auto max-w-7xl grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
              {[
                { icon: <Landmark className="h-4 w-4" />, t: d.stats1 },
                { icon: <Leaf className="h-4 w-4" />, t: d.stats2 },
                { icon: <Sparkles className="h-4 w-4" />, t: d.stats3 },
                { icon: <BookOpen className="h-4 w-4" />, t: d.stats4 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:gap-3 sm:p-5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#090A15] text-[#D4AF37] sm:h-9 sm:w-9">{s.icon}</div>
                  <p className="text-[10px] font-medium text-white/80 sm:text-sm leading-tight">{s.t}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 3  Heritage ─── */}
          <section id="heritage" className="bg-[#090A15] w-full px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-7xl grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090A15]">
                <div className="aspect-[4/3]">
                  <Image src="/drSavera.jpeg" width={1200} height={900} alt={d.instructorName} className="h-full w-full object-cover" unoptimized />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.heritageLabel}</p>
                <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">{d.heritageTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 md:text-base lg:text-lg">{d.heritagePara}</p>
                <p className="mt-2 text-xs text-white/50 sm:text-sm">{d.heritageExplores}</p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[d.heritageTopic1, d.heritageTopic2, d.heritageTopic3, d.heritageTopic4, d.heritageTopic5, d.heritageTopic6].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <span className="mt-0.5 shrink-0 text-[#D4AF37] text-xs">◆</span>
                      <p className="text-xs leading-relaxed text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="font-seasons mt-5 text-sm italic text-[#D4AF37]/70 sm:text-base">{d.heritageClosing}</p>
              </div>
            </div>
          </section>

          {/* ─── 4  Why This Masterclass ─── */}
          <section id="about" className="bg-[#090A15] w-full px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-7xl grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.whyLabel}</p>
                <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">{d.whyMasterclassTitle}</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 md:text-base lg:text-lg">{d.whyIntro}</p>
                <ul className="mt-2 space-y-1.5">
                  {[d.whyProblem1, d.whyProblem2, d.whyProblem3, d.whyProblem4].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-white/50 sm:text-sm">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]/50" />{item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">{d.whySolution}</p>
                <div className="mt-3 space-y-1.5">
                  {[d.whyAct, d.whyGive, d.whyLove, d.whyDetach].map((item) => (
                    <p key={item} className="font-seasons flex items-center gap-2.5 text-sm font-bold text-[#D4AF37] sm:text-base lg:text-lg">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]/50 mt-[0.4rem]" />{item}
                    </p>
                  ))}
                </div>
                <p className="mt-5 border-l-2 border-[#D4AF37]/35 pl-4 text-xs leading-relaxed text-white/55 sm:text-sm">{d.whyClosing}</p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090A15]">
                <div className="aspect-[4/3]">
                  <Image src="/Palm leaf manuscript close-up.jpg" width={1200} height={900} alt="Historic Diamond Sutra" className="h-full w-full object-cover" unoptimized />
                </div>
              </div>
            </div>
          </section>

          {/* ─── 5  What You Will Experience ─── */}
          <section className="bg-[#090A15] w-full px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.expLabel}</p>
              <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">{d.expTitle}</h2>

              <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 md:p-8">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#090A15] text-[#D4AF37] sm:h-10 sm:w-10">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="font-seasons text-base font-bold text-white sm:text-lg">{d.expDayTitle}</p>
                  <p className="mt-1 text-[11px] text-white/40 sm:text-sm">{d.expDaySubtitle}</p>
                  <ul className="mt-3 space-y-2">
                    {[d.expDay1, d.expDay2, d.expDay3, d.expDay4, d.expDay5].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/65 sm:text-sm">
                        <span className="text-[#D4AF37] shrink-0">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 md:p-8">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#090A15] text-[#D4AF37] sm:h-10 sm:w-10">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="font-seasons text-base font-bold text-white sm:text-lg">{d.expGainTitle}</p>
                  <ul className="mt-3 space-y-2">
                    {[d.expGain1, d.expGain2, d.expGain3, d.expGain4, d.expGain5, d.expGain6].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/65 sm:text-sm">
                        <span className="text-[#D4AF37] shrink-0">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-white/40 italic sm:text-sm">{d.expNote}</p>

              <div className="mt-8 sm:mt-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.audienceLabel}</p>
                <h3 className="font-seasons mt-2 text-xl font-bold text-white sm:text-2xl md:text-3xl">{d.audienceTitle}</h3>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {[
                    { icon: <Leaf className="h-4 w-4" />, label: d.audience1 },
                    { icon: <Landmark className="h-4 w-4" />, label: d.audience2 },
                    { icon: <Users className="h-4 w-4" />, label: d.audience3 },
                    { icon: <Sparkles className="h-4 w-4" />, label: d.audience4 },
                    { icon: <BookOpen className="h-4 w-4" />, label: d.audience5 },
                    { icon: <Video className="h-4 w-4" />, label: d.audience6 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="shrink-0 text-[#D4AF37]">{item.icon}</span>
                      <p className="text-xs text-white/65 sm:text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs italic text-[#D4AF37]/50 sm:text-sm">{d.audienceNote}</p>
              </div>
            </div>
          </section>

          {/* ─── 6  Your Guide ─── */}
          <section className="bg-[#090A15] w-full px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-7xl grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090A15]">
                <div className="aspect-[4/3] lg:aspect-[4/5]">
                  <Image src="/drSaveraKimono.jpeg" width={900} height={1100} alt={d.instName} className="h-full w-full object-cover" unoptimized />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.instTitle}</p>
                <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">{d.instName}</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-300 md:text-base lg:text-lg">{d.instBody}</p>
                <div className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs sm:mt-6 sm:p-6 sm:text-sm md:p-8">
                  <p><span className="font-medium text-white">{d.dTime}:</span> <span className="text-gray-400">{d.dTimeV}</span></p>
                  <p><span className="font-medium text-white">{d.dDuration}:</span> <span className="text-gray-400">{d.dDurationV}</span></p>
                  <p><span className="font-medium text-white">{d.dMode}:</span> <span className="text-gray-400">{d.dModeV}</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 7  Program Details + Pricing ─── */}
          <section className="bg-[#090A15] w-full py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="mb-8 md:mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.detailsTitle}</p>
                <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">{d.programHeadline}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">{d.programSubline}</p>
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_380px]">
                <div>
                  {[
                    { icon: "15", label: d.prog1Label,  desc: d.prog1Desc },
                    { icon: "⏰", label: `${d.dTime} · ${d.dTimeV}`, desc: d.prog2Desc },
                    { icon: "▶",  label: d.prog3Label,  desc: d.prog3Desc },
                    { icon: "📄", label: d.prog4Label,  desc: d.prog4Desc },
                    { icon: "30", label: `${d.dBatch} · ${d.dBatchV}`, desc: d.prog5Desc },
                    { icon: "∞",  label: d.prog6Label,  desc: d.prog6Desc },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 border-b border-white/[0.06] py-4 first:pt-0 last:border-0 sm:gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] text-[10px] font-bold text-[#D4AF37] sm:h-10 sm:w-10 sm:text-xs">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/90 sm:text-sm">{item.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-3 gap-2 pt-5 sm:gap-3">
                    {[
                      { k: d.dDuration, v: d.dDurationV },
                      { k: d.dMode,     v: d.dModeV     },
                      { k: d.dAccess,   v: d.dAccessV   },
                    ].map((chip) => (
                      <div key={chip.k} className="border border-white/10 bg-white/[0.03] p-2.5 sm:p-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 sm:text-[10px]">{chip.k}</p>
                        <p className="mt-1 text-[11px] font-semibold text-white/80 sm:text-sm">{chip.v}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg">{d.pricingNote}</p>
                  <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">{d.seats}</p>
                </div>

                {/* Right: pricing card */}
                <div className="lg:sticky lg:top-28">
                  <div className="border border-[#D4AF37]/25 bg-[#090A15]">
                    <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8903A]" />
                    <div className="p-5 sm:p-6 md:p-8">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/60">{d.pricingTitle}</p>
                      <h3 className="font-seasons mt-2 text-lg font-bold text-white sm:text-xl md:text-2xl">{d.heroTitle}</h3>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">{d.heroSubtitle}</p>

                      <div className="my-4 h-px w-full bg-white/[0.07]" />

                      <div className="mb-2 flex items-baseline gap-3">
                        <span className="text-sm text-white/30 line-through">&#8377;5,000</span>
                        <span className="font-seasons text-4xl font-extrabold text-[#D4AF37] leading-none sm:text-5xl">
                          <span className="text-xl align-top leading-tight sm:text-2xl">&#8377;</span>99
                        </span>
                      </div>
                      <p className="text-[11px] text-white/25">{d.pricingOneTime}</p>

                      <div className="mt-3 inline-flex items-center bg-[#B64728]/20 border border-[#B64728]/40 px-2.5 py-1.5 sm:px-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#ef6c47] sm:text-[11px]">{d.pricingSavings}</span>
                      </div>

                      <div className="my-4 h-px w-full bg-white/[0.07]" />

                      <ul className="mb-5 space-y-2">
                        {[d.pricing1, d.pricing2, d.pricing3, d.pricing4, d.pricing5].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                            <span className="text-[#D4AF37] shrink-0">✓</span>{item}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/${locale}/auth`}
                        className="block w-full bg-[#B64728] py-3.5 text-center text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
                      >
                        {d.ctaEnroll}
                      </Link>

                      <p className="mt-3 text-center text-[10px] leading-relaxed text-white/20">{d.pricingSeatsNote}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


            {/* Testimonials placeholder */}
          {/* <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-28">
           <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">{d.testiTitle}</p>
           <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.testiTitle}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
               {["Asha", "Kiran", "Meera"].map((n) => (
                 <Card key={n} className="rounded-2xl border border-white/10 bg-white/5">
                   <CardHeader className="p-6 md:p-8">
                     <div className="mb-5 flex items-center gap-3">
                       <Image
                         src="https://placehold.co/200x200/090A15/D4AF37"
                         width={48}
                         height={48}
                         alt="Student profile placeholder"
                         className="h-12 w-12 rounded-full border border-white/10"
                         unoptimized
                       />
                       <div>
                         <CardTitle className="text-base text-white">{n}</CardTitle>
                         <CardDescription className="text-gray-300">{d.testiTitle}</CardDescription>
                       </div>
                     </div>
                     <CardDescription className="text-gray-300">"Clear, calm guidance with real heritage depth."</CardDescription>
                   </CardHeader>
                 </Card>
               ))}
             </div>
           </section> */}

          {/* ─── 9  FAQ ─── */}
          <section className="bg-[#090A15] w-full py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="mb-8 text-center md:mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70 sm:text-[11px]">{d.faqTitle}</p>
                <h2 className="font-seasons mt-3 text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl lg:text-5xl">
                  {d.faqQLabel} <em className="italic text-[#D4AF37]">{d.faqAnswered}</em>
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-gray-400 sm:text-sm">{d.faqSubtitle}</p>
              </div>

              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible>
                  {[
                    { v: "1", q: d.faq1Q, a: d.faq1A },
                    { v: "2", q: d.faq2Q, a: d.faq2A },
                    { v: "3", q: d.faq3Q, a: d.faq3A },
                    { v: "4", q: d.faq4Q, a: d.faq4A },
                    { v: "5", q: d.faq5Q, a: d.faq5A },
                    { v: "6", q: d.faq6Q, a: d.faq6A },
                  ].map((item, i, arr) => (
                    <AccordionItem key={item.v} value={item.v} className={`border-b border-white/[0.07] ${i === arr.length - 1 ? "border-b-0" : ""}`}>
                      <AccordionTrigger className="font-seasons py-4 text-left text-xs font-semibold text-white/80 hover:text-white hover:no-underline sm:py-5 sm:text-sm md:text-base [&[data-state=open]]:text-[#D4AF37]">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-xs leading-relaxed text-gray-400 sm:pb-5 sm:text-sm md:text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* ─── 10  Final CTA ─── */}
          <section className="relative overflow-hidden bg-[#090A15]">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.03] blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 md:px-8 md:py-24">
              <div className="mb-5 flex items-center justify-center gap-2 sm:gap-3">
                <span className="h-px w-6 bg-[#D4AF37]/30 sm:w-8" />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/50 sm:text-[10px] sm:tracking-[0.28em]">{d.ctaBadge}</span>
                <span className="h-px w-6 bg-[#D4AF37]/30 sm:w-8" />
              </div>

              <h2 className="font-seasons text-2xl font-bold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {d.finalTitle}
                <em className="mt-1 block italic text-[#D4AF37]">{d.ctaStartsWithin}</em>
              </h2>

              <div className="mx-auto my-5 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-[#D4AF37]/20" />
                <span className="block h-1.5 w-1.5 rotate-45 bg-[#D4AF37]/40" />
                <span className="h-px w-10 bg-[#D4AF37]/20" />
              </div>

              <p className="mx-auto max-w-sm text-xs leading-relaxed text-white/35 sm:text-sm md:text-base">{d.finalSub}</p>

              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Link href={`/${locale}/auth`} className="group relative inline-flex items-center justify-center overflow-hidden">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative inline-flex w-full items-center justify-center gap-2.5 bg-[#B64728] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.40)] transition-all duration-300 group-hover:bg-[#9A3A1E] sm:w-auto sm:px-10">
                    {d.ctaEnroll}
                  </span>
                </Link>
                <button disabled title={d.joinZoomDisabled} className="inline-flex w-full items-center justify-center border border-white/[0.07] px-8 py-3.5 text-sm font-medium text-white/15 cursor-not-allowed sm:w-auto sm:px-10">
                  {d.joinZoom}
                </button>
              </div>

              <p className="mt-4 text-[10px] tracking-wide text-white/15">{d.ctaSeatsNote}</p>
            </div>
          </section>

          {/* ─── Footer ─── */}
          <footer id="contact" className="relative bg-[#090A15]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
            <div className="h-5 w-full bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent" />

            <div className="mx-auto max-w-7xl px-4 pb-0 pt-6 sm:px-6 md:px-8 lg:px-12">
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] md:gap-8">

                <div className="space-y-4 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-[10px]" />
                      <Image src="/logo.png" width={40} height={40} alt="Palm Leaf Sutra Logo" className="relative bg-transparent" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-seasons text-sm font-bold text-white/90 sm:text-[15px]">{d.brandName}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]/50">{d.brandOrg}</p>
                    </div>
                  </div>
                  <div className="h-px w-14 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                  <p className="max-w-[260px] text-[11px] leading-relaxed text-white/28">{d.footerTagline}</p>
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] px-3 py-1.5">
                    <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
                    <span className="font-seasons text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]/45">{d.footerMotto}</span>
                    <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1">
                    <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.contactTitle}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {["sutraprinting@sifworld.com", "info@sifworld.com", "+91 96528 56665", "Siddipet, Telangana"].map((item) => (
                      <li key={item} className="break-all text-[11px] text-white/32 transition-colors hover:text-white/65 cursor-default">{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1">
                    <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.linksTitle}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {[{ href: "#", label: d.privacy }, { href: "#", label: d.terms }, { href: "#contact", label: d.contact }].map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="group flex items-center gap-2.5 text-[11px] text-white/32 transition-colors hover:text-[#D4AF37]/80">
                          <span className="h-px w-3 bg-[#D4AF37]/25 transition-all duration-300 group-hover:w-5 group-hover:bg-[#D4AF37]/60" />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-white/[0.06] py-5 text-center text-[10px] text-white/20">
                <span>{d.footerRights}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* ── Sticky Floating CTA — mobile only ── */}
      <Link
        href={`/${locale}/auth`}
        className="fixed bottom-4 left-1/2 z-[950] -translate-x-1/2 inline-flex max-w-[88vw] items-center justify-center whitespace-nowrap bg-[#B64728] px-6 py-3 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_8px_28px_rgba(182,71,40,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#9A3A1E] sm:px-8 sm:py-3.5 sm:text-sm lg:hidden"
      >
        {d.ctaEnroll}
      </Link>
    </div>
  )
}