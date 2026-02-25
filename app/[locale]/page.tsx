// import Image from "next/image"
// import type { Locale } from "@/lib/i18n"
// import { getDictionary } from "@/lib/i18n"
// import { Button } from "@/components/ui/button"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
// import Link from "next/link"
// import { BookOpen, Landmark, Leaf, Sparkles, Users, Video } from "lucide-react"

// export default async function Landing({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = await params
//   const d = getDictionary(locale)

//   return (
//     <div className="relative bg-[#090A15] text-white">
//       {/* Single subtle ambient glow */}
//       <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-[200px]" />

//       <div className="relative z-10">
//         <div className="border-b border-white/5 bg-[#111222]">
//           <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 text-xs md:px-8 lg:px-12">
//             <span className="text-[#D4AF37]/80">{d.announcement}</span>
//             <div className="hidden sm:block">
//               <LanguageSwitcher locale={locale} />
//             </div>
//           </div>
//         </div>

//         <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090A15]/90 backdrop-blur-lg">
//           <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-5 py-4 md:px-8 lg:px-12">
//             {/* Logo */}
//             <div className="flex items-center gap-2">
//               <Image
//                 src="/logo.png"
//                 width={50}
//                 height={50}
//                 alt="Palm Leaf Sutra Logo"
//                 className="bg-transparent"
//               />
//               <div className="leading-tight">
//                 <p className="font-serif text-lg text-white">{d.brandName}</p>
//                 <p className="text-[11px] tracking-wide text-white/40">{d.brandOrg}</p>
//               </div>
//             </div>

//             <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
//               <a href="#about" className="transition-colors hover:text-white">{d.navAbout}</a>
//               <a href="#masterclass" className="transition-colors hover:text-white">{d.navMasterclass}</a>
//               <a href="#heritage" className="transition-colors hover:text-white">{d.navHeritage}</a>
//               <a href="#contact" className="transition-colors hover:text-white">{d.navContact}</a>
//             </nav>
//             <div className="flex items-center gap-3">
//               <div className="sm:hidden">
//                 <LanguageSwitcher locale={locale} />
//               </div>
//               <Button asChild className="rounded-full px-5 text-sm">
//                 <Link href={`/${locale}/auth`}>{d.ctaRegister}</Link>
//               </Button>
//             </div>
//           </div>
//         </header>

//         <main>
//           {/* ─── 1  Hero (UPDATED) ─── */}
//           <section
//             id="masterclass"
//             className="relative overflow-hidden bg-[#090A15] min-h-[78vh] md:min-h-[90vh]"
//           >
//             <div className="mx-auto grid max-w-7xl min-h-[78vh] items-center md:min-h-[90vh] lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px]">

//               {/* ── Left: all text content ── */}
//               <div className="px-5 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">

//                 {/* Live badge */}
//                 <div className="mb-6 inline-flex items-center gap-2 border border-[#D4AF37]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
//                   <span className="relative flex h-[5px] w-[5px]">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
//                     <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#D4AF37]" />
//                   </span>
//                   Live Masterclass &nbsp;·&nbsp; Enrolling Now
//                 </div>

//                 {/* Stacked headline — white lines then italic gold last line */}
//                 <h1 className="font-serif font-extrabold leading-[1.05] tracking-tight">
//                   <span className="block text-5xl text-white md:text-6xl">Clarity.</span>
//                   <span className="block text-5xl text-white md:text-6xl">Diamond Sutra.</span>
//                   <span className="block text-5xl italic text-[#D4AF37] md:text-6xl">Mind Mastery.</span>
//                 </h1>

//                 {/* Italic serif subtitle */}
//                 <p className="mt-5 max-w-lg font-serif text-base italic text-white/38 md:text-lg">
//                   {d.heroSubtitle}
//                 </p>

//                 {/* Body with left gold border */}
//                 <p className="mt-4 max-w-md border-l-2 border-[#D4AF37]/35 pl-4 text-sm leading-relaxed text-white/52 md:text-base">
//                   {d.heroBody}
//                 </p>

//                 {/* Meta chips */}
//                 <div className="mt-7 flex flex-wrap gap-2">
//                   {[d.chipDays, d.chipTime, d.chipZoom].map((chip) => (
//                     <span
//                       key={chip}
//                       className="border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/60"
//                     >
//                       {chip}
//                     </span>
//                   ))}
//                   <span className="border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-[11px] font-semibold text-[#D4AF37]">
//                     {d.chipInstructor}
//                   </span>
//                 </div>

//                 {/* Price block */}
//                 <div className="mt-8">
//                   {/* 98% OFF badge */}
//                   <span className="mb-4 inline-block border border-red-500/35 bg-red-500/18 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
//                     98% OFF
//                   </span>

//                   {/* Strikethrough original + arrow + big price */}
//                   <div className="flex items-end gap-3 mb-1">
//                     <span className="font-serif text-xl font-semibold text-white/25 line-through">₹5,000</span>
//                     <span className="pb-1 text-lg leading-none text-white/20">→</span>
//                     <span className="font-serif font-extrabold leading-none tracking-tight text-[#D4AF37]">
//                       <sup className="text-2xl align-middle font-semibold">₹</sup>
//                       <span className="text-6xl md:text-7xl">99</span>
//                     </span>
//                   </div>
//                   <p className="mb-6 text-[10px] tracking-wide text-white/25">One-time · No hidden fees</p>

//                   {/* Full-width Reserve Seat button */}
//                   <Link
//                     href={`/${locale}/auth`}
//                     className="block w-full bg-[#B64728] py-4 text-center text-sm font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
//                   >
//                     Reserve Seat
//                   </Link>

//                   <p className="mt-3 text-[11px] text-white/25">
//                     Only <strong className="text-[#D4AF37]/50">30 seats</strong> available in this batch
//                   </p>
//                 </div>

//                 {/* Secondary CTA */}
//                 <div className="mt-5">
//                   <a
//                     href="#heritage"
//                     className="inline-flex items-center gap-2 border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:bg-white/5"
//                   >
//                     {d.ctaExplore}
//                   </a>
//                 </div>
//               </div>

//               {/* ── Right: Dr. Savera — contained panel matching screenshot ── */}
//               <div className="relative hidden lg:flex items-center justify-end pr-8 xl:pr-12">
//                 <div className="relative w-full max-w-[420px] xl:max-w-[480px]">
//                   <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                     <div className="aspect-[4/5]">
//                       <Image
//                         src="/drSavera1.jpeg"
//                         width={900}
//                         height={1100}
//                         alt="Dr. Rajesh Savera"
//                         className="h-full w-full object-cover object-top"
//                         priority
//                         unoptimized
//                       />
//                     </div>
//                   </div>
//                   {/* Name label below image */}
//                   <div className="mt-3 text-right">
//                     <p className="font-serif text-base font-bold text-white">Dr. Rajesh Savera</p>
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
//                       Ayurveda Physician · Mindfulness Expert
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

          
//           </section>

