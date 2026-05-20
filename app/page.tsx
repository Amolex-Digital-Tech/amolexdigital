"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  AnimatePresence,
  motion,
  type Variants,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
import {
  Megaphone,
  Smartphone,
  Code2,
  ShoppingCart,
  BrainCircuit,
  Lightbulb,
  Settings2,
  BarChart3,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ChevronsDown,
  MousePointer2,
  Sparkles
} from "lucide-react";

import { LOGO_ASSET_PATH } from "@/lib/site";
import { MagneticSurface } from "@/components/ui/magnetic-surface";

const INTRO_DURATION_MS = 3400;

// ─── Animation helpers ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// ─── Data ────────────────────────────────────────────────────────────────────

const coreServices = [
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Data-driven marketing strategies that increase brand visibility, customer engagement, and business growth."
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Custom Android and iOS applications designed to deliver seamless user experiences and scalable performance."
  },
  {
    icon: Code2,
    title: "Software & System Development",
    description:
      "Custom-built software solutions that automate operations, streamline workflows, and support business growth."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description:
      "Modern and secure online store platforms designed to deliver smooth shopping experiences and scalable business operations."
  },
  {
    icon: BrainCircuit,
    title: "AI Automation",
    description:
      "Intelligent automation systems that help businesses optimize processes, improve efficiency, and make smarter decisions."
  }
];

const whyChooseUs = [
  {
    icon: Lightbulb,
    title: "Innovation-Driven Solutions",
    description: "We use modern technologies to create forward-thinking digital solutions."
  },
  {
    icon: Settings2,
    title: "Customized Technology",
    description: "Every project is tailored to the unique goals and needs of our clients."
  },
  {
    icon: BarChart3,
    title: "Data-Driven Strategy",
    description: "Our solutions are guided by analytics, insights, and measurable results."
  },
  {
    icon: TrendingUp,
    title: "Scalable Systems",
    description: "We build platforms that grow alongside your business."
  }
];

const featuredProjects = [
  {
    tag: "AI & Analytics",
    title: "AI Analytics Platform",
    description:
      "A smart analytics system that helps businesses transform complex data into valuable insights for better decision-making."
  },
  {
    tag: "E-commerce",
    title: "E-commerce Platform",
    description:
      "A scalable online store solution with secure payment integration, product management, and optimized customer experience."
  },
  {
    tag: "Mobile",
    title: "Mobile Business App",
    description:
      "A custom mobile application that enables businesses to manage operations and connect with customers more efficiently."
  }
];

const logoSketchPaths = [
  {
    d: "M28 222 C112 150, 210 108, 306 156",
    width: 34,
    delay: 0.08,
    duration: 0.9
  },
  {
    d: "M284 348 C252 232, 240 112, 284 18",
    width: 26,
    delay: 0.24,
    duration: 1.02
  },
  {
    d: "M316 238 C426 274, 544 286, 670 246",
    width: 54,
    delay: 0.52,
    duration: 0.94
  },
  {
    d: "M520 124 C618 94, 720 90, 812 148",
    width: 40,
    delay: 0.74,
    duration: 0.88
  },
  {
    d: "M780 98 C894 78, 982 140, 988 246",
    width: 34,
    delay: 0.96,
    duration: 0.98
  },
  {
    d: "M846 322 C930 294, 1022 248, 1090 170",
    width: 30,
    delay: 1.12,
    duration: 0.92
  },
  {
    d: "M144 368 C336 348, 576 362, 1092 366",
    width: 36,
    delay: 1.28,
    duration: 1.08
  }
];

const logoRevealDots = [
  { cx: 80, cy: 204, r: 16, delay: 0 },
  { cx: 222, cy: 142, r: 14, delay: 0.14 },
  { cx: 332, cy: 230, r: 18, delay: 0.36 },
  { cx: 486, cy: 214, r: 22, delay: 0.56 },
  { cx: 624, cy: 150, r: 18, delay: 0.78 },
  { cx: 770, cy: 170, r: 16, delay: 0.9 },
  { cx: 924, cy: 224, r: 18, delay: 1.08 },
  { cx: 1040, cy: 208, r: 14, delay: 1.24 },
  { cx: 232, cy: 358, r: 14, delay: 1.32 },
  { cx: 586, cy: 362, r: 16, delay: 1.44 },
  { cx: 932, cy: 364, r: 14, delay: 1.56 }
];

