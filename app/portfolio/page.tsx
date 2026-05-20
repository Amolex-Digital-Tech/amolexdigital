import { buildMetadata } from "@/lib/site";

import styles from "./portfolio.module.css";

export const metadata = buildMetadata({
  title: "Portfolio | Amolex Digital Tech",
  path: "/portfolio"
});

const trustedLogos = [
  "/portfolio/media/image6.png",
  "/portfolio/media/image7.png",
  "/portfolio/media/image8.png",
  "/portfolio/media/image9.png",
  "/portfolio/media/image10.png",
  "/portfolio/media/image11.png",
  "/portfolio/media/ghion-logo.png",
  "/portfolio/media/hibir-logo.png"
];

const highlights = [
  { label: "Projects completed to date", value: "15+", color: "#0b422fff" },
  { label: "Client Satisfaction Rate", value: "95%", color: "#103d2e" }
];

const projects = [
  {
    category: "SOCIAL MEDIA MARKETING",
    title: "Lunar Interiors",
    description:
      "Lunar Interior Services specializes in designing modern offices and workspaces for medium enterprises. Amolex Digital Tech enhanced their social media presence through creative content and targeted marketing campaigns.",
    details: [
      "Client: Lunar Interiors",
      "Objective: LTo increase brand awareness and engagement for Lunar Interior Services by showcasing their modern office and workspace designs across social media platforms.",
      "Our Role: We created and managed engaging social media content to highlight their projects and attract clients.",
      "Duration: 3 months"
    ],
    logo: "/portfolio/media/lunar.png",
    feature: "/portfolio/media/lunar.png"
  },
  {
    category: "BRANDING PROJECT",
    title: "Lunar Interiors",
    description: "A complete branding and marketing package.",
    details: [
      "Client: Lunar Architectures And Interiors",
      "Our Role: Brand Strategy, Visual Identity, Marketing Materials, Website",
      "Duration: 15 days"
    ],
    logo: "/portfolio/media/image16.jpeg",
    feature: "/portfolio/media/image17.jpeg"
  },
  {
    category: "SOCIAL MEDIA MARKETING",
    title: "Majestic Trading PLc",
    description:
      "Majestic Trading PLC is a leading interior design and furniture company that creates stylish and functional spaces for homes and offices.",
    details: [
      "Client: Majestic Trading PLC",
      "Objective: Increase brand visibility and engagement for Majestic Trading PLC’s interior design and furniture services.",
      "Our Role: We managed social media, created engaging content, and ran targeted advertising campaigns to reach a wider audience.",
      "Duration: 4 months"
    ],
    logo: "/portfolio/media/image18.jpeg",
    gallery: [
      "/portfolio/media/image19.jpeg",
      "/portfolio/media/image20.jpeg",
      "/portfolio/media/image21.jpeg"
    ]
  },
  {
    category: "SOCIAL MEDIA MARKETING",
    title: "Birhan ethiopia clinic",
    description:
      "Birhan Ethiopia Clinic is a healthcare provider committed to delivering quality medical services to the community.",
    details: [
      "Client: Birhan ethhiiopia clinic",
      "Objective: Increase the clinic’s visibility and engagement online to reach more patients and build trust.",
      "Our Role: We managed their social media, created informative and engaging content, and promoted their services to the target audience.",
      "Duration: 2 months",
      "Result:  Our campaigns reached over 1.6 million views, significantly increasing patient inquiries and online engagement."
    ],
    feature: "/portfolio/media/image22.png"
  },
  {
    category: "BRANDING PROJECT",
    title: "Data Neutral Analysis Techs",
    description: "A complete branding, Partnership and marketing package.",
    details: [
      "Client: DNA Techs",
      "Our Role: As a partner, DNA Tech supported Amolex Digital Tech in data collection and analysis, providing valuable insights that guided marketing strategies and branding decisions for our clients.",
      "Duration: 15 days"
    ],
    logo: "/portfolio/media/image23.jpeg",
    feature: "/portfolio/media/image24.png"
  }
];

const testimonials = [
  {
    quote:
      "Working with Amolex Digital Tech has transformed how we connect with our audience. Their creative content and strategic campaigns significantly boosted our online presence and engagement.",
    name: "majestic ttrading PLC"
  },
  {
    quote:
      "Partnering with Amolex Digital Tech allowed us to provide data-driven insights that shaped impactful marketing and branding strategies. Their professionalism and results-driven approach make collaboration seamless.",
    name: "Jalene t.chali"
  }
];