//           {/* ─── 2  Stats ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12 lg:px-12">
//             <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
//               {[
//                 { icon: <Landmark className="h-4 w-4" />, t: d.stats1 },
//                 { icon: <Leaf className="h-4 w-4" />, t: d.stats2 },
//                 { icon: <Sparkles className="h-4 w-4" />, t: d.stats3 },
//                 { icon: <BookOpen className="h-4 w-4" />, t: d.stats4 },
//               ].map((s, i) => (
//                 <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111222] text-[#D4AF37]">{s.icon}</div>
//                   <p className="text-sm font-medium text-white/80">{s.t}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ─── 3  About (Heritage) ─── */}
//           <section id="heritage" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//           <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 min-h-[80vh]">
//           <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//               <div className="aspect-[4/3]">
//       <Image
//         src="/drSavera.jpeg"
//         width={1200}
//         height={2000}
//         alt="Artisan writing on palm leaf placeholder"
//         className="h-full w-full object-cover"
//         unoptimized
//       />
//     </div>
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navHeritage}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.whyTitle}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.whyBody}</p>
//                 <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
//                   {[d.whyB1, d.whyB2, d.whyB3, d.whyB4].map((item) => (
//                     <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                       <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
//                       <p className="text-sm leading-relaxed text-white/70">{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 4  Why Diamond Sutra ─── */}
//           <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navAbout}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.dsTitle}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.dsBody}</p>
//                 <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
//                   {[d.dsT1, d.dsT2].map((item) => (
//                     <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                       <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
//                       <p className="text-sm font-medium leading-relaxed text-white/70">{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                 <div className="aspect-[4/3]">
//                   <Image
//                     src="Palm leaf manuscript close-up.jpg"
//                     width={1200}
//                     height={700}
//                     alt="Historic Diamond Sutra placeholder"
//                     className="h-full w-full object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 5  What you'll learn ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navMasterclass}</p>
//             <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.learnTitle}</h2>
//             <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
//               {[
//                 { icon: <BookOpen className="h-5 w-5" />, t: d.learn1T, d: d.learn1D },
//                 { icon: <Landmark className="h-5 w-5" />, t: d.learn2T, d: d.learn2D },
//                 { icon: <Sparkles className="h-5 w-5" />, t: d.learn3T, d: d.learn3D },
//                 { icon: <Users className="h-5 w-5" />, t: d.learn4T, d: d.learn4D },
//                 { icon: <Leaf className="h-5 w-5" />, t: d.learn5T, d: d.learn5D },
//                 { icon: <Video className="h-5 w-5" />, t: d.learn6T, d: d.learn6D },
//               ].map((c, i) => (
//                 <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                   <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111222] text-[#D4AF37]">
//                     {c.icon}
//                   </div>
//                   <p className="text-sm font-semibold text-white/90">{c.t}</p>
//                   <p className="mt-2 text-sm leading-relaxed text-gray-400">{c.d}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ─── 6  Your guide ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
//               <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                 <div className="aspect-[4/5]">
//                   <Image
//                     src="drSaveraKimono.jpeg"
//                     width={900}
//                     height={1100}
//                     alt="Dr Rajesh Savera placeholder"
//                     className="h-full w-full object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.instTitle}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.instName}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.instBody}</p>
//                 <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm md:p-8">
//                   <p><span className="font-medium text-white">{d.dTime}:</span> <span className="text-gray-400">{d.dTimeV}</span></p>
//                   <p><span className="font-medium text-white">{d.dDuration}:</span> <span className="text-gray-400">{d.dDurationV}</span></p>
//                   <p><span className="font-medium text-white">{d.dMode}:</span> <span className="text-gray-400">{d.dModeV}</span></p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 7  Program details + Pricing ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
//               {/* Program details */}
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.detailsTitle}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.detailsTitle}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-400">Batch size and Zoom access are managed from Admin.</p>

//                 <div className="mt-10 grid grid-cols-2 gap-4 md:mt-12">
//                   {[
//                     { k: d.dDuration, v: d.dDurationV },
//                     { k: d.dTime, v: d.dTimeV },
//                     { k: d.dMode, v: d.dModeV },
//                     { k: d.dBatch, v: d.dBatchV },
//                     { k: d.dAccess, v: d.dAccessV },
//                   ].map((row, i) => (
//                     <div key={i} className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 ${i === 4 ? "col-span-2" : ""}`}>
//                       <p className="text-[11px] uppercase tracking-wide text-gray-500">{row.k}</p>
//                       <p className="mt-1.5 text-sm font-medium text-white/90">{row.v}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <p className="mt-8 text-base leading-relaxed text-gray-300 md:text-lg">{d.pricingNote}</p>
//                 <p className="mt-3 text-sm text-gray-400">{d.seats}</p>
//               </div>

//               {/* Pricing card */}
//               <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#111222] p-6 md:p-8 lg:sticky lg:top-28">
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.pricingTitle}</p>
//                 <h3 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">{d.heroTitle}</h3>
//                 <p className="mt-2 text-sm text-gray-400">{d.heroSubtitle}</p>

//                 <div className="mt-6 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#D4AF37]">
//                   {d.priceOffer}
//                 </div>

//                 <div className="mt-6 flex items-end justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//                   <div>
//                     <p className="text-[11px] uppercase tracking-wide text-gray-500">{d.priceOriginal}</p>
//                     <p className="text-lg text-white/50 line-through">₹5000</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[11px] uppercase tracking-wide text-gray-500">{d.priceOffer}</p>
//                     <p className="text-4xl font-bold text-[#D4AF37]">₹99</p>
//                   </div>
//                 </div>

//                 <Button asChild className="mt-6 w-full rounded-full py-6 text-base">
//                   <Link href={`/${locale}/auth`}>{d.ctaEnroll}</Link>
//                 </Button>
//                 <p className="mt-3 text-center text-xs text-gray-500">
//                   After registration you will access your dashboard.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* Testimonials placeholder */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-28">
//             <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">{d.testiTitle}</p>
//             <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.testiTitle}</h2>
//             <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
//               {["Asha", "Kiran", "Meera"].map((n) => (
//                 <Card key={n} className="rounded-2xl border border-white/10 bg-white/5">
//                   <CardHeader className="p-6 md:p-8">
//                     <div className="mb-5 flex items-center gap-3">
//                       <Image
//                         src="https://placehold.co/200x200/090A15/D4AF37"
//                         width={48}
//                         height={48}
//                         alt="Student profile placeholder"
//                         className="h-12 w-12 rounded-full border border-white/10"
//                         unoptimized
//                       />
//                       <div>
//                         <CardTitle className="text-base text-white">{n}</CardTitle>
//                         <CardDescription className="text-gray-300">{d.testiTitle}</CardDescription>
//                       </div>
//                     </div>
//                     <CardDescription className="text-gray-300">"Clear, calm guidance with real heritage depth."</CardDescription>
//                   </CardHeader>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* ─── 9  FAQ ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.faqTitle}</p>
//             <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.faqTitle}</h2>
//             <div className="mx-auto mt-10 max-w-3xl md:mt-12">
//               <Accordion type="single" collapsible>
//                 <AccordionItem value="1" className="border-b border-white/10 py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq1Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq1A}</AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="2" className="border-b border-white/10 py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq2Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq2A}</AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="3" className="border-b border-white/10 py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq3Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq3A}</AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="4" className="border-b border-white/10 py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq4Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq4A}</AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="5" className="border-b border-white/10 py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq5Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq5A}</AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="6" className="py-1">
//                   <AccordionTrigger className="text-left text-base text-white/90 hover:no-underline">{d.faq6Q}</AccordionTrigger>
//                   <AccordionContent className="text-gray-400">{d.faq6A}</AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </div>
//           </section>

