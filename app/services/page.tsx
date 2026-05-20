"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, type Variants, useInView } from "framer-motion";
import { teamMembers } from "@/lib/data";
import {
  Megaphone,
  PenTool,
  MousePointerClick,
  Search,
  Award,
  BarChart3,
  Smartphone,
  Code2,
  ShoppingCart,
  Settings,
  Database,
  Layers,
  Palette,
  LineChart,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";

// ─── Variants ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
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

// ─── Matrix Rain Effect ─────────────────────────────────────────────────────────────

function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix rain config
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "01";

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 33);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${active ? "opacity-30" : "opacity-0"}`}
    />
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const marketingServices = [
  { 
    icon: Megaphone, 
    label: "Social Media Management", 
    desc: "We manage your social media presence across platforms like Facebook, Instagram, LinkedIn, and TikTok. This includes creating a posting schedule, developing engaging content, responding to followers, and monitoring performance. The goal is to build an active, loyal community that strengthens your brand and drives consistent engagement.",
    learnMore: "/services?service=social-media"
  },
  { 
    icon: PenTool, 
    label: "Content Creation", 
    desc: "Our team produces high‑quality content tailored to your brand voice — from blog articles and case studies to videos, graphics, and infographics. Compelling content not only attracts attention but also educates, entertains, and inspires your audience, helping you stand out in a crowded digital space.",
    learnMore: "/services?service=content-creation"
  },
  { 
    icon: MousePointerClick, 
    label: "Digital Advertising", 
    desc: "We design and run paid campaigns on platforms like Google Ads, Facebook Ads, and LinkedIn Ads. These campaigns are highly targeted, ensuring your message reaches the right audience at the right time. With data‑driven optimization, we maximize leads, conversions, and sales while keeping costs efficient.",
    learnMore: "/services?service=digital-advertising"
  },
  { 
    icon: Search, 
    label: "Search Engine Optimization (SEO)", 
    desc: "SEO ensures your website ranks higher in search results, making it easier for potential customers to find you. We optimize your site structure, content, and keywords, while also improving speed, mobile responsiveness, and backlinks. The result: increased organic traffic and long‑term visibility.",
    learnMore: "/services?service=seo"
  },
  { 
    icon: Award, 
    label: "Brand Strategy & Positioning", 
    desc: "We help define your brand's identity, values, and market positioning. This includes developing a clear brand voice, visual identity, and messaging framework. A strong strategy ensures your business is recognized, trusted, and differentiated from competitors, creating lasting impact in your industry.",
    learnMore: "/services?service=brand-strategy"
  },
  { 
    icon: BarChart3, 
    label: "Online Campaign Management", 
    desc: "We plan, execute, and monitor multi‑channel campaigns that integrate social media, email marketing, advertising, and SEO. Using analytics and performance tracking, we continuously refine campaigns to deliver measurable results. This ensures your marketing efforts are cohesive, efficient, and aligned with business goals.",
    learnMore: "/services?service=campaign-management"
  },
];

const techServices = [
  { 
    icon: Smartphone, 
    label: "Mobile App Development", 
    desc: "We design and develop intuitive mobile applications for both iOS and Android platforms. Our apps are built with user‑friendly interfaces, secure coding practices, and seamless integration with your existing systems. Whether it's customer engagement, internal operations, or e‑commerce, our mobile solutions are tailored to deliver performance, scalability, and long‑term value."
  },
  { 
    icon: Code2, 
    label: "Custom Software & Systems", 
    desc: "Every business has unique needs, and off‑the‑shelf software often falls short. We build custom solutions that automate workflows, reduce manual errors, and improve efficiency. From enterprise resource tools to specialized industry applications, our systems are designed to adapt to your processes and grow with your organization."
  },
  { 
    icon: ShoppingCart, 
    label: "E‑Commerce Platforms", 
    desc: "We create scalable online stores and marketplaces that enhance customer experience and drive sales. Our solutions include secure payment gateways, inventory management, product catalogs, and responsive design for mobile and desktop. With integrated analytics, you can track performance and continuously optimize your online business."
  },
  { 
    icon: Settings, 
    label: "ERP / ARP Systems", 
    desc: "Our ERP/ARP solutions integrate finance, HR, supply chain, and operations into one centralized system. This improves visibility, streamlines processes, and supports smarter decision‑making. With customizable modules, businesses can manage resources more effectively and respond quickly to market changes."
  },
  { 
    icon: Database, 
    label: "Database Architecture", 
    desc: "Data is the backbone of modern business. We design secure, scalable, and intelligent database systems that handle complex information efficiently. Our solutions ensure reliability, accessibility, and protection against risks, enabling businesses to store, manage, and analyze data with confidence."
  },
  { 
    icon: Layers, 
    label: "System Integration", 
    desc: "Disconnected systems slow down operations and create inefficiencies. We specialize in integrating multiple platforms — from CRM and ERP to third‑party applications — into one seamless workflow. This reduces duplication, improves data flow, and ensures your business systems work together smoothly."
  },
  { 
    icon: Palette, 
    label: "UI/UX Design", 
    desc: "User experience is critical to digital success. We design websites, apps, and software platforms with intuitive navigation, attractive visuals, and responsive layouts. Our approach ensures that users not only enjoy interacting with your digital products but also achieve their goals quickly and easily."
  },
  { 
    icon: LineChart, 
    label: "Digital Strategy & Consulting", 
    desc: "Technology alone isn't enough — you need a clear roadmap. We provide expert guidance for planning and executing digital transformation. From identifying opportunities to selecting the right tools, we help businesses adopt technologies that deliver measurable impact and sustainable growth."
  },
  { 
    icon: BrainCircuit, 
    label: "AI Automation", 
    desc: "Artificial Intelligence can transform how businesses operate. We implement intelligent automation solutions that reduce manual work, streamline repetitive tasks, and provide data‑driven insights. AI enhances efficiency, accuracy, and decision‑making, freeing your team to focus on innovation and growth."
  },
];

const whyUs = [
  { icon: Zap, label: "Solutions tailored to your business goals" },
  { icon: Layers, label: "Integrated marketing & technology approach" },
  { icon: TrendingUp, label: "Measurable performance and analytics" },
  { icon: HeartHandshake, label: "Long-term partnership and support" },
];

const processSteps = [
  { n: "01", title: "Discovery & Analysis", desc: "Understanding your business & goals" },
  { n: "02", title: "Strategy Development", desc: "Tailored plans for marketing & IT solutions" },
  { n: "03", title: "Design & Development", desc: "Creating systems, platforms, and campaigns" },
  { n: "04", title: "Implementation", desc: "Launching solutions for immediate impact" },
  { n: "05", title: "Monitoring & Optimization", desc: "Continuous improvement & support" },
];

const allServices = [
  {
    name: "Mobile App Development",
    tagline: "We build high-performance mobile applications for iOS and Android that engage users and drive business growth.",
    highlight: false,
    features: [],
    link: "/contact?service=mobile-app-development",
    cta: "Get a Quote"
  },
  {
    name: "Digital Marketing",
    tagline: "Grow your online presence with strategic social media, SEO, and paid advertising campaigns.",
    highlight: true,
    features: [],
    link: "/contact?service=social-media",
    cta: "Grow Faster"
  },
  {
    name: "Website Development",
    tagline: "We build modern, responsive websites tailored to your business needs and brand.",
    highlight: false,
    features: [],
    link: "/contact?service=website-development",
    cta: "Discuss Your Needs"
  },
  {
    name: "E-Commerce",
    tagline: "Launch powerful online stores with seamless checkout and inventory management.",
    highlight: false,
    features: [],
    link: "/contact?service=ecommerce-platforms",
    cta: "Start Selling"
  },
  {
    name: "Branding",
    tagline: "Build a memorable brand identity that resonates with your target audience.",
    highlight: false,
    features: [],
    link: "/contact?service=branding",
    cta: "Build Your Brand"
  },
  {
    name: "Mechanical Design",
    tagline: "Professional CAD designs and engineering solutions for mechanical products.",
    highlight: false,
    features: [],
    link: "/contact?service=mechanical-design",
    cta: "Get Started"
  },
];

// ─── Tech Section with Matrix Effect ────────────────────────────────────────────

function TechSection({ 
  expandedService, 
  onToggle 
}: { 
  expandedService: string | null; 
  onToggle: (slug: string) => void; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showMatrix, setShowMatrix] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [textPhase, setTextPhase] = useState<"hidden" | "matrix" | "normal">("normal");

  useEffect(() => {
    if (isInView) {
      // Phase 1: Hide everything, start matrix
      setTextPhase("hidden");
      setShowCards(false);
      
      // Phase 2: Start matrix, reveal text gradually (like coming from matrix)
      const matrixStartTimer = setTimeout(() => {
        setShowMatrix(true);
        setTextPhase("matrix");
      }, 200);

      // Phase 3: Matrix stops (after 3 seconds), normal text display
      const matrixStopTimer = setTimeout(() => {
        setShowMatrix(false);
        setTextPhase("normal");
        setShowCards(true);
      }, 1200);

      return () => {
        clearTimeout(matrixStartTimer);
        clearTimeout(matrixStopTimer);
      };
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-20 bg-[#f6faf8] relative overflow-hidden">
      <MatrixRain active={showMatrix} />
      <div className="container space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          variants={fadeUp} 
          className="max-w-2xl space-y-3"
          initial={{ opacity: textPhase === "hidden" ? 0 : 1 }}
          animate={{ opacity: textPhase === "hidden" ? 0 : 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#103D2E] text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">Technology & IT Solutions</h2>
              <p className="text-sm text-gray-500">Scalable technical systems that simplify operations and delivery.</p>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {techServices.map((s, index) => {
            const Icon = s.icon;
            // Create slug from label
            const slug = s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const isExpanded = expandedService === slug;
            return (
              <motion.div
                key={s.label}
                id={`service-${slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: isExpanded ? 0 : -4 }}
                className={`group relative overflow-hidden rounded-2xl droplet-card ${isExpanded ? 'p-5' : 'p-4'} transition-all duration-300 ${isExpanded ? 'ring-2 ring-white/30' : ''}`}
              >
                {/* Glowing Icon */}
                <div className={`relative ${isExpanded ? 'mb-4' : 'mb-3'}`}>
                  <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className={`relative mx-auto flex items-center justify-center rounded-2xl bg-transparent border border-white/20 shadow-lg backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${isExpanded ? 'w-16 h-16' : 'w-12 h-12'}`}>
                    <Icon className={`${isExpanded ? 'w-8 h-8' : 'w-6 h-6'} text-amber-400`} />
                  </div>
                  {/* Number Badge */}
                  <div className={`absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-[#B29267] text-white shadow-lg ${isExpanded ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'}`}>
                    {index + 1}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className={`font-heading font-bold text-center mb-1 group-hover:text-[#103D2E] transition-colors ${isExpanded ? 'text-base' : 'text-sm'}`}>
                  {s.label}
                </h3>
                
                {/* Short Description */}
                <p className={`text-gray-500 text-center line-clamp-2 ${isExpanded ? 'text-sm mb-3' : 'text-xs mb-3'}`}>
                  {isExpanded ? s.desc : s.desc.substring(0, 50) + '...'}
                </p>
                
                {/* Expanded Full Description */}
                <motion.div
                  initial={false}
                  animate={{ 
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 text-center pb-3 border-t border-[#103D2E]/10 pt-3 mt-3">
                    {s.desc}
                  </p>
                </motion.div>
                
                {/* Action Button */}
                <div className={`flex justify-center ${isExpanded ? 'mt-4' : 'mt-3'}`}>
                  <button
                    onClick={() => onToggle(slug)}
                    className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                      isExpanded 
                        ? 'px-6 py-2.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'px-4 py-2 text-xs bg-[#103D2E] text-white shadow-md hover:shadow-lg hover:bg-[#0a2a1f]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isExpanded ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Show Less
                        </>
                      ) : (
                        <>
                          Learn More
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const hasScrolled = useRef(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedTechService, setExpandedTechService] = useState<string | null>(null);

  // Handle scroll to service section when page loads with ?service= query param
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    if (serviceSlug) {
      // Check if it's a marketing service or tech service
      const marketingSlugs = ["social-media", "content-creation", "digital-advertising", "seo", "brand-strategy", "campaign-management"];
      
      if (marketingSlugs.includes(serviceSlug)) {
        setExpandedService(serviceSlug);
      } else {
        setExpandedTechService(serviceSlug);
      }
      
      // Scroll to the element after state update
      const element = document.getElementById(`service-${serviceSlug}`);
      if (element && !hasScrolled.current) {
        hasScrolled.current = true;
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [searchParams]);

  const handleLearnMore = (slug: string) => {
    setExpandedService(expandedService === slug ? null : slug);
  };

  const handleTechLearnMore = (slug: string) => {
    setExpandedTechService(expandedTechService === slug ? null : slug);
  };

  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <section className="relative overflow-hidden bg-[#f6faf8] py-28 sm:py-36">
        {/* Animated Particles Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="h-full w-full">
            <defs>
              <linearGradient id="serviceParticleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B29267" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#103D2E" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* 25 floating particles of different sizes */}
            {[...Array(25)].map((_, i) => (
              <motion.circle
                key={i}
                r={i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5}
                fill={i % 2 === 0 ? "#B29267" : "#103D2E"}
                initial={{ cx: Math.random() * 1500, cy: Math.random() * 800 }}
                animate={{ 
                  cx: [null, Math.random() * 1500 + 100, Math.random() * 1500 - 100],
                  cy: [null, Math.random() * 800 - 300, Math.random() * 800 - 500],
                  opacity: [0.1, 0.6, 0.1]
                }}
                transition={{ 
                  duration: 6 + Math.random() * 6, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 3
                }}
              />
            ))}
          </svg>
        </div>
        
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(16,61,46,0.07),transparent_55%),radial-gradient(ellipse_at_80%_10%,rgba(178,146,103,0.09),transparent_35%)]" />
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl space-y-8 font-display">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#B29267]/30 bg-[#B29267]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#B29267]"
            >
              Our Services
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-5xl font-bold leading-[1.06] tracking-tight text-gray-900 [font-family:var(--font-nexa)] sm:text-6xl lg:text-7xl"
            >
              Transform Your Business with{" "}
              <span className="bg-gradient-to-r from-[#103D2E] to-[#B29267] bg-clip-text text-transparent">
                Smart Digital Solutions
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-gray-500">
              At Amolex Digital Tech, we provide end-to-end digital marketing and IT solutions that help your business
              grow, automate, and succeed in a competitive digital world.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-8 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110"
              >
                Explore Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#103D2E]/30 px-8 text-base font-semibold text-[#103D2E] transition-all hover:bg-[#103D2E]/5"
              >
                Get a Free Consultation
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ WHAT WE OFFER INTRO ━━━ */}
      <FadeSection id="services" className="py-20 bg-[#f6faf8]">
        <div className="container space-y-4 text-center max-w-3xl mx-auto">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">
            What We Offer
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
            Our Core Services
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-gray-500 leading-relaxed">
            Our services are designed to meet modern business needs, combining creativity, technology, and strategy. We
            focus on delivering results-driven solutions tailored to each client.
          </motion.p>
        </div>
      </FadeSection>

      {/* ━━━ DIGITAL MARKETING ━━━ */}
      <FadeSection className="py-20 bg-white">
        <div className="container space-y-8">
          <motion.div variants={fadeUp} className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#103D2E] text-white">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900">Digital Marketing Services</h2>
                <p className="text-sm text-gray-500">Grow your brand with focused, measurable campaigns.</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={stagger} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {marketingServices.map((s, index) => {
              const Icon = s.icon;
              // Extract service slug from learnMore URL (e.g., "social-media" from "/services?service=social-media")
              const serviceSlug = s.learnMore?.split("service=")[1] || "";
              const isExpanded = expandedService === serviceSlug;
              return (
                <motion.div
                  id={`service-${serviceSlug}`}
                  key={s.label}
                  variants={fadeUp}
                  whileHover={{ y: isExpanded ? 0 : -4 }}
                  className={`group relative overflow-hidden rounded-2xl droplet-card ${isExpanded ? 'p-5' : 'p-4'} transition-all duration-300 ${isExpanded ? 'ring-2 ring-white/30' : ''}`}
                >
                  {/* Floating Glowing Icon */}
                  <div className={`relative ${isExpanded ? 'mb-4' : 'mb-3'}`}>
                    <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`relative mx-auto flex items-center justify-center rounded-2xl bg-transparent border border-white/20 shadow-lg backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${isExpanded ? 'w-16 h-16' : 'w-12 h-12'}`}>
                      <Icon className={`${isExpanded ? 'w-8 h-8' : 'w-6 h-6'} text-amber-400`} />
                    </div>
                    {/* Number Badge */}
                    <div className={`absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-[#B29267] text-white shadow-lg ${isExpanded ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'}`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`font-heading font-bold text-center mb-1 group-hover:text-[#103D2E] transition-colors ${isExpanded ? 'text-base' : 'text-sm'}`}>
                    {s.label}
                  </h3>
                  
                  {/* Short Description */}
                  <p className={`text-gray-500 text-center line-clamp-2 ${isExpanded ? 'text-sm mb-3' : 'text-xs mb-3'}`}>
                    {isExpanded ? s.desc : s.desc.substring(0, 50) + '...'}
                  </p>
                  
                  {/* Expanded Full Description */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-600 text-center pb-3 border-t border-[#103D2E]/10 pt-3 mt-3">
                      {s.desc}
                    </p>
                  </motion.div>
                  
                  {/* Action Button */}
                  <div className={`flex justify-center ${isExpanded ? 'mt-4' : 'mt-3'}`}>
                    <button
                      onClick={() => handleLearnMore(serviceSlug)}
                      className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                        isExpanded 
                          ? 'px-6 py-2.5 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'px-4 py-2 text-xs bg-[#103D2E] text-white shadow-md hover:shadow-lg hover:bg-[#0a2a1f]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isExpanded ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Show Less
                          </>
                        ) : (
                          <>
                            Learn More
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ TECHNOLOGY ━━━ */}
      <TechSection expandedService={expandedTechService} onToggle={handleTechLearnMore} />

      {/* ━━━ WHY CHOOSE US ━━━ */}
      <FadeSection className="py-24 bg-white">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">Why Choose Us</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
              We Deliver Measurable Results
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              At Amolex Digital Tech, our services are designed to drive growth, efficiency, and innovation. You get:
            </p>
            <ul className="space-y-3">
              {whyUs.map((w) => (
                <li key={w.label} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#103D2E]" />
                  {w.label}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#103D2E] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#103D2E]/90"
            >
              Talk to Our Experts <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="floating-glass-card-dark rounded-3xl p-10 text-gray-950"
          >
            <p className="text-sm uppercase tracking-widest text-[#B29267]">Our Promise</p>
            <p className="mt-4 text-2xl font-semibold leading-snug">
              From digital marketing campaigns to custom software platforms, we measure our success by your results.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              {[{ v: "15+", l: "Projects" }, { v: "95%", l: "Satisfaction" }, { v: "10+", l: "Brands" }, { v: "24/7", l: "Support" }].map((s) => (
                <div key={s.l} className="floating-glass-card-dark rounded-xl py-4">
                  <p className="text-2xl font-bold text-[#B29267]">{s.v}</p>
                  <p className="text-xs text-gray-700">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </FadeSection>

      {/* ━━━ PACKAGES / SERVICES ━━━ */}
      <FadeSection className="py-24 bg-[#f6faf8]">
        <div className="container space-y-14">
          <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B29267]">What We Offer</p>
            <h2 className="font-heading text-4xl font-bold text-gray-900 lg:text-5xl">
              Choose the Service You Need
            </h2>
            <p className="text-base text-gray-500">Select a service to learn more, or contact us directly for a custom quote.</p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {allServices.map((service) => (
              <motion.div
                key={service.name}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col items-center justify-center rounded-2xl p-8 pt-10 text-center overflow-visible ${
                  service.highlight
                    ? "floating-glass-card-dark text-gray-950"
                    : "floating-glass-card"
                }`}
              >
                {service.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#B29267] to-[#8f7352] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[#B29267]/40 z-10">
                    Popular
                  </span>
                )}
                <h3 className={`font-heading text-2xl font-bold ${service.highlight ? "text-gray-950" : "text-gray-900"}`}>
                  {service.name}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${service.highlight ? "text-gray-700" : "text-gray-500"}`}>{service.tagline}</p>
                <div className="mt-8 w-full">
                  <Link
                    href={service.link || "/contact"}
                    className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
                      service.highlight
                        ? "floating-glass-card text-[#103D2E] hover:opacity-90"
                        : "bg-transparent border border-white/30 text-[#103D2E] hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    {service.cta || "Learn More"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ━━━ CTA ━━━ */}
      <FadeSection className="py-24 bg-[#103D2E]">
        <div className="container space-y-8 text-center">
          <motion.div variants={fadeUp} className="space-y-5">
            <h2 className="font-heading text-4xl font-bold text-white lg:text-5xl">
              Ready to Elevate Your Business?
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/65">
              Let&apos;s build solutions that grow your brand, simplify operations, and deliver results.
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
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Explore Our Solutions
            </Link>
          </motion.div>
        </div>
      </FadeSection>
    </>
  );
}
