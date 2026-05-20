"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { teamMembers, teamDivisions } from "@/lib/data";
import {
  Lightbulb,
  Target,
  Scale,
  Handshake,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  BarChart3,
  Globe,
  Megaphone,
  Smartphone,
  Code2,
  ShoppingCart,
  BrainCircuit,
  Database,
  Layers,
  Palette,
  Settings,
  LineChart,
} from "lucide-react";

// ─── Variants ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const principles = [
  { icon: Lightbulb, label: "Innovate", desc: "Always exploring the latest tech and trends." },
  { icon: Target, label: "Deliver Results", desc: "Measurable outcomes that truly matter." },
  { icon: Scale, label: "Scale Smartly", desc: "Solutions built to grow with your business." },
  { icon: Handshake, label: "Partner Long-Term", desc: "Your success is our success." },
];

const differentiators = [
  { title: "Integrated Approach", desc: "We don't just market, we engineer digital solutions." },
  { title: "Data-Driven Strategies", desc: "Every decision is backed by analytics." },
  { title: "Tailored Solutions", desc: "No cookie-cutter approaches—everything is customized." },
  { title: "Future-Focused Innovation", desc: "AI, automation, and intelligent systems drive our solutions." },
  { title: "Sustainable Growth", desc: "We design for long-term success, not just short-term wins." },
];

const marketingServices = [
  "Social Media Management",
  "Content Creation & Storytelling",
  "Digital Advertising",
  "Search Engine Optimization (SEO)",
  "Brand Strategy & Positioning",
  "Campaign Management",
];

const techServices = [
  { icon: Smartphone, label: "Mobile App Development", desc: "Seamless Android & iOS experiences" },
  { icon: Code2, label: "Custom Software & Systems", desc: "Automation & efficiency solutions" },
  { icon: ShoppingCart, label: "E-Commerce Platforms", desc: "Scalable online stores & marketplaces" },
  { icon: Settings, label: "ERP / ARP Systems", desc: "Integrated operations management" },
  { icon: Database, label: "Database Architecture", desc: "Secure, scalable, intelligent data solutions" },
  { icon: Layers, label: "System Integration", desc: "Streamlined workflows & better data flow" },
  { icon: Palette, label: "UI/UX Design", desc: "User-centered digital experiences" },
  { icon: LineChart, label: "Digital Strategy Consulting", desc: "Expert guidance for transformation" },
  { icon: BrainCircuit, label: "AI Automation", desc: "Streamlining tasks, improving decisions" },
];

const processSteps = [
  { n: "01", title: "Discovery & Analysis", desc: "Understand your business, goals, and audience" },
  { n: "02", title: "Strategy Development", desc: "Tailored digital and IT strategies" },
  { n: "03", title: "Design & Development", desc: "Build assets, platforms, and campaigns" },
  { n: "04", title: "Implementation", desc: "Deploy and launch solutions" },
  { n: "05", title: "Monitoring & Optimization", desc: "Refine performance continuously" },
];