//           {/* Final CTA */}
//           <section className="bg-gradient-to-br from-[#312E81] via-[#090A15] to-[#4F46E5]">
//             <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-24">
//               <div className="flex flex-col items-start justify-between gap-6 rounded-[2.4rem] border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:p-8">
//                 <div>
//                   <h2 className="font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.finalTitle}</h2>
//                   <p className="mt-5 text-base text-gray-300 leading-relaxed md:text-lg">{d.finalSub}</p>
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   <Button variant="gold" asChild className="rounded-full px-7 py-6 text-base">
//                     <Link href={`/${locale}/auth`}>{d.ctaReserve}</Link>
//                   </Button>
//                   <Button variant="outline" disabled title={d.joinZoomDisabled} className="rounded-full px-7 py-6 text-base text-white">
//                     {d.joinZoom}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Footer */}
//           <footer id="contact" className="border-t border-[#26273F]">
//             <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3 md:px-8 lg:px-12">
//               <div>
//                 <p className="font-serif text-lg text-white">{d.brandName}</p>
//                 <p className="text-xs text-gray-400 tracking-wide">{d.brandOrg}</p>
//                 <p className="mt-5 text-base text-gray-300 leading-relaxed md:text-lg">
//                   Preserving ancient Indian cultural heritage through traditional palm leaf manuscripts.
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-white">{d.contactTitle}</p>
//                 <ul className="mt-5 space-y-2 text-base text-gray-300 md:text-lg">
//                   <li>sutraprinting@sifworld.com</li>
//                   <li>info@sifworld.com</li>
//                   <li>+91 96528 56665</li>
//                   <li>Siddipet, Telangana</li>
//                 </ul>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-white">{d.linksTitle}</p>
//                 <ul className="mt-5 space-y-2 text-base text-gray-300 md:text-lg">
//                   <li><a href="#" className="hover:text-white">{d.privacy}</a></li>
//                   <li><a href="#" className="hover:text-white">{d.terms}</a></li>
//                   <li><a href="#contact" className="hover:text-white">{d.contact}</a></li>
//                 </ul>
//               </div>
//             </div>
//             <div className="mx-auto max-w-7xl px-5 pb-10 text-xs text-gray-400 tracking-wide md:px-8 lg:px-12">
//               {d.footerRights}
//             </div>
//           </footer>
//         </main>
//       </div>

//       {/* ── Sticky Floating CTA ── */}
//       <Link
//         href={`/${locale}/auth`}
//         className="fixed bottom-4 left-1/2 z-[950] -translate-x-1/2 inline-flex max-w-[90vw] items-center gap-2 whitespace-nowrap bg-[#B64728] px-5 py-3 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_8px_28px_rgba(182,71,40,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#9A3A1E] sm:px-7 sm:py-3.5 sm:text-sm lg:bottom-6 lg:px-10 lg:py-4"
//       >
//         Reserve Seat at ₹99 →
//       </Link>

//     </div>
//   )
// }






























// import Image from "next/image"
// import type { Locale } from "@/lib/i18n"
// import { getDictionary } from "@/lib/i18n"
// import { Button } from "@/components/ui/button"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
// import Link from "next/link"
// import { BookOpen, Landmark, Leaf, Sparkles, Users, Video } from "lucide-react"

// export default async function Landing({
//   params,
// }: {
//   params: Promise<{ locale: Locale }>
// }) {
//   const { locale } = await params
//   const d = getDictionary(locale)

//   return (
//     <div className="relative bg-[#090A15] text-white">
//       {/* Single subtle ambient glow */}
//       <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-[200px]" />

//       <div className="relative z-10">
//         <div className="border-b border-white/5 bg-[#111222]">
//           <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 text-xs md:px-8 lg:px-12">
//             <span className="text-[#D4AF37]/80">{d.announcement}</span>
//             <div className="hidden sm:block">
//               <LanguageSwitcher locale={locale} />
//             </div>
//           </div>
//         </div>

//         <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090A15]/90 backdrop-blur-lg">
//           <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-5 py-4 md:px-8 lg:px-12">
//             {/* Logo */}
//             <div className="flex items-center gap-2">
//               <Image
//                 src="/logo.png"
//                 width={50}
//                 height={50}
//                 alt="Palm Leaf Sutra Logo"
//                 className="bg-transparent"
//               />
//               <div className="leading-tight">
//                 <p className="font-serif text-lg text-white">{d.brandName}</p>
//                 <p className="text-[11px] tracking-wide text-white/40">{d.brandOrg}</p>
//               </div>
//             </div>

//             <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
//               <a href="#about" className="transition-colors hover:text-white">{d.navAbout}</a>
//               <a href="#masterclass" className="transition-colors hover:text-white">{d.navMasterclass}</a>
//               <a href="#heritage" className="transition-colors hover:text-white">{d.navHeritage}</a>
//               <a href="#contact" className="transition-colors hover:text-white">{d.navContact}</a>
//             </nav>
//             <div className="flex items-center gap-3">
//               <div className="sm:hidden">
//                 <LanguageSwitcher locale={locale} />
//               </div>
//               <Button asChild className="rounded-full px-5 text-sm">
//                 <Link href={`/${locale}/auth`}>{d.ctaRegister}</Link>
//               </Button>
//             </div>
//           </div>
//         </header>

//         <main>
//           {/* ─── 1  Hero ─── */}
//           <section
//             id="masterclass"
//             className="relative overflow-hidden bg-[#090A15]"
//           >
//             <div className="mx-auto grid max-w-7xl items-start lg:items-center lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px]">

//               {/* ── Left: all text content ── */}
//               <div className="px-5 pb-16 pt-6 md:px-8 md:pb-20 md:pt-8 lg:px-12 lg:pb-24 lg:pt-10">

//                 {/* Live badge */}
//                 <div className="mb-6 inline-flex items-center gap-2 border border-[#D4AF37]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
//                   <span className="relative flex h-[5px] w-[5px]">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
//                     <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#D4AF37]" />
//                   </span>
//                   Live Masterclass &nbsp;·&nbsp; Enrolling Now
//                 </div>

//                 {/* Stacked headline */}
//                 <h1 className="font-serif font-extrabold leading-[1.05] tracking-tight">
//                   <span className="block text-5xl text-white md:text-6xl">Clarity.</span>
//                   <span className="block text-5xl text-white md:text-6xl">Diamond Sutra.</span>
//                   <span className="block text-5xl italic text-[#D4AF37] md:text-6xl">Mind Mastery.</span>
//                 </h1>

//                 {/* Italic serif subtitle */}
//                 <p className="mt-5 max-w-lg font-serif text-base italic text-white/38 md:text-lg">
//                   {d.heroSubtitle}
//                 </p>

//                 {/* Body with left gold border */}
//                 <p className="mt-4 max-w-md border-l-2 border-[#D4AF37]/35 pl-4 text-sm leading-relaxed text-white/52 md:text-base">
//                   {d.heroBody}
//                 </p>

//                 {/* Meta chips */}
//                 <div className="mt-7 flex flex-wrap gap-2">
//                   {[d.chipDays, d.chipTime, d.chipZoom].map((chip) => (
//                     <span
//                       key={chip}
//                       className="border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/60"
//                     >
//                       {chip}
//                     </span>
//                   ))}
//                   <span className="border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-[11px] font-semibold text-[#D4AF37]">
//                     {d.chipInstructor}
//                   </span>
//                 </div>

//                 {/* CTA block */}
//                 <div className="mt-8">
//                   <Link
//                     href={`/${locale}/auth`}
//                     className="block w-full bg-[#B64728] py-4 text-center text-sm font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
//                   >
//                     Reserve Seat
//                   </Link>
//                   <p className="mt-3 text-[11px] text-white/25">
//                     Only <strong className="text-[#D4AF37]/50">30 seats</strong> available in this batch
//                   </p>
//                 </div>

//                 {/* Secondary CTA */}
//                 <div className="mt-5">
//                   <a
//                     href="#heritage"
//                     className="inline-flex items-center gap-2 border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:bg-white/5"
//                   >
//                     {d.ctaExplore}
//                   </a>
//                 </div>
//               </div>

