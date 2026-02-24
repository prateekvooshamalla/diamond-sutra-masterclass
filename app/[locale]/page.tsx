import Image from "next/image"
import type { Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
import Link from "next/link"
import { ArrowRight, BookOpen, Landmark, Leaf, Sparkles, Users, Video } from "lucide-react"

export default function Landing({ params }: { params: { locale: Locale } }) {
  const d = getDictionary(params.locale)

  return (
    <div className="relative bg-[#090A15] text-white">
      {/* Single subtle ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-[200px]" />

      <div className="relative z-10">
        <div className="border-b border-white/5 bg-[#111222]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 text-xs md:px-8 lg:px-12">
            <span className="text-[#D4AF37]/80">{d.announcement}</span>
            <div className="hidden sm:block">
              <LanguageSwitcher locale={params.locale} />
            </div>
          </div>
        </div>

        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090A15]/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-12">
            <div className="leading-tight">
              <p className="font-serif text-lg text-white">{d.brandName}</p>
              <p className="text-[11px] tracking-wide text-white/40">{d.brandOrg}</p>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
              <a href="#about" className="transition-colors hover:text-white">{d.navAbout}</a>
              <a href="#masterclass" className="transition-colors hover:text-white">{d.navMasterclass}</a>
              <a href="#heritage" className="transition-colors hover:text-white">{d.navHeritage}</a>
              <a href="#contact" className="transition-colors hover:text-white">{d.navContact}</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="sm:hidden">
                <LanguageSwitcher locale={params.locale} />
              </div>
              <Button asChild className="rounded-full px-5 text-sm">
                <Link href={`/${params.locale}/auth`}>{d.ctaRegister}</Link>
              </Button>
            </div>
          </div>
        </header>

        <main>
        {/* ─── 1  Hero ─── */}
        <section
          id="masterclass"
          className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-16 md:min-h-[90vh] md:px-8 md:py-20 lg:px-12 lg:py-24"
        >
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
                {d.heroTitle}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-gray-300 md:text-lg">{d.heroSubtitle}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-400 md:text-lg">{d.heroBody}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-[13px] text-white/50">
                <span>{d.chipDays}</span>
                <span className="text-white/20">·</span>
                <span>{d.chipTime}</span>
                <span className="text-white/20">·</span>
                <span>{d.chipZoom}</span>
                <span className="text-white/20">·</span>
                <span>{d.chipInstructor}</span>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="gap-2 rounded-full px-7 py-6 text-base">
                  <Link href={`/${params.locale}/auth`}>
                    {d.ctaReserve} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full border-white/10 px-7 py-6 text-base text-white hover:bg-white/5">
                  <a href="#heritage">{d.ctaExplore}</a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
              <div className="aspect-[4/5]">
                <Image
                  src="https://placehold.co/900x1100/090A15/D4AF37"
                  width={900}
                  height={1100}
                  alt="Diamond Sutra palm leaf manuscript placeholder"
                  className="h-full w-full object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2  Stats ─── */}
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12 lg:px-12">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {[
              { icon: <Landmark className="h-4 w-4" />, t: d.stats1 },
              { icon: <Leaf className="h-4 w-4" />, t: d.stats2 },
              { icon: <Sparkles className="h-4 w-4" />, t: d.stats3 },
              { icon: <BookOpen className="h-4 w-4" />, t: d.stats4 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111222] text-[#D4AF37]">{s.icon}</div>
                <p className="text-sm font-medium text-white/80">{s.t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3  About (Heritage) ─── */}
        <section id="heritage" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
              <div className="aspect-[4/3]">
                <Image
                  src="https://placehold.co/1200x900/111222/D4AF37"
                  width={1200}
                  height={900}
                  alt="Artisan writing on palm leaf placeholder"
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navHeritage}</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.whyTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.whyBody}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
                {[d.whyB1, d.whyB2, d.whyB3, d.whyB4].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
                    <p className="text-sm leading-relaxed text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4  Why Diamond Sutra ─── */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navAbout}</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.dsTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.dsBody}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
                {[d.dsT1, d.dsT2].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
                    <p className="text-sm font-medium leading-relaxed text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
              <div className="aspect-[4/3]">
                <Image
                  src="https://placehold.co/1200x700/111222/D4AF37"
                  width={1200}
                  height={700}
                  alt="Historic Diamond Sutra placeholder"
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 5  What you'll learn ─── */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navMasterclass}</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.learnTitle}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
            {[
              { icon: <BookOpen className="h-5 w-5" />, t: d.learn1T, d: d.learn1D },
              { icon: <Landmark className="h-5 w-5" />, t: d.learn2T, d: d.learn2D },
              { icon: <Sparkles className="h-5 w-5" />, t: d.learn3T, d: d.learn3D },
              { icon: <Users className="h-5 w-5" />, t: d.learn4T, d: d.learn4D },
              { icon: <Leaf className="h-5 w-5" />, t: d.learn5T, d: d.learn5D },
              { icon: <Video className="h-5 w-5" />, t: d.learn6T, d: d.learn6D },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111222] text-[#D4AF37]">
                  {c.icon}
                </div>
                <p className="text-sm font-semibold text-white/90">{c.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6  Your guide ─── */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
              <div className="aspect-[4/5]">
                <Image
                  src="https://placehold.co/900x1100/090A15/D4AF37"
                  width={900}
                  height={1100}
                  alt="Dr Rajesh Savera placeholder"
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.instTitle}</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.instName}</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.instBody}</p>
              <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm md:p-8">
                <p><span className="font-medium text-white">{d.dTime}:</span> <span className="text-gray-400">{d.dTimeV}</span></p>
                <p><span className="font-medium text-white">{d.dDuration}:</span> <span className="text-gray-400">{d.dDurationV}</span></p>
                <p><span className="font-medium text-white">{d.dMode}:</span> <span className="text-gray-400">{d.dModeV}</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7  Program details + Pricing ─── */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Program details */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.detailsTitle}</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.detailsTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-gray-400">Batch size and Zoom access are managed from Admin.</p>

              <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12">
                {[
                  { k: d.dDuration, v: d.dDurationV },
                  { k: d.dTime, v: d.dTimeV },
                  { k: d.dMode, v: d.dModeV },
                  { k: d.dBatch, v: d.dBatchV },
                  { k: d.dAccess, v: d.dAccessV },
                ].map((row, i) => (
                  <div key={i} className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 ${i === 4 ? "col-span-2" : ""}`}>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">{row.k}</p>
                    <p className="mt-1.5 text-sm font-medium text-white/90">{row.v}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-base leading-relaxed text-gray-300 md:text-lg">{d.pricingNote}</p>
              <p className="mt-3 text-sm text-gray-400">{d.seats}</p>
            </div>

            {/* Pricing card */}
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111222] p-6 md:p-8 lg:sticky lg:top-28">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.pricingTitle}</p>
              <h3 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">{d.heroTitle}</h3>
              <p className="mt-2 text-sm text-gray-400">{d.heroSubtitle}</p>

              <div className="mt-6 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#D4AF37]">
                {d.priceOffer}
              </div>

              <div className="mt-6 flex items-end justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{d.priceOriginal}</p>
                  <p className="text-lg text-white/50 line-through">₹5000</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{d.priceOffer}</p>
                  <p className="text-4xl font-bold text-[#D4AF37]">₹99</p>
                </div>
              </div>

              <Button asChild className="mt-6 w-full rounded-full py-6 text-base">
                <Link href={`/${params.locale}/auth`}>{d.ctaEnroll}</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-gray-500">
                After registration you will access your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials placeholder */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-28">
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
                  <CardDescription className="text-gray-300">“Clear, calm guidance with real heritage depth.”</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* ─── 9  FAQ ─── */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.faqTitle}</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.faqTitle}</h2>
          <div className="mx-auto mt-10 max-w-3xl md:mt-12">
            <Accordion type="single" collapsible>
              <AccordionItem value="1" className="border-b border-white/10 py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq1Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq1A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="2" className="border-b border-white/10 py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq2Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq2A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="3" className="border-b border-white/10 py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq3Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq3A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="4" className="border-b border-white/10 py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq4Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq4A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="5" className="border-b border-white/10 py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq5Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq5A}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="6" className="py-1">
                <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq6Q}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{d.faq6A}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-[#312E81] via-[#090A15] to-[#4F46E5]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-24">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2.4rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:p-8">
              <div>
                <h2 className="font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.finalTitle}</h2>
                <p className="mt-5 text-base text-gray-300 leading-relaxed md:text-lg">{d.finalSub}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="gold" asChild className="rounded-full px-7 py-6 text-base">
                  <Link href={`/${params.locale}/auth`}>{d.ctaReserve}</Link>
                </Button>
                <Button variant="outline" disabled title={d.joinZoomDisabled} className="rounded-full px-7 py-6 text-base text-white">
                  {d.joinZoom}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="border-t border-[#26273F]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3 md:px-8 lg:px-12">
            <div>
              <p className="font-serif text-lg text-white">{d.brandName}</p>
              <p className="text-xs text-gray-400 tracking-wide">{d.brandOrg}</p>
              <p className="mt-5 text-base text-gray-300 leading-relaxed md:text-lg">
                Preserving ancient Indian cultural heritage through traditional palm leaf manuscripts.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{d.contactTitle}</p>
              <ul className="mt-5 space-y-2 text-base text-gray-300 md:text-lg">
                <li>sutraprinting@sifworld.com</li>
                <li>info@sifworld.com</li>
                <li>+91 96528 56665</li>
                <li>Siddipet, Telangana</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{d.linksTitle}</p>
              <ul className="mt-5 space-y-2 text-base text-gray-300 md:text-lg">
                <li><a href="#" className="hover:text-white">{d.privacy}</a></li>
                <li><a href="#" className="hover:text-white">{d.terms}</a></li>
                <li><a href="#contact" className="hover:text-white">{d.contact}</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 pb-10 text-xs text-gray-400 tracking-wide md:px-8 lg:px-12">
            {d.footerRights}
          </div>
        </footer>
        </main>
      </div>
    </div>
  )
}