const growthOutcomes = [
  { icon: TrendingUp, label: "Increase engagement and leads" },
  { icon: Settings, label: "Optimize operations" },
  { icon: Globe, label: "Improve brand presence" },
  { icon: BarChart3, label: "Build systems for long-term growth" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section className="relative overflow-hidden bg-[#f6faf8] py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(16,61,46,0.07),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(178,146,103,0.09),transparent_35%)]" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl space-y-8 font-display"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#B29267]/30 bg-[#B29267]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#B29267]"
            >
              About Amolex
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-5xl font-bold leading-[1.06] tracking-tight text-gray-900 [font-family:var(--font-nexa)] sm:text-6xl lg:text-7xl"
            >
              Empowering Businesses.{" "}
              <span className="bg-gradient-to-r from-[#103D2E] to-[#B29267] bg-clip-text text-transparent">
                Transforming Ideas.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-gray-500">
              At Amolex Digital Tech, we combine creative digital marketing with cutting-edge technology to help
              businesses grow, innovate, and succeed in the modern digital world.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-8 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-[#B29267]/30"
              >
                Discover How We Can Help
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ WHO WE ARE ━━━ */}
      <FadeSection className="py-24 bg-[#f6faf8]">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Who We Are</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
              Crafting Digital Solutions That Matter
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              Amolex Digital Tech is a team of innovators, strategists, designers, and developers dedicated to
              creating meaningful digital experiences. We help businesses turn ideas into impactful solutions, whether
              that&apos;s a high-performing marketing campaign or a custom software system.
            </p>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-700">Our approach is simple yet powerful:</p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="floating-glass-card rounded-2xl p-6"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f7f4]">
                    <Icon className="h-5 w-5 text-[#103D2E]" />
                  </div>
                  <p className="font-semibold text-gray-900">{p.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{p.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ WHAT MAKES US DIFFERENT ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container space-y-14">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Our Difference</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
              Where Marketing Meets Technology
            </h2>
            <p className="text-base text-gray-500">
              What sets Amolex Digital Tech apart is our ability to merge creativity with technology.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="floating-glass-card rounded-2xl p-7 w-full max-w-sm"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#103D2E] text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="font-heading text-base font-semibold text-gray-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ━━━ MISSION & VISION ━━━ */}
      <FadeSection className="relative overflow-hidden py-24 bg-gradient-to-br from-[#f8faf9] via-[#e8f0ec] to-[#f5faf7]">
        {/* Bright Animated Background with Moving Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Moving particles of different sizes */}
          <svg className="h-full w-full">
            <defs>
              <linearGradient id="particleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B29267" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#103D2E" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* 20 moving dots of different sizes */}
            {[...Array(20)].map((_, i) => (
              <motion.circle
                key={i}
                r={i % 3 === 0 ? 5 : i % 2 === 0 ? 3 : 2}
                fill={i % 2 === 0 ? "#B29267" : "#103D2E"}
                initial={{ cx: Math.random() * 1500, cy: Math.random() * 800 }}
                animate={{ 
                  cx: [null, Math.random() * 1500, Math.random() * 1500],
                  cy: [null, Math.random() * 800 - 200, Math.random() * 800 - 400],
                  opacity: [0.2, 0.7, 0.2]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </svg>
          
          {/* Light gradient orbs */}
          <motion.div
            className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#B29267]/20 via-[#103D2E]/10 to-transparent opacity-60 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-[#103D2E]/15 via-[#B29267]/20 to-transparent opacity-50 blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          <motion.div
            className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-[#B29267]/15 to-transparent opacity-40 blur-3xl"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -30, 30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Subtle wave pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <motion.path
                d="M0 100 Q 200 50, 400 100 T 800 100 T 1200 100 T 1600 100"
                fill="none"
                stroke="#103D2E"
                strokeWidth="2"
                animate={{ d: [
                  "M0 100 Q 200 50, 400 100 T 800 100 T 1200 100 T 1600 100",
                  "M0 100 Q 200 150, 400 100 T 800 100 T 1200 100 T 1600 100",
                  "M0 100 Q 200 50, 400 100 T 800 100 T 1200 100 T 1600 100"
                ]}}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>
        
        {/* Connected Network SVG */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="h-full w-full" preserveAspectRatio="none">
            {/* Connecting lines between cards */}
            <motion.path
              d="M 50% 200 Q 50% 300, 50% 400"
              stroke="url(#particleGrad)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 8"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            
            {/* Horizontal connector */}
            <motion.path
              d="M 25% 400 Q 50% 420, 75% 400"
              stroke="url(#particleGrad)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 12"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 1 }}
            />
            
            {/* Animated dots on connection line */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`conn-${i}`}
                r="4"
                fill="#B29267"
                initial={{ cx: 50, cy: 200 + i * 100 }}
                animate={{ cy: [200 + i * 100, 350 + i * 20, 400] }}
                transition={{ 
                  duration: 3 + i * 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </svg>
        </div>
        
        <div className="container relative z-10 flex flex-col items-center gap-8">
          {/* Section Title */}
          <motion.div variants={fadeUp} className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Our Purpose</p>
            <h2 className="mt-2 font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
              Mission & Vision
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
              The driving forces behind everything we do at Amolex Digital Tech
            </p>
          </motion.div>
          
          {/* Mission Card */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.01, y: -3 }}
            className="group relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#B29267]/30 bg-[#B29267]/10 p-8 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-[#B29267]/15 hover:shadow-2xl"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#B29267]/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            {/* Icon - Centered */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#B29267] to-[#8f7352] shadow-lg mx-auto">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267] text-center">Our Mission</p>
            <p className="mt-3 text-lg font-medium leading-relaxed text-gray-900 text-center">
              To empower businesses to grow by strengthening their digital presence through effective digital marketing, strategic brand building, and innovative technology solutions such as software, website, mobile app development, and AI automation. We aim to help businesses connect with their customers, build trust, and grow sustainably in the digital world.
            </p>
            
            {/* Decorative corners */}
            <div className="absolute -right-2 -top-2 h-16 w-16 border-t-2 border-r-2 border-[#B29267]/30 rounded-tr-xl" />
            <div className="absolute -bottom-2 -left-2 h-16 w-16 border-b-2 border-l-2 border-[#B29267]/30 rounded-bl-xl" />
            
            {/* Glow accent */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#B29267]/20 to-transparent blur-2xl" />
          </motion.div>
          
          {/* Connector line */}
          <div className="h-16 w-px bg-gradient-to-b from-[#B29267]/50 to-[#B29267]/20" />
          
          {/* Vision Card */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.01, y: -3 }}
            className="group relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#B29267]/30 bg-[#B29267]/10 p-8 backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-[#B29267]/15 hover:shadow-2xl"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#B29267]/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            {/* Icon - Centered */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#B29267] to-[#8f7352] shadow-lg mx-auto">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267] text-center">Our Vision</p>
            <p className="mt-3 text-lg font-medium leading-relaxed text-gray-900 text-center">
              To become a trusted digital growth partner for businesses, helping them stand out, scale, and succeed through innovative marketing strategies and advanced technology solutions.
            </p>
            
            {/* Decorative corners */}
            <div className="absolute -left-2 -top-2 h-16 w-16 border-t-2 border-l-2 border-[#B29267]/30 rounded-tl-xl" />
            <div className="absolute -right-2 -bottom-2 h-16 w-16 border-b-2 border-r-2 border-[#B29267]/30 rounded-br-xl" />
            
            {/* Glow accent */}
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#B29267]/20 to-transparent blur-2xl" />
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ OUR SERVICES ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container space-y-16">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Our Core Values</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
              What Drives Us Forward
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Client Success", desc: "We measure our success by the growth and achievements of our clients." },
              { title: "Innovation", desc: "We constantly explore new technologies and creative solutions." },
              { title: "Integrity", desc: "We build trust through transparency, honesty, and ethical practices." },
              { title: "Quality Excellence", desc: "We deliver exceptional quality in every project we undertake." },
              { title: "Collaboration", desc: "We work closely with clients as partners to achieve shared goals." },
              { title: "Continuous Improvement", desc: "We constantly refine our processes and skills to serve better." },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="floating-glass-card rounded-2xl p-6 text-center"
              >
                <h3 className="font-heading text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ━━━ OUR TEAM - ORG CHART TREE ━━━ */}
{/* ━━━ OUR LEADERSHIP STRUCTURE ━━━ */}
<FadeSection className="py-20 overflow-hidden bg-[#f6faf8]">
  <div className="container space-y-10">

    {/* Section Header */}
    <motion.div
      variants={fadeUp}
      className="mx-auto max-w-2xl space-y-4 text-center"
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">
        Organization Chart
      </p>

      <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
        Our Leadership Structure
      </h2>
    </motion.div>

    {/* ORGANIZATION TREE */}
    <div className="relative flex flex-col items-center space-y-10">

      {/* ───── ROW 1 ───── */}
      <div className="flex flex-wrap justify-center gap-6">

        {/* CEO */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[300px] rounded-2xl p-6 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#103D2E]/10 px-3 py-1 text-xs font-semibold text-[#103D2E]">
            Executive Leadership
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            Tewodros Abrham
          </h3>

          <p className="mt-2 text-sm font-medium text-[#B29267]">
            Chief Executive Officer (CEO)
          </p>
        </motion.div>

        {/* CCO */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[300px] rounded-2xl p-6 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#103D2E]/10 px-3 py-1 text-xs font-semibold text-[#103D2E]">
            Executive Leadership
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            Natnael Kibatu
          </h3>

          <p className="mt-2 text-sm font-medium text-[#B29267]">
            Chief Creative Officer (CCO)
          </p>
        </motion.div>
      </div>

      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className="h-12 w-px bg-gradient-to-b from-[#103D2E] to-[#B29267]" />
      </div>

      {/* ───── ROW 2 ───── */}
      <div className="flex flex-wrap justify-center gap-6">

        {/* Kebron */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[260px] rounded-2xl p-5 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#B29267]/10 px-3 py-1 text-xs font-semibold text-[#B29267]">
            Strategic Division
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Kebron Belay
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Social Media Strategist
          </p>
        </motion.div>

        {/* Biniyam */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[260px] rounded-2xl p-5 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#B29267]/10 px-3 py-1 text-xs font-semibold text-[#B29267]">
            Strategic Division
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Biniyam Wondimu
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Systems & Database Development Specialist
          </p>
        </motion.div>

        {/* Selamawit */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[260px] rounded-2xl p-5 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#B29267]/10 px-3 py-1 text-xs font-semibold text-[#B29267]">
            Strategic Division
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Selamawit Mesfin
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Ad Campaign Strategist
          </p>
        </motion.div>

        {/* Samrawit */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[260px] rounded-2xl p-5 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#B29267]/10 px-3 py-1 text-xs font-semibold text-[#B29267]">
            Strategic Division
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            Samrawit Getachew
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Project Manager
          </p>
        </motion.div>
      </div>

      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className="h-12 w-px bg-gradient-to-b from-[#B29267] to-[#103D2E]" />
      </div>

      {/* ───── ROW 3 ───── */}
      <div className="flex flex-wrap justify-center gap-6">

        {/* Daniel */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[300px] rounded-2xl p-6 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#103D2E]/10 px-3 py-1 text-xs font-semibold text-[#103D2E]">
            Creative Production
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            Daniel Abebe
          </h3>

          <p className="mt-2 text-sm font-medium text-[#B29267]">
            Video Editor & Graphic Designer
          </p>
        </motion.div>

        {/* Yordanos */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          className="floating-glass-card w-[300px] rounded-2xl p-6 text-center"
        >
          <div className="mb-3 inline-flex rounded-full bg-[#103D2E]/10 px-3 py-1 text-xs font-semibold text-[#103D2E]">
            Creative Production
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            Yordanos Fasil
          </h3>

          <p className="mt-2 text-sm font-medium text-[#B29267]">
            Cinematographer & Content Creator Specialist
          </p>
        </motion.div>
      </div>

    </div>
  </div>
</FadeSection>

      {/* ━━━ WHY CHOOSE US ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Why Choose Us</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
              We Don&apos;t Just Deliver Solutions, We Deliver Growth
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              From digital marketing campaigns to custom software platforms, our solutions help businesses achieve
              real, lasting results. We measure our success by your results.
            </p>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-2 gap-5">
            {growthOutcomes.map((g) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={g.label}
                  variants={fadeUp}
                  className="floating-glass-card flex flex-col gap-3 rounded-2xl p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f7f4]">
                    <Icon className="h-5 w-5 text-[#103D2E]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{g.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ CLOSING CTA ━━━ */}
      <FadeSection className="py-24 bg-[#103D2E]">
        <div className="container space-y-8 text-center">
          <motion.div variants={fadeUp} className="space-y-5">
            <h2 className="font-heading text-4xl font-bold text-white lg:text-5xl">
              Let&apos;s Build Something Great Together
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/65">
              Partner with Amolex Digital Tech and elevate your digital presence.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-8 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
            >
              Get a Free Consultation
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              See Our Services
            </Link>
          </motion.div>
        </div>
      </FadeSection>
    </>
  );
}