//               {/* ── Right: Dr. Savera photo ── */}
//               <div className="relative hidden lg:flex items-center justify-end pr-8 xl:pr-12">
//                 <div className="relative w-full max-w-[420px] xl:max-w-[480px]">
//                   <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                     <div className="aspect-[4/5]">
//                       <Image
//                         src="/drSavera1.jpeg"
//                         width={900}
//                         height={1100}
//                         alt="Dr. Rajesh Savera"
//                         className="h-full w-full object-cover object-top"
//                         priority
//                         unoptimized
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-3 text-right">
//                     <p className="font-serif text-base font-bold text-white">Dr. Rajesh Savera</p>
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
//                       Ayurveda Physician · Mindfulness Expert
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 2  Stats ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12 lg:px-12">
//             <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
//               {[
//                 { icon: <Landmark className="h-4 w-4" />, t: d.stats1 },
//                 { icon: <Leaf className="h-4 w-4" />, t: d.stats2 },
//                 { icon: <Sparkles className="h-4 w-4" />, t: d.stats3 },
//                 { icon: <BookOpen className="h-4 w-4" />, t: d.stats4 },
//               ].map((s, i) => (
//                 <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111222] text-[#D4AF37]">{s.icon}</div>
//                   <p className="text-sm font-medium text-white/80">{s.t}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ─── 3  About (Heritage) ─── */}
//           <section id="heritage" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 min-h-[80vh]">
//               <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                 <div className="aspect-[4/3]">
//                   <Image
//                     src="/drSavera.jpeg"
//                     width={1200}
//                     height={2000}
//                     alt="Artisan writing on palm leaf placeholder"
//                     className="h-full w-full object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navHeritage}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.whyTitle}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.whyBody}</p>
//                 <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
//                   {[d.whyB1, d.whyB2, d.whyB3, d.whyB4].map((item) => (
//                     <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                       <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
//                       <p className="text-sm leading-relaxed text-white/70">{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 4  Why Diamond Sutra ─── */}
//           <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navAbout}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.dsTitle}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.dsBody}</p>
//                 <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
//                   {[d.dsT1, d.dsT2].map((item) => (
//                     <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                       <div className="mb-4 h-9 w-9 rounded-full border border-white/10 bg-[#111222]" />
//                       <p className="text-sm font-medium leading-relaxed text-white/70">{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                 <div className="aspect-[4/3]">
//                   <Image
//                     src="Palm leaf manuscript close-up.jpg"
//                     width={1200}
//                     height={700}
//                     alt="Historic Diamond Sutra placeholder"
//                     className="h-full w-full object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 5  What you'll learn ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.navMasterclass}</p>
//             <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.learnTitle}</h2>
//             <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
//               {[
//                 { icon: <BookOpen className="h-5 w-5" />, t: d.learn1T, d: d.learn1D },
//                 { icon: <Landmark className="h-5 w-5" />, t: d.learn2T, d: d.learn2D },
//                 { icon: <Sparkles className="h-5 w-5" />, t: d.learn3T, d: d.learn3D },
//                 { icon: <Users className="h-5 w-5" />, t: d.learn4T, d: d.learn4D },
//                 { icon: <Leaf className="h-5 w-5" />, t: d.learn5T, d: d.learn5D },
//                 { icon: <Video className="h-5 w-5" />, t: d.learn6T, d: d.learn6D },
//               ].map((c, i) => (
//                 <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
//                   <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111222] text-[#D4AF37]">
//                     {c.icon}
//                   </div>
//                   <p className="text-sm font-semibold text-white/90">{c.t}</p>
//                   <p className="mt-2 text-sm leading-relaxed text-gray-400">{c.d}</p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ─── 6  Your guide ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
//             <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
//               <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
//                 <div className="aspect-[4/5]">
//                   <Image
//                     src="drSaveraKimono.jpeg"
//                     width={900}
//                     height={1100}
//                     alt="Dr Rajesh Savera placeholder"
//                     className="h-full w-full object-cover"
//                     unoptimized
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.instTitle}</p>
//                 <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.instName}</h2>
//                 <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">{d.instBody}</p>
//                 <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm md:p-8">
//                   <p><span className="font-medium text-white">{d.dTime}:</span> <span className="text-gray-400">{d.dTimeV}</span></p>
//                   <p><span className="font-medium text-white">{d.dDuration}:</span> <span className="text-gray-400">{d.dDurationV}</span></p>
//                   <p><span className="font-medium text-white">{d.dMode}:</span> <span className="text-gray-400">{d.dModeV}</span></p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ─── 7  Program details + Pricing ─── */}
//           <section className="bg-[#0D0E1C] py-20 md:py-24 lg:py-28">
//             <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">

//               {/* Section header */}
//               <div className="mb-12 md:mb-16">
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.detailsTitle}</p>
//                 <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
//                   Begin Your <em className="italic text-[#D4AF37]">Diamond Sutra</em> Journey
//                 </h2>
//                 <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
//                   Everything you need. Nothing you don&apos;t. One price, full access, no upsells.
//                 </p>
//               </div>

//               {/* Main grid */}
//               <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">