export default function PortfolioPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} aria-hidden />
        <div className={styles.heroOverlay} aria-hidden />
        <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="space-y-3">
               <p className={`${styles.anton} text-sm text-secondary`}>Project</p>
               <h1 className={`${styles.brittany} text-5xl text-black sm:text-6xl lg:text-7xl`}>Portfolio</h1>
             </div>
            <p className="max-w-xl text-base leading-relaxed text-[hsl(220_20%_5%)]">
               This portfolio highlights the projects and collaborations of Amolex Digital Tech, showcasing our
               expertise in social media management, branding, content creation, and digital advertising. Each project
               reflects our commitment to delivering creative, strategic, and measurable results for our clients. We
               continue to build meaningful connections between brands and their audiences, helping businesses grow and
               stand out in a competitive market.
            </p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroLogoContainer}>
              <img
                src="/brand/amolex-new.png"
                alt="Amolex Digital Tech"
                className={styles.heroLogoMain}
                loading="eager"
                draggable={false}
              />
              <div className={styles.heroLogoGlow} />
              <div className={styles.heroLogoRing} />
              <div className={styles.heroLogoRing2} />
            </div>
            <div className={styles.heroOrbit}>
              <div className={styles.heroOrbitDot} style={{ animationDelay: '0s' }} />
              <div className={styles.heroOrbitDot} style={{ animationDelay: '0.5s' }} />
              <div className={styles.heroOrbitDot} style={{ animationDelay: '1s' }} />
              <div className={styles.heroOrbitDot} style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </section>

       <section className={styles.section}>
         <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
           <div className="space-y-6">
             <p className={`${styles.anton} text-xs text-secondary`}>About This</p>
             <h2 className={`${styles.brittany} text-4xl text-foreground sm:text-5xl`}>Portfolio</h2>
            <p className="text-base leading-relaxed text-[hsl(220_20%_5%)]">
                We craft strategies that connect brands with their audience and tell their story with impact. Through
                creative content, targeted advertising, and strategic social media management, we help businesses grow,
                engage, and leave a lasting impression.
            </p>
           </div>
          <div className={styles.aboutCard}>
            <img src="/portfolio/media/image12.png" alt="" aria-hidden className={styles.aboutBackdrop} />
            <div className="relative z-10 space-y-6">
              <div>
                <p className={`${styles.braggadocio} text-xs text-secondary`}>Trusted By</p>
                <h3 className={`${styles.brittany} text-3xl text-primary`}>Companies</h3>
              </div>
              <div className={styles.logoScrollContainer}>
                <div className={styles.logoScrollTrack}>
                  {[...trustedLogos, ...trustedLogos, ...trustedLogos].map((logo, index) => (
                    <div key={`${logo}-${index}`} className={styles.logoScrollItem}>
                      <img src={logo} alt="" aria-hidden className={styles.logoScrollImage} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section className={`${styles.section} ${styles.highlightsSection}`}>
         <div className="container space-y-10">
           <div className="space-y-3">
             <p className={`${styles.anton} text-sm text-secondary`}>Our Project</p>
             <h2 className={`${styles.brittany} text-4xl text-foreground sm:text-5xl`}>Highlights</h2>
           </div>
           <div className="grid gap-6 sm:grid-cols-2">
             {highlights.map((item) => (
               <div key={item.label} className={`${styles.highlightCard} floating-glass-card rounded-3xl p-8`}>
                 <p className={`${styles.anton} text-4xl text-foreground`}>{item.value}</p>
                 <p className="mt-3 text-sm uppercase tracking-[0.24em] text-secondary/80">{item.label}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

      <section className={`${styles.section} ${styles.projectsSection}`}>
        <div className="container space-y-12">
          <div className="space-y-3">
            <p className={`${styles.anton} text-sm text-secondary`}>Our Project</p>
            <h2 className={`${styles.brittany} text-4xl text-primary sm:text-5xl`}>Portfolio</h2>
          </div>
          <div className="grid gap-10">
            {projects.map((project) => (
              <article key={`${project.category}-${project.title}`} className={styles.projectCard}>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`${styles.anton} text-xs text-secondary`}>{project.category}</span>
                    {project.logo ? (
                      <img src={project.logo} alt="" aria-hidden className={styles.projectLogo} loading="lazy" />
                    ) : null}
                  </div>
                  <h3 className={`${styles.brittany} text-3xl text-primary`}>{project.title}</h3>
                   <p className="text-sm leading-relaxed text-foreground">{project.description}</p>
                  <ul className={styles.projectDetails}>
                    {project.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.projectMedia}>
                  {project.title === "Lunar Interiors" && project.category === "SOCIAL MEDIA MARKETING" ? (
                    <div className={styles.projectVisual}>
                      <div className={styles.projectVisualInner}>
                        <img src={project.feature} alt="" aria-hidden className={styles.projectVisualImage} loading="lazy" />
                        <div className={styles.projectVisualGlow} />
                        <div className={styles.projectVisualRing} />
                        <div className={styles.projectVisualOrbit}>
                          <div className={styles.projectVisualDot} />
                          <div className={styles.projectVisualDot} />
                          <div className={styles.projectVisualDot} />
                        </div>
                      </div>
                    </div>
                  ) : project.feature ? (
                    <img src={project.feature} alt="" aria-hidden className={styles.projectImage} loading="lazy" />
                  ) : null}
                  {project.gallery ? (
                    <div className={styles.projectGallery}>
                      {project.gallery.map((image) => (
                        <img key={image} src={image} alt="" aria-hidden loading="lazy" />
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.testimonialSection}`}>
        <div className="container space-y-10">
          <div className="space-y-3">
            <p className={`${styles.anton} text-sm text-secondary`}>What Our</p>
            <h2 className={`${styles.brittany} text-4xl text-primary sm:text-5xl`}>Clients Say</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className={styles.testimonialCard}>
                <img src="/portfolio/media/image25.png" alt="" aria-hidden className={styles.quoteMark} />
                 <blockquote className="text-base leading-relaxed text-foreground">{testimonial.quote}</blockquote>
                 <figcaption className={`${styles.anton} text-xs text-foreground`}>{testimonial.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.thankYouSection}>
        <div className={styles.thankYouBackdrop} aria-hidden />
        <div className="container relative z-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <h2 className={`${styles.brittany} text-4xl text-white sm:text-5xl`}>Thank You</h2>
            <p className={`${styles.anton} text-sm text-secondary`}>For Your Time</p>
          </div>
          <div className={styles.thankYouBody}>
            <p>
              This portfolio highlights the projects and collaborations of Amolex Digital Tech, showcasing our
              expertise in social media management, branding, content creation, and digital advertising. Each project
              reflects our commitment to delivering creative, strategic, and measurable results for our clients.
            </p>
            <p>
              We continue to build meaningful connections between brands and their audiences, helping businesses grow
              and stand out in a competitive market.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