// ─── Viewport-triggered section wrapper ──────────────────────────────────────

function FadeSection({
  children,
  className = "",
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function MorphingLogoReveal({ showTagline = true }: { showTagline?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const maskId = `${uid}-logo-mask`;
  const strokeId = `${uid}-logo-stroke`;

  if (shouldReduceMotion) {
    return (
      <motion.div variants={fadeUp} className="flex w-full flex-col items-center">
        <div className="relative w-full max-w-[72rem]">
          <div className="absolute inset-x-[12%] top-1/2 h-24 -translate-y-1/2 rounded-full bg-[#B29267]/18 blur-3xl" />
          <svg viewBox="0 0 1100 420" className="relative z-10 w-full h-auto" aria-hidden="true">
            <image href={LOGO_ASSET_PATH} width="1100" height="420" preserveAspectRatio="xMidYMid meet" />
          </svg>
        </div>
        {showTagline ? (
          <p className="mt-4 max-w-3xl px-4 text-center text-xl font-semibold text-[#103D2E] sm:text-2xl">
            Creative marketing. Intelligent systems. Scalable growth.
          </p>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="flex w-full flex-col items-center">
      <motion.div
        className="relative w-full max-w-[72rem]"
        animate={{ y: [0, -6, 0], scale: [1, 1.01, 1] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      >
        <div className="pointer-events-none absolute inset-x-[10%] top-1/2 h-24 -translate-y-1/2 rounded-full bg-[#B29267]/16 blur-3xl" />

        <svg viewBox="0 0 1100 420" className="relative z-10 w-full h-auto" aria-hidden="true">
          <defs>
            <linearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#103D2E" />
              <stop offset="50%" stopColor="#B29267" />
              <stop offset="100%" stopColor="#103D2E" />
            </linearGradient>
            <mask id={maskId}>
              <rect width="1100" height="420" fill="black" />
              {logoSketchPaths.map((path) => (
                <motion.path
                  key={`${maskId}-${path.d}`}
                  d={path.d}
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={path.width}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 1] }}
                  transition={{ duration: path.duration, delay: path.delay, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              {logoRevealDots.map((dot) => (
                <motion.circle
                  key={`${maskId}-${dot.cx}-${dot.cy}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  fill="white"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: dot.r, opacity: [0, 1, 1] }}
                  transition={{ duration: 0.45, delay: dot.delay, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              <motion.rect
                x={0}
                y={0}
                height={420}
                fill="white"
                initial={{ x: 548, width: 0, opacity: 0.85 }}
                animate={{ x: -30, width: 1160, opacity: 1 }}
                transition={{ duration: 1.1, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </mask>
          </defs>

          <motion.image
            href={LOGO_ASSET_PATH}
            width="1100"
            height="420"
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0.06 }}
            animate={{ opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
          />
          <motion.image
            href={LOGO_ASSET_PATH}
            width="1100"
            height="420"
            preserveAspectRatio="xMidYMid meet"
            mask={`url(#${maskId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          />

          {logoSketchPaths.map((path) => (
            <motion.path
              key={`${strokeId}-${path.d}`}
              d={path.d}
              fill="none"
              stroke={`url(#${strokeId})`}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={Math.max(8, path.width * 0.32)}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.95, 0.18, 0] }}
              transition={{ duration: path.duration, delay: path.delay, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          {logoRevealDots.map((dot) => (
            <motion.circle
              key={`${strokeId}-${dot.cx}-${dot.cy}`}
              cx={dot.cx}
              cy={dot.cy}
              fill="#B29267"
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: dot.r * 0.38, opacity: [0, 0.9, 0.15, 0] }}
              transition={{ duration: 0.5, delay: dot.delay, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
      </motion.div>

      {showTagline ? (
        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl px-4 text-center text-xl font-semibold text-[#103D2E] sm:text-2xl"
        >
          Creative marketing. Intelligent systems. Scalable growth.
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function HomeIntroOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="home-intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,61,46,0.09),transparent_55%),radial-gradient(ellipse_at_center,rgba(178,146,103,0.1),transparent_38%)]" />
          <div className="pointer-events-none absolute inset-x-[8%] top-1/2 h-32 -translate-y-1/2 rounded-full bg-[#103D2E]/8 blur-3xl" />
          
          {/* Logo with smooth pop-in animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative z-10 w-full max-w-[500px] px-6"
          >
            <MorphingLogoReveal showTagline={false} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function HeroInteractiveLogo() {
  const shouldReduceMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(true);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const driftX = useSpring(useTransform(pointerX, [-1, 1], [-14, 14]), {
    stiffness: 120,
    damping: 16,
    mass: 0.85
  });
  const driftY = useSpring(useTransform(pointerY, [-1, 1], [8, -10]), {
    stiffness: 120,
    damping: 18,
    mass: 0.9
  });
  const swing = useSpring(useTransform(pointerX, [-1, 1], [-5, 5]), {
    stiffness: 100,
    damping: 14,
    mass: 0.78
  });
  const logoScale = useSpring(useTransform(pointerY, [-1, 1], [0.995, 1.02]), {
    stiffness: 100,
    damping: 16,
    mass: 0.8
  });
  const shadowX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), {
    stiffness: 90,
    damping: 18,
    mass: 1
  });
  const shadowScaleX = useSpring(useTransform(pointerY, [-1, 1], [1.04, 0.88]), {
    stiffness: 90,
    damping: 18,
    mass: 1
  });
  const shadowScaleY = useSpring(useTransform(pointerY, [-1, 1], [1, 0.74]), {
    stiffness: 90,
    damping: 18,
    mass: 1
  });
  const shadowOpacity = useSpring(useTransform(pointerY, [-1, 1], [0.16, 0.28]), {
    stiffness: 100,
    damping: 20,
    mass: 1
  });
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) {
      return;
    }

    if (showHint) {
      setShowHint(false);
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;

    pointerX.set(relativeX * 2 - 1);
    pointerY.set(relativeY * 2 - 1);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      variants={fadeUp}
      className="relative mx-auto w-full max-w-[34rem] sm:pb-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointer}
    >
      <AnimatePresence>
        {showHint && !shouldReduceMotion ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -right-1 top-8 z-20 hidden sm:block"
          >
            <motion.div
              animate={{ x: [0, 16, 8, 0], y: [0, -14, -6, 0], rotate: [-10, 6, -4, -10] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-full border border-dashed border-[#B29267]/20" />
              <MousePointer2 className="h-5 w-5 text-[#103D2E]" />
              <motion.div
                animate={{ scale: [0.9, 1.22, 0.9], opacity: [0.45, 1, 0.45], rotate: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-3 -top-3 text-[#B29267]"
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              <motion.span
                animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.25, 0.75, 0.25] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.18 }}
                className="absolute -left-2 top-5 h-2 w-2 rounded-full bg-[#103D2E]/28"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -10, 0, 4, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { x: shadowX, scaleX: shadowScaleX, scaleY: shadowScaleY, opacity: shadowOpacity }
          }
          className="pointer-events-none absolute inset-x-[18%] bottom-[-6%] h-8 rounded-full bg-[radial-gradient(circle,rgba(16,61,46,0.26)_0%,rgba(16,61,46,0.08)_42%,transparent_72%)] blur-xl"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { x: driftX, y: driftY, rotate: swing, scale: logoScale }}
          className="relative z-10"
        >
          <Image
            src={LOGO_ASSET_PATH}
            alt="Amolex Digital Tech logo"
            width={1400}
            height={535}
            priority
            className="h-auto w-full object-contain [filter:drop-shadow(0_18px_20px_rgba(255,255,255,0.36))_drop-shadow(0_22px_30px_rgba(16,61,46,0.14))_drop-shadow(0_42px_32px_rgba(16,61,46,0.16))]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12"
    >
      <Link
        href="#who-we-are"
        data-cursor="scroll"
        data-cursor-label="Scroll"
        aria-label="Scroll to the content"
        className="flex flex-col items-center gap-2 text-[#103D2E] transition-opacity hover:opacity-80"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B29267]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 10, 0], scale: [1, 1.08, 1], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#103D2E]/15 bg-white/90 shadow-[0_18px_36px_rgba(16,61,46,0.08)]"
        >
          <ChevronsDown className="h-5 w-5" />
        </motion.span>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowIntro(false);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", showIntro);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showIntro]);

  return (
    <>
      <HomeIntroOverlay visible={showIntro} />

      {/* ━━━ 1. HERO ━━━ */}
      <section className="relative overflow-hidden bg-white py-28 font-display sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(16,61,46,0.07),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(178,146,103,0.09),transparent_35%)]" />

        <div
          aria-hidden={showIntro}
          className={`container relative z-10 flex flex-col items-center text-center transition-opacity duration-700 ${
            showIntro ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <motion.div
            initial="hidden"
            animate={showIntro ? "hidden" : "visible"}
            variants={stagger}
            className="max-w-5xl space-y-8"
          >
            <HeroInteractiveLogo />

            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#B29267]/30 bg-[#B29267]/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#B29267]"
            >
              Amolex Digital Tech
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-5xl font-bold leading-[1.01] tracking-tight text-[#103D2E] text-balance [font-family:var(--font-nexa)] sm:text-6xl lg:text-[5rem]"
            >
              Designing the future of
              <span className="mt-3 block bg-gradient-to-r from-[#103D2E] via-[#1C5A44] to-[#B29267] bg-clip-text text-transparent">
                modern brands
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-gray-500">
              Amolex Digital Tech delivers powerful digital marketing strategies and advanced technology solutions that
              help businesses grow, innovate, and succeed in the modern digital economy.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="Start">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-8 text-base font-semibold text-white shadow-[0_18px_36px_rgba(178,146,103,0.28),0_10px_20px_rgba(16,61,46,0.12)] transition-all hover:brightness-110 hover:shadow-[0_24px_50px_rgba(178,146,103,0.34),0_14px_28px_rgba(16,61,46,0.14)]"
                >
                  Start Your Project
                </Link>
              </MagneticSurface>
              <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="Services">
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#103D2E]/18 bg-white/88 px-8 text-base font-semibold text-[#103D2E] shadow-[0_14px_28px_rgba(16,61,46,0.08)] transition-all hover:bg-[#103D2E]/5 hover:shadow-[0_20px_42px_rgba(16,61,46,0.12)]"
                >
                  Explore Our Services
                </Link>
              </MagneticSurface>
            </motion.div>

            <motion.p variants={fadeUp} className="flex items-center justify-center gap-2 font-sans text-sm text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-[#103D2E]" />
              Delivering innovative digital solutions designed to help businesses scale and succeed.
            </motion.p>
            <ScrollCue />
          </motion.div>
        </div>
      </section>

      {/* ━━━ 2. WHO WE ARE ━━━ */}
      <FadeSection id="who-we-are" className="py-24 bg-[#f6faf8]">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Who We Are</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
              A Technology Partner Built for Growth
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              Amolex Digital Tech is a digital marketing and technology solutions company dedicated to helping
              businesses grow through innovative technology and strategic digital marketing. We specialize in building
              scalable software systems, modern mobile applications, and high-performance digital platforms.
            </p>
            <p className="text-base leading-relaxed text-gray-500">
              By combining technical expertise with data-driven marketing strategies, we help organizations strengthen
              their digital presence, improve operational efficiency, and unlock new opportunities for growth.
            </p>
            <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="About">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[#103D2E] px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(16,61,46,0.18)] transition-all hover:bg-[#103D2E]/90 hover:shadow-[0_24px_48px_rgba(16,61,46,0.22)]"
              >
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticSurface>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            {[
              { value: "5+", label: "Core Services" },
              { value: "4 wks", label: "Avg. Launch Time" },
              { value: "100%", label: "Custom-Built" },
              { value: "24 / 7", label: "Support" }
            ].map((item) => (
              <MagneticSurface
                key={item.label}
                strength={10}
                rotateStrength={5}
                cursorLabel="Inspect"
                className="floating-glass-card h-full rounded-2xl p-6 transition-[box-shadow,border-color] duration-300 hover:border-[#B29267]/24 hover:shadow-[0_28px_56px_rgba(16,61,46,0.12),inset_0_1px_0_rgba(255,255,255,0.82)]"
              >
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#B29267]/50 to-transparent" />
                <p className="text-3xl font-bold text-[#103D2E]">{item.value}</p>
                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </MagneticSurface>
            ))}
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ 3. CORE SERVICES ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container space-y-14">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">What We Do</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">Our Core Solutions</h2>
            <p className="text-base text-gray-500">
              End-to-end digital services built to help your business thrive in the modern economy.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreServices.map((service) => {
              const Icon = service.icon;
              return (
                <MagneticSurface
                  key={service.title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  strength={12}
                  rotateStrength={6}
                  cursorLabel="Inspect"
                  className="floating-glass-card group h-full rounded-2xl p-7 transition-[box-shadow,border-color] duration-300 hover:border-[#B29267]/24 hover:shadow-[0_30px_60px_rgba(16,61,46,0.13),inset_0_1px_0_rgba(255,255,255,0.82)]"
                >
                  <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#B29267]/55 to-transparent" />
                  <div className="pointer-events-none absolute -right-8 top-12 h-24 w-24 rounded-full bg-[#103D2E]/5 blur-2xl transition-transform duration-300 group-hover:scale-125" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f7f4] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Icon className="h-6 w-6 text-[#103D2E]" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{service.description}</p>
                </MagneticSurface>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="flex justify-center pt-2">
            <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="Services">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-[#103D2E]/18 bg-white px-8 py-3 text-sm font-semibold text-[#103D2E] shadow-[0_14px_30px_rgba(16,61,46,0.08)] transition-all hover:bg-[#103D2E]/5 hover:shadow-[0_22px_44px_rgba(16,61,46,0.12)]"
              >
                View All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticSurface>
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ 4. WHY CHOOSE US ━━━ */}
      <FadeSection className="py-24 bg-[#f6faf8]">
        <div className="container space-y-14">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Our Advantage</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
              Why Businesses Work With Us
            </h2>
            <p className="text-base text-gray-500">
              We combine strategy, technology, and execution to deliver measurable results.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <MagneticSurface
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  strength={12}
                  rotateStrength={6}
                  cursorLabel="Inspect"
                  className="floating-glass-card group flex h-full gap-5 rounded-2xl p-7 transition-[box-shadow,border-color] duration-300 hover:border-[#B29267]/24 hover:shadow-[0_30px_58px_rgba(16,61,46,0.13),inset_0_1px_0_rgba(255,255,255,0.82)]"
                >
                  <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#B29267]/50 to-transparent" />
                  <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f4] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Icon className="h-5 w-5 text-[#103D2E]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
                  </div>
                </MagneticSurface>
              );
            })}
          </div>
        </div>
      </FadeSection>

      {/* ━━━ 5. FEATURED PROJECTS ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container space-y-14">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Our Portfolio</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">Some of Our Work</h2>
            <p className="text-base text-gray-500">A glimpse into the solutions we&apos;ve built for our clients.</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <MagneticSurface
                key={project.title}
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                strength={12}
                rotateStrength={6}
                cursorLabel="Portfolio"
                className="floating-glass-card group rounded-2xl transition-[box-shadow,border-color] duration-300 hover:border-[#B29267]/24 hover:shadow-[0_32px_62px_rgba(16,61,46,0.14),inset_0_1px_0_rgba(255,255,255,0.82)]"
              >
                <div className="relative h-44 bg-gradient-to-br from-[#103D2E] to-[#1a5c44]">
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="space-y-3 p-6">
                  <span className="inline-block rounded-full bg-[#B29267]/15 px-3 py-0.5 text-xs font-semibold text-[#8f7352]">
                    {project.tag}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{project.description}</p>
                </div>
              </MagneticSurface>
            ))}
          </div>

          <motion.div variants={fadeUp} className="flex justify-center pt-2">
            <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="Portfolio">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-[#103D2E]/18 bg-white px-8 py-3 text-sm font-semibold text-[#103D2E] shadow-[0_14px_30px_rgba(16,61,46,0.08)] transition-all hover:bg-[#103D2E]/5 hover:shadow-[0_22px_44px_rgba(16,61,46,0.12)]"
              >
                View Full Portfolio <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticSurface>
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ 6. CTA ━━━ */}
      <FadeSection className="py-24 bg-[#103D2E]">
        <div className="container space-y-8 text-center">
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="font-heading text-4xl font-bold text-white lg:text-5xl">
              Ready to Build Your Next Digital Solution?
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70">
              Partner with Amolex Digital Tech to create innovative digital platforms, intelligent systems, and powerful
              marketing strategies that drive real business growth.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <MagneticSurface inline strength={8} rotateStrength={4} cursorLabel="Start">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-10 text-base font-semibold text-white shadow-[0_20px_40px_rgba(178,146,103,0.32),0_10px_22px_rgba(0,0,0,0.12)] transition-all hover:brightness-110 hover:shadow-[0_28px_56px_rgba(178,146,103,0.4),0_14px_28px_rgba(0,0,0,0.14)]"
              >
                Start Your Project
              </Link>
            </MagneticSurface>
          </motion.div>
        </div>
      </FadeSection>
    </>
  );
}