//                 {/* ── Left: what's included ── */}
//                 <div>
//                   {[
//                     { icon: "15", label: "15 Live Sessions",            desc: "One per day, each building on the last. No filler." },
//                     { icon: "⏰", label: `${d.dTime} · ${d.dTimeV}`,    desc: "The most receptive hour. Set the tone for your entire day." },
//                     { icon: "▶",  label: "All Sessions Recorded",        desc: "Every recording shared same day. Nothing gated behind live attendance." },
//                     { icon: "📄", label: "Session Notes & Study Sheets", desc: "Curated reference material after each session." },
//                     { icon: "30", label: `${d.dBatch} · ${d.dBatchV}`,  desc: "Small cohort. Ask questions. Get real answers." },
//                     { icon: "∞",  label: "Practice That Lasts",          desc: "Leave with a daily ritual — not an app subscription." },
//                   ].map((item) => (
//                     <div key={item.label} className="flex items-start gap-4 border-b border-white/[0.06] py-5 first:pt-0 last:border-0">
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] text-xs font-bold text-[#D4AF37]">
//                         {item.icon}
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-white/90">{item.label}</p>
//                         <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
//                       </div>
//                     </div>
//                   ))}

//                   {/* Detail chips */}
//                   <div className="grid grid-cols-3 gap-3 pt-6">
//                     {[
//                       { k: d.dDuration, v: d.dDurationV },
//                       { k: d.dMode,     v: d.dModeV     },
//                       { k: d.dAccess,   v: d.dAccessV   },
//                     ].map((chip) => (
//                       <div key={chip.k} className="border border-white/10 bg-white/[0.03] p-4">
//                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{chip.k}</p>
//                         <p className="mt-1 text-sm font-semibold text-white/80">{chip.v}</p>
//                       </div>
//                     ))}
//                   </div>

//                   <p className="mt-8 text-base leading-relaxed text-gray-300 md:text-lg">{d.pricingNote}</p>
//                   <p className="mt-2 text-sm text-gray-500">{d.seats}</p>
//                 </div>

//                 {/* ── Right: pricing card ── */}
//                 <div className="lg:sticky lg:top-28">
//                   <div className="border border-[#D4AF37]/25 bg-[#111222]">
//                     <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8903A]" />
//                     <div className="p-6 md:p-8">

//                       {/* Label + title */}
//                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/60">{d.pricingTitle}</p>
//                       <h3 className="mt-2 font-serif text-xl font-bold text-white md:text-2xl">{d.heroTitle}</h3>
//                       <p className="mt-1 text-sm text-gray-500">{d.heroSubtitle}</p>

//                       <div className="my-5 h-px w-full bg-white/[0.07]" />

//                       {/* Price block */}
//                       <div className="mb-2 flex items-baseline gap-3">
//                         <span className="text-sm text-white/30 line-through">&#8377;5,000</span>
//                         <span className="font-serif text-5xl font-extrabold text-[#D4AF37] leading-none">
//                           <span className="text-2xl align-top leading-tight">&#8377;</span>99
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-white/25">One-time &middot; No hidden fees</p>

//                       {/* Savings badge */}
//                       <div className="mt-3 inline-flex items-center bg-[#B64728]/20 border border-[#B64728]/40 px-3 py-1.5">
//                         <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ef6c47]">
//                           You save &#8377;4,901 &middot; 98% off
//                         </span>
//                       </div>

//                       <div className="my-5 h-px w-full bg-white/[0.07]" />

//                       {/* Feature checklist */}
//                       <ul className="mb-6 space-y-2.5">
//                         {[
//                           "15 live Zoom sessions",
//                           "All recordings included",
//                           "Session notes & study sheets",
//                           "Direct instructor access",
//                           "Lifetime daily practice framework",
//                         ].map((item) => (
//                           <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
//                             <span className="text-[#D4AF37]">&#10003;</span>
//                             {item}
//                           </li>
//                         ))}
//                       </ul>

//                       <Link
//                         href={`/${locale}/auth`}
//                         className="block w-full bg-[#B64728] py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
//                       >
//                         {d.ctaEnroll}
//                       </Link>

//                       <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
//                         Only <strong className="text-[#D4AF37]/40">30 seats</strong> in this batch. Price returns to &#8377;5,000 once offer closes.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </section>

//           {/* ─── 8  Testimonials ─── */}
//           <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-12 lg:py-28">
//             <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">{d.testiTitle}</p>
//             <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">{d.testiTitle}</h2>
//             <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
//               {["Asha", "Kiran", "Meera"].map((n) => (
//                 <Card key={n} className="rounded-2xl border border-white/10 bg-white/5">
//                   <CardHeader className="p-6 md:p-8">
//                     <div className="mb-5 flex items-center gap-3">
//                       <Image
//                         src="https://placehold.co/200x200/090A15/D4AF37"
//                         width={48}
//                         height={48}
//                         alt="Student profile placeholder"
//                         className="h-12 w-12 rounded-full border border-white/10"
//                         unoptimized
//                       />
//                       <div>
//                         <CardTitle className="text-base text-white">{n}</CardTitle>
//                         <CardDescription className="text-gray-300">{d.testiTitle}</CardDescription>
//                       </div>
//                     </div>
//                     <CardDescription className="text-gray-300">&quot;Clear, calm guidance with real heritage depth.&quot;</CardDescription>
//                   </CardHeader>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* ─── 9  FAQ ─── */}
//           <section className="bg-[#0D0E1C] py-20 md:py-24 lg:py-28">
//             <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">

//               {/* Section header */}
//               <div className="mb-12 md:mb-16">
//                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.faqTitle}</p>
//                 <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
//                   Questions <em className="italic text-[#D4AF37]">answered.</em>
//                 </h2>
//                 <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
//                   Everything you need to know before you decide.
//                 </p>
//               </div>

//               {/* Full-width accordion */}
//               <div className="mx-auto max-w-3xl">
//                 <Accordion type="single" collapsible>
//                   {[
//                     { v: "1", q: d.faq1Q, a: d.faq1A },
//                     { v: "2", q: d.faq2Q, a: d.faq2A },
//                     { v: "3", q: d.faq3Q, a: d.faq3A },
//                     { v: "4", q: d.faq4Q, a: d.faq4A },
//                     { v: "5", q: d.faq5Q, a: d.faq5A },
//                     { v: "6", q: d.faq6Q, a: d.faq6A },
//                   ].map((item, i, arr) => (
//                     <AccordionItem
//                       key={item.v}
//                       value={item.v}
//                       className={`border-b border-white/[0.07] ${i === arr.length - 1 ? "border-b-0" : ""}`}
//                     >
//                       <AccordionTrigger className="py-5 text-left text-sm font-semibold text-white/80 hover:text-white hover:no-underline md:text-base [&[data-state=open]]:text-[#D4AF37]">
//                         {item.q}
//                       </AccordionTrigger>
//                       <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-400 md:text-base">
//                         {item.a}
//                       </AccordionContent>
//                     </AccordionItem>
//                   ))}
//                 </Accordion>
//               </div>
//             </div>
//           </section>

//           {/* ─── 10  Final CTA ─── UPDATED ─── */}
//           <section className="relative overflow-hidden bg-[#07080F]">

//             {/* Subtle top + bottom gold border lines */}
//             <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
//             <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

//             {/* Very soft background glow — no rings */}
//             <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.03] blur-[120px]" />

//             {/* ── Content ── */}
//             <div className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-24">

//               {/* Eyebrow */}
//               <div className="mb-6 flex items-center justify-center gap-3">
//                 <span className="h-px w-8 bg-[#D4AF37]/30" />
//                 <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]/50">
//                   Limited Seats · Enrolling Now
//                 </span>
//                 <span className="h-px w-8 bg-[#D4AF37]/30" />
//               </div>

//               {/* Headline */}
//               <h2 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
//                 {d.finalTitle}
//                 <em className="mt-1 block italic text-[#D4AF37]">Starts Within.</em>
//               </h2>

//               {/* Diamond ornament */}
//               <div className="mx-auto my-6 flex items-center justify-center gap-2">
//                 <span className="h-px w-12 bg-[#D4AF37]/20" />
//                 <span className="block h-1.5 w-1.5 rotate-45 bg-[#D4AF37]/40" />
//                 <span className="h-px w-12 bg-[#D4AF37]/20" />
//               </div>

//               {/* Sub copy */}
//               <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/35 md:text-base">
//                 {d.finalSub}
//               </p>

//               {/* CTA buttons */}
//               <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
//                 <Link
//                   href={`/${locale}/auth`}
//                   className="group relative inline-flex w-full items-center justify-center overflow-hidden sm:w-auto"
//                 >
//                   <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//                   <span className="relative inline-flex items-center gap-2.5 bg-[#B64728] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.40)] transition-all duration-300 group-hover:bg-[#9A3A1E]">
//                     {d.ctaReserve}
//                     <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-1">→</span>
//                   </span>
//                 </Link>

//                 <button
//                   disabled
//                   title={d.joinZoomDisabled}
//                   className="inline-flex w-full items-center justify-center border border-white/[0.07] px-10 py-3.5 text-sm font-medium text-white/15 cursor-not-allowed sm:w-auto"
//                 >
//                   {d.joinZoom}
//                 </button>
//               </div>

//               <p className="mt-5 text-[11px] tracking-wide text-white/15">
//                 Only <strong className="text-[#D4AF37]/35">30 seats</strong> per batch — no exceptions
//               </p>
//             </div>

//             <style>{`
//               @keyframes ctaShimmerSlide {
//                 0%   { background-position: -200% center; }
//                 100% { background-position:  200% center; }
//               }
//             `}</style>
//           </section>

//           {/* ─── Footer ─── UPDATED ─── */}
//           <footer id="contact" className="relative bg-[#05060C]">

//             {/* Gradient top border */}
//             <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

//             {/* Subtle inner glow strip just below the border */}
//             <div className="h-6 w-full bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent" />

//             <div className="mx-auto max-w-7xl px-5 pb-0 pt-6 md:px-8 lg:px-12">

//               {/* ── Main grid ── */}
//               <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr] md:gap-8">

//                 {/* Col 1: Logo + Brand */}
//                 <div className="space-y-4">
//                   {/* Logo row — same as header */}
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       {/* Subtle gold halo behind logo */}
//                       <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-[10px]" />
//                       <Image
//                         src="/logo.png"
//                         width={44}
//                         height={44}
//                         alt="Palm Leaf Sutra Logo"
//                         className="relative bg-transparent"
//                       />
//                     </div>
//                     <div className="leading-tight">
//                       <p className="font-serif text-[15px] font-bold text-white/90">{d.brandName}</p>
//                       <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]/50">{d.brandOrg}</p>
//                     </div>
//                   </div>

//                   {/* Thin gold rule under brand */}
//                   <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />

//                   <p className="max-w-[230px] text-[11px] leading-relaxed text-white/28">
//                     Preserving ancient Indian cultural heritage through traditional palm leaf manuscripts and living wisdom traditions.
//                   </p>

//                   {/* Tagline badge */}
//                   <div className="inline-flex items-center gap-2 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] px-3 py-1.5">
//                     <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
//                     <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]/45">Ancient Wisdom · Modern Clarity</span>
//                     <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
//                   </div>
//                 </div>

//                 {/* Col 2: Contact */}
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2 pb-1">
//                     <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
//                     <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.contactTitle}</p>
//                   </div>
//                   <ul className="space-y-2.5">
//                     {[
//                       "sutraprinting@sifworld.com",
//                       "info@sifworld.com",
//                       "+91 96528 56665",
//                       "Siddipet, Telangana",
//                     ].map((item) => (
//                       <li key={item} className="text-[11px] text-white/32 transition-colors hover:text-white/65 cursor-default">{item}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Col 3: Links */}
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2 pb-1">
//                     <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
//                     <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.linksTitle}</p>
//                   </div>
//                   <ul className="space-y-2.5">
//                     {[
//                       { href: "#",        label: d.privacy },
//                       { href: "#",        label: d.terms   },
//                       { href: "#contact", label: d.contact },
//                     ].map((item) => (
//                       <li key={item.label}>
//                         <a href={item.href} className="group flex items-center gap-2.5 text-[11px] text-white/32 transition-colors hover:text-[#D4AF37]/80">
//                           <span className="h-px w-3 bg-[#D4AF37]/25 transition-all duration-300 group-hover:w-5 group-hover:bg-[#D4AF37]/60" />
//                           {item.label}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* ── Bottom bar ── */}
//               <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] py-5 text-[10px] text-white/14 md:flex-row">
//                 <span>{d.footerRights}</span>
//                 <div className="flex items-center gap-2">
//                   <span className="h-px w-4 bg-[#D4AF37]/15" />
//                   <span className="text-[#D4AF37]/22 tracking-widest uppercase">Crafted with care · India</span>
//                   <span className="h-px w-4 bg-[#D4AF37]/15" />
//                 </div>
//               </div>
//             </div>
//           </footer>
//         </main>
//       </div>

//       {/* ── Sticky Floating CTA ── */}
//       <Link
//         href={`/${locale}/auth`}
//         className="fixed bottom-4 left-1/2 z-[950] -translate-x-1/2 inline-flex max-w-[90vw] items-center gap-2 whitespace-nowrap bg-[#B64728] px-5 py-3 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_8px_28px_rgba(182,71,40,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#9A3A1E] sm:px-7 sm:py-3.5 sm:text-sm lg:bottom-6 lg:px-10 lg:py-4"
//       >
//         Reserve Your Seat →
//       </Link>

//     </div>
//   )
// }






























import Image from "next/image"
import type { Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher"
import Link from "next/link"
import { BookOpen, Landmark, Leaf, Sparkles, Users, Video } from "lucide-react"

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const d = getDictionary(locale)

  return (
    <div className="relative bg-[#090A15] text-white">
      {/* Single subtle ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4F46E5]/10 blur-[200px]" />

      <div className="relative z-10">
        <div className="border-b border-white/5 bg-[#111222]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 text-xs md:px-8 lg:px-12">
            <span className="text-[#D4AF37]/80">{d.announcement}</span>
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>

        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090A15]/90 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-5 py-4 md:px-8 lg:px-12">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="Palm Leaf Sutra Logo"
                className="bg-transparent"
              />
              <div className="leading-tight">
                <p className="font-serif text-lg text-white">{d.brandName}</p>
                <p className="text-[11px] tracking-wide text-white/40">{d.brandOrg}</p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
              <a href="#about" className="transition-colors hover:text-white">{d.navAbout}</a>
              <a href="#masterclass" className="transition-colors hover:text-white">{d.navMasterclass}</a>
              <a href="#heritage" className="transition-colors hover:text-white">{d.navHeritage}</a>
              <a href="#contact" className="transition-colors hover:text-white">{d.navContact}</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="sm:hidden">
                <LanguageSwitcher locale={locale} />
              </div>
              <Link
                href={`/${locale}/auth`}
                className="inline-flex items-center bg-[#B64728] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E] sm:text-sm"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* ─── 1  Hero ─── */}
          <section
            id="masterclass"
            className="relative overflow-hidden bg-[#090A15]"
          >
            <div className="mx-auto grid max-w-7xl items-start lg:items-center lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_520px]">

              {/* ── Left: all text content ── */}
              <div className="px-5 pb-16 pt-6 md:px-8 md:pb-20 md:pt-8 lg:px-12 lg:pb-24 lg:pt-10">

                {/* Live badge */}
                <div className="mb-6 inline-flex items-center gap-2 border border-[#D4AF37]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                  <span className="relative flex h-[5px] w-[5px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
                    <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#D4AF37]" />
                  </span>
                  Live Masterclass &nbsp;·&nbsp; Enrolling Now
                </div>

                {/* Stacked headline */}
                <h1 className="font-serif font-extrabold leading-[1.05] tracking-tight">
                  <span className="block text-5xl text-white md:text-6xl">Diamond Sutra</span>
                  <span className="block text-4xl italic text-[#D4AF37] md:text-5xl">Masterclass</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 max-w-lg font-serif text-lg italic text-white/55 md:text-xl">
                  A 15-Day Journey into Absolute Clarity
                </p>

                {/* Hook question */}
                <p className="mt-4 max-w-md font-serif text-base italic text-[#D4AF37]/70">
                  What if clarity was not something you achieve&hellip; but something you uncover?
                </p>

                {/* Body paragraphs */}
                <p className="mt-4 max-w-md border-l-2 border-[#D4AF37]/35 pl-4 text-sm leading-relaxed text-white/52 md:text-base">
                  The Diamond Sutra is one of the most profound wisdom texts in the Buddhist tradition. Short, sharp, and piercing like a diamond, it cuts through illusion, ego, attachment, fear, and mental noise &mdash; revealing a deeper truth about reality and self.
                </p>

                <div className="mt-4 max-w-md space-y-1 pl-4">
                  <p className="text-sm font-medium text-white/60">This masterclass is not philosophy.</p>
                  <p className="text-sm font-semibold text-[#D4AF37]/80 italic">It is transformation.</p>
                </div>

                {/* Meta chips */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {[d.chipDays, d.chipTime, d.chipZoom].map((chip) => (
                    <span
                      key={chip}
                      className="border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/60"
                    >
                      {chip}
                    </span>
                  ))}
                  <span className="border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-[11px] font-semibold text-[#D4AF37]">
                    {d.chipInstructor}
                  </span>
                </div>

                {/* CTA block */}
                <div className="mt-8">
                  <Link
                    href={`/${locale}/auth`}
                    className="block w-full bg-[#B64728] py-4 text-center text-sm font-bold uppercase tracking-[0.07em] text-white shadow-[0_4px_18px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
                  >
                    Enroll now
                  </Link>
                  <p className="mt-3 text-[11px] text-white/25">
                    Only <strong className="text-[#D4AF37]/50">30 seats</strong> available in this batch
                  </p>
                </div>

                {/* Secondary CTA */}
                <div className="mt-5">
                  <a
                    href="#heritage"
                    className="inline-flex items-center gap-2 border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:bg-white/5"
                  >
                    {d.ctaExplore}
                  </a>
                </div>
              </div>

              {/* ── Right: Dr. Savera photo ── */}
              <div className="relative hidden lg:flex items-center justify-end pr-8 xl:pr-12">
                <div className="relative w-full max-w-[420px] xl:max-w-[480px]">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
                    <div className="aspect-[4/5]">
                      <Image
                        src="/Palm leaf manuscript close-up.jpg"
                        width={900}
                        height={1100}
                        alt="Dr. Rajesh Savera"
                        className="h-full w-full object-cover object-top"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <p className="font-serif text-base font-bold text-white">Dr. Rajesh Savera</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      Ayurveda Physician · Mindfulness Expert
                    </p>
                  </div>
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
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 min-h-[80vh]">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
                <div className="aspect-[4/3]">
                  <Image
                    src="/drSavera.jpeg"
                    width={1200}
                    height={2000}
                    alt="Artisan writing on palm leaf placeholder"
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">The Text</p>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">What Is the Diamond Sutra?</h2>
                <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">
                  The Diamond Sutra (Vajracchedik&#257; Praj&#241;&#257;p&#257;ramit&#257; S&#363;tra) is a timeless conversation between the Buddha and his disciple Subhuti.
                </p>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">It explores:</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "The illusion of identity",
                    "Non-attachment to results",
                    "True generosity",
                    "The nature of reality",
                    "Emptiness (&#346;&#363;nyat&#257;) as wisdom",
                    "Living without ego while fully engaging in the world",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <span className="mt-0.5 shrink-0 text-[#D4AF37]">&#9670;</span>
                      <p className="text-sm leading-relaxed text-white/70" dangerouslySetInnerHTML={{__html: item}} />
                    </div>
                  ))}
                </div>
                <p className="mt-6 font-serif text-base italic text-[#D4AF37]/70">It challenges the mind &mdash; gently but powerfully.</p>
              </div>
            </div>
          </section>

          {/* ─── 4  Why Diamond Sutra ─── */}
          <section id="about" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">Purpose</p>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">Why This Masterclass?</h2>
                <p className="mt-5 text-base leading-relaxed text-gray-300 md:text-lg">In today&apos;s world, we are:</p>
                <ul className="mt-3 space-y-1.5">
                  {["Overstimulated", "Overthinking", "Attached to identity, success, validation", "Searching for peace outside"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/50">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]/50" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-gray-300">The Diamond Sutra offers a radical yet practical solution:</p>
                <div className="mt-5 space-y-2">
                  {[
                    "Act fully.",
                    "Give fully.",
                    "Love fully.",
                  ].map((item) => (
                    <p key={item} className="font-serif text-lg font-bold text-[#D4AF37]">&#128073; {item}</p>
                  ))}
                  <p className="font-serif text-lg font-bold text-[#D4AF37]">&#128073; Without attachment.</p>
                </div>
                <p className="mt-6 border-l-2 border-[#D4AF37]/35 pl-4 text-sm leading-relaxed text-white/55">
                  This 15-Day Live Guided Masterclass helps you not just understand the text &mdash; but <em>experience</em> it.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
                <div className="aspect-[4/3]">
                  <Image
                    src="Palm leaf manuscript close-up.jpg"
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

          {/* ─── 5  What You Will Experience ─── */}
          <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">The Experience</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">What You Will Experience</h2>

            {/* Day-by-day block */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">

              {/* Left: Each session */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111222] text-[#D4AF37]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="font-serif text-lg font-bold text-white">Day-by-Day Exploration</p>
                <p className="mt-2 text-sm text-white/40">Each session includes:</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Guided explanation of key verses",
                    "Real-life application of teachings",
                    "Reflective exercises",
                    "Meditation practices",
                    "Q&A and practical discussion",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/65">
                      <span className="text-[#D4AF37]">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: What you gain */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111222] text-[#D4AF37]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="font-serif text-lg font-bold text-white">What You Will Gain</p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Mental clarity and sharper awareness",
                    "Freedom from over-identification with roles",
                    "Emotional stability",
                    "Detachment without indifference",
                    "Deeper meditation practice",
                    "Courage to act without fear of outcomes",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-white/65">
                      <span className="text-[#D4AF37]">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tagline */}
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/40 italic">
              This is wisdom for leaders, seekers, professionals, parents, entrepreneurs &mdash; anyone who wants inner freedom while living an active life.
            </p>

            {/* Who is this for */}
            <div className="mt-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">Audience</p>
              <h3 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">Who Is This For?</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { icon: <Leaf className="h-4 w-4" />, label: "Spiritual seekers" },
                  { icon: <Landmark className="h-4 w-4" />, label: "Corporate leaders looking for clarity" },
                  { icon: <Users className="h-4 w-4" />, label: "Entrepreneurs overwhelmed by outcomes" },
                  { icon: <Sparkles className="h-4 w-4" />, label: "Individuals struggling with ego or emotional turbulence" },
                  { icon: <BookOpen className="h-4 w-4" />, label: "Meditation practitioners" },
                  { icon: <Video className="h-4 w-4" />, label: "Students of philosophy" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="shrink-0 text-[#D4AF37]">{item.icon}</span>
                    <p className="text-sm text-white/65">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm italic text-[#D4AF37]/50">No prior knowledge is required.</p>
            </div>
          </section>

          {/* ─── 6  Your guide ─── */}
          <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24 lg:px-12 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111222]">
                <div className="aspect-[4/5]">
                  <Image
                    src="drSaveraKimono.jpeg"
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
          <section className="bg-[#0D0E1C] py-20 md:py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">

              {/* Section header */}
              <div className="mb-12 md:mb-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.detailsTitle}</p>
                <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
                  Begin Your <em className="italic text-[#D4AF37]">Diamond Sutra</em> Journey
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                  Everything you need. Nothing you don&apos;t. One price, full access, no upsells.
                </p>
              </div>

              {/* Main grid */}
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">

                {/* ── Left: what's included ── */}
                <div>
                  {[
                    { icon: "15", label: "15 Live Sessions",            desc: "One per day, each building on the last. No filler." },
                    { icon: "⏰", label: `${d.dTime} · ${d.dTimeV}`,    desc: "The most receptive hour. Set the tone for your entire day." },
                    { icon: "▶",  label: "All Sessions Recorded",        desc: "Every recording shared same day. Nothing gated behind live attendance." },
                    { icon: "📄", label: "Session Notes & Study Sheets", desc: "Curated reference material after each session." },
                    { icon: "30", label: `${d.dBatch} · ${d.dBatchV}`,  desc: "Small cohort. Ask questions. Get real answers." },
                    { icon: "∞",  label: "Practice That Lasts",          desc: "Leave with a daily ritual — not an app subscription." },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 border-b border-white/[0.06] py-5 first:pt-0 last:border-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] text-xs font-bold text-[#D4AF37]">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{item.label}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Detail chips */}
                  <div className="grid grid-cols-3 gap-3 pt-6">
                    {[
                      { k: d.dDuration, v: d.dDurationV },
                      { k: d.dMode,     v: d.dModeV     },
                      { k: d.dAccess,   v: d.dAccessV   },
                    ].map((chip) => (
                      <div key={chip.k} className="border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{chip.k}</p>
                        <p className="mt-1 text-sm font-semibold text-white/80">{chip.v}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 text-base leading-relaxed text-gray-300 md:text-lg">{d.pricingNote}</p>
                  <p className="mt-2 text-sm text-gray-500">{d.seats}</p>
                </div>

                {/* ── Right: pricing card ── */}
                <div className="lg:sticky lg:top-28">
                  <div className="border border-[#D4AF37]/25 bg-[#111222]">
                    <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8903A]" />
                    <div className="p-6 md:p-8">

                      {/* Label + title */}
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/60">{d.pricingTitle}</p>
                      <h3 className="mt-2 font-serif text-xl font-bold text-white md:text-2xl">{d.heroTitle}</h3>
                      <p className="mt-1 text-sm text-gray-500">{d.heroSubtitle}</p>

                      <div className="my-5 h-px w-full bg-white/[0.07]" />

                      {/* Price block */}
                      <div className="mb-2 flex items-baseline gap-3">
                        <span className="text-sm text-white/30 line-through">&#8377;5,000</span>
                        <span className="font-serif text-5xl font-extrabold text-[#D4AF37] leading-none">
                          <span className="text-2xl align-top leading-tight">&#8377;</span>99
                        </span>
                      </div>
                      <p className="text-[11px] text-white/25">One-time &middot; No hidden fees</p>

                      {/* Savings badge */}
                      <div className="mt-3 inline-flex items-center bg-[#B64728]/20 border border-[#B64728]/40 px-3 py-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ef6c47]">
                          You save &#8377;4,901 &middot; 98% off
                        </span>
                      </div>

                      <div className="my-5 h-px w-full bg-white/[0.07]" />

                      {/* Feature checklist */}
                      <ul className="mb-6 space-y-2.5">
                        {[
                          "15 live Zoom sessions",
                          "All recordings included",
                          "Session notes & study sheets",
                          "Direct instructor access",
                          "Lifetime daily practice framework",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                            <span className="text-[#D4AF37]">&#10003;</span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={`/${locale}/auth`}
                        className="block w-full bg-[#B64728] py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.35)] transition-colors hover:bg-[#9A3A1E]"
                      >
                        {d.ctaEnroll}
                      </Link>

                      <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
                        Only <strong className="text-[#D4AF37]/40">30 seats</strong> in this batch. Price returns to &#8377;5,000 once offer closes.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ─── 8  Testimonials ─── */}
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
                    <CardDescription className="text-gray-300">&quot;Clear, calm guidance with real heritage depth.&quot;</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section> */}

          {/* ─── 9  FAQ ─── */}
          <section className="bg-[#0D0E1C] py-20 md:py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">

              {/* Section header — centred */}
              <div className="mb-12 text-center md:mb-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/70">{d.faqTitle}</p>
                <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.1] md:text-5xl">
                  Questions <em className="italic text-[#D4AF37]">answered.</em>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                  Everything you need to know before you decide.
                </p>
              </div>

              {/* Full-width accordion */}
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
                    <AccordionItem
                      key={item.v}
                      value={item.v}
                      className={`border-b border-white/[0.07] ${i === arr.length - 1 ? "border-b-0" : ""}`}
                    >
                      <AccordionTrigger className="py-5 text-left text-sm font-semibold text-white/80 hover:text-white hover:no-underline md:text-base [&[data-state=open]]:text-[#D4AF37]">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-400 md:text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* ─── 10  Final CTA ─── UPDATED ─── */}
          <section className="relative overflow-hidden bg-[#07080F]">

            {/* Subtle top + bottom gold border lines */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

            {/* Very soft background glow — no rings */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.03] blur-[120px]" />

            {/* ── Content ── */}
            <div className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-24">

{/* Eyebrow */}
<div className="mb-6 flex items-center justify-center gap-3">
  <span className="h-px w-8 bg-[#D4AF37]/30" />
  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D4AF37]/50">
    Limited Seats · Enrolling Now
  </span>
  <span className="h-px w-8 bg-[#D4AF37]/30" />
</div>

{/* Headline */}
<h2 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
  {d.finalTitle}
  <em className="mt-1 block italic text-[#D4AF37]">Starts Within.</em>
</h2>

{/* Diamond ornament */}
<div className="mx-auto my-6 flex items-center justify-center gap-2">
  <span className="h-px w-12 bg-[#D4AF37]/20" />
  <span className="block h-1.5 w-1.5 rotate-45 bg-[#D4AF37]/40" />
  <span className="h-px w-12 bg-[#D4AF37]/20" />
</div>

{/* Sub copy */}
<p className="mx-auto max-w-sm text-sm leading-relaxed text-white/35 md:text-base">
  {d.finalSub}
</p>

{/* CTA buttons */}
<div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
  <Link
    href={`/${locale}/auth`}
    className="group relative inline-flex w-full items-center justify-center overflow-hidden sm:w-auto"
  >
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    <span className="relative inline-flex items-center gap-2.5 bg-[#B64728] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_24px_rgba(182,71,40,0.40)] transition-all duration-300 group-hover:bg-[#9A3A1E]">
      Enroll Now
      {/* <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-1">→</span> */}
    </span>
  </Link>

  <button
    disabled
    title={d.joinZoomDisabled}
    className="inline-flex w-full items-center justify-center border border-white/[0.07] px-10 py-3.5 text-sm font-medium text-white/15 cursor-not-allowed sm:w-auto"
  >
    {d.joinZoom}
  </button>
</div>

<p className="mt-5 text-[11px] tracking-wide text-white/15">
  Only <strong className="text-[#D4AF37]/35">30 seats</strong> per batch — no exceptions
</p>
</div>

            <style>{`
              @keyframes ctaShimmerSlide {
                0%   { background-position: -200% center; }
                100% { background-position:  200% center; }
              }
            `}</style>
          </section>

          {/* ─── Footer ─── UPDATED ─── */}
          <footer id="contact" className="relative bg-[#05060C]">

            {/* Gradient top border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

            {/* Subtle inner glow strip just below the border */}
            <div className="h-6 w-full bg-gradient-to-b from-[#D4AF37]/[0.04] to-transparent" />

            <div className="mx-auto max-w-7xl px-5 pb-0 pt-6 md:px-8 lg:px-12">

              {/* ── Main grid ── */}
              <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr] md:gap-8">

                {/* Col 1: Logo + Brand */}
                <div className="space-y-4">
                  {/* Logo row — same as header */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* Subtle gold halo behind logo */}
                      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-[10px]" />
                      <Image
                        src="/logo.png"
                        width={44}
                        height={44}
                        alt="Palm Leaf Sutra Logo"
                        className="relative bg-transparent"
                      />
                    </div>
                    <div className="leading-tight">
                      <p className="font-serif text-[15px] font-bold text-white/90">{d.brandName}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]/50">{d.brandOrg}</p>
                    </div>
                  </div>

                  {/* Thin gold rule under brand */}
                  <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />

                  <p className="max-w-[230px] text-[11px] leading-relaxed text-white/28">
                    Preserving ancient Indian cultural heritage through traditional palm leaf manuscripts and living wisdom traditions.
                  </p>

                  {/* Tagline badge */}
                  <div className="inline-flex items-center gap-2 border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] px-3 py-1.5">
                    <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]/45">Ancient Wisdom · Modern Clarity</span>
                    <span className="h-1 w-1 rotate-45 bg-[#D4AF37]/50" />
                  </div>
                </div>

                {/* Col 2: Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1">
                    <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.contactTitle}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "sutraprinting@sifworld.com",
                      "info@sifworld.com",
                      "+91 96528 56665",
                      "Siddipet, Telangana",
                    ].map((item) => (
                      <li key={item} className="text-[11px] text-white/32 transition-colors hover:text-white/65 cursor-default">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: Links */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1">
                    <span className="h-3 w-0.5 bg-[#D4AF37]/60" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#D4AF37]/55">{d.linksTitle}</p>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      { href: "#",        label: d.privacy },
                      { href: "#",        label: d.terms   },
                      { href: "#contact", label: d.contact },
                    ].map((item) => (
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

              {/* ── Bottom bar ── */}
              <div className="mt-10 border-t border-white/[0.06] py-5 text-center text-[10px] text-white/20">
                <span>{d.footerRights}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* ── Sticky Floating CTA ── */}
      <Link
        href={`/${locale}/auth`}
        className="fixed bottom-4 left-1/2 z-[950] -translate-x-1/2 inline-flex max-w-[90vw] items-center gap-2 whitespace-nowrap bg-[#B64728] px-5 py-3 text-xs font-bold uppercase tracking-[0.07em] text-white shadow-[0_8px_28px_rgba(182,71,40,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#9A3A1E] sm:px-7 sm:py-3.5 sm:text-sm lg:bottom-6 lg:px-10 lg:py-4"
      >
        Enroll Now 
      </Link>

    </div>
  )
}