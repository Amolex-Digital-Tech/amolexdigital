// Mock data for build time when database is not available
// This allows the build to pass even without a database connection

export type Project = {
  slug: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  hero: string;
  metrics: string[];
  challenge: string;
  solution: string;
  outcome: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  cover: string;
  content: string;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  featured: boolean;
};

// Team divisions for about page
export type TeamDivision = {
  name: string;
  description: string;
  icon: string;
  members?: Array<{
    name: string;
    role: string;
    focus: string;
  }>;
};

// Job posting type
export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  summary?: string;
  requirements: string[];
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  website?: string;
  weakness?: string;
  socialMetrics?: {
    followers: number;
    likes: number;
    watchStats?: string;
    engagements: number;
  };
  status: 'new' | 'contacted' | 'qualified' | 'lost';
};

// Mock projects data
const mockProjects: Project[] = [
  {
    slug: "amolex-website",
    name: "Amolex Website",
    description: "Modern digital agency website built with Next.js",
    category: "Web Development",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    hero: "/portfolio/media/image1.jpeg",
    metrics: ["50% faster load time", "100% mobile responsive"],
    challenge: "Create a modern, responsive website",
    solution: "Used Next.js 14 with modern design patterns",
    outcome: "Successfully launched with great performance"
  }
];

// Mock posts data
const mockPosts: Post[] = [
  {
    slug: "digital-transformation",
    title: "Digital Transformation in 2024",
    excerpt: "How businesses are embracing digital technologies to transform their operations",
    category: "Technology",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    featured: true,
    cover: "/blog/cover-1.jpg",
    content: "Digital transformation continues to evolve as businesses embrace new technologies..."
  }
];

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    name: "Samuel Tedros",
    role: "CEO & Founder",
    image: "/amolex-logo-new.png",
    bio: "Tech entrepreneur with 10+ years experience in digital transformation",
    social: { linkedin: "https://linkedin.com" }
  },
  {
    name: "Team Member",
    role: "Developer",
    image: "/amolex-logo-new.png",
    bio: "Experienced developer"
  }
];

// Mock team divisions data with members
const mockTeamDivisions: TeamDivision[] = [
  {
    name: "Executive Leadership",
    description: "Building modern web applications",
    icon: "code",
    members: [
      { name: "Samuel Tedros", role: "CEO & Founder", focus: "Strategy & Vision" },
      { name: "Natnael Bekele", role: "COO", focus: "Operations" }
    ]
  },
  {
    name: "Strategic",
    description: "Creating beautiful user interfaces",
    icon: "palette",
    members: [
      { name: "Selamawit Daniel", role: "Strategic Lead", focus: "Brand Strategy" },
      { name: "Birhanu Taye", role: "Brand Director", focus: "Brand Management" }
    ]
  },
  {
    name: "Creative",
    description: "Growing your digital presence",
    icon: "megaphone",
    members: [
      { name: "Dagmawi Sisay", role: "Creative Lead", focus: "Content Creation" },
      { name: "Helen Girma", role: "Designer", focus: "UI/UX Design" }
    ]
  },
  {
    name: "Technical",
    description: "Technical development",
    icon: "code",
    members: [
      { name: "Abebe Kebede", role: "Tech Lead", focus: "Full Stack Development" }
    ]
  }
];

// Mock jobs data
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build modern web applications",
    summary: "Join our team to build cutting-edge web applications using modern technologies like Next.js and React.",
    requirements: ["5+ years experience", "React/Next.js expertise"]
  }
];

// Mock testimonials data
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Doe",
    role: "CEO",
    company: "Tech Corp",
    content: "Great service and professional team!",
    featured: true
  }
];

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Potential Strategic Partner",
    email: "contact@partner.com",
    website: "https://partner-web.com",
    weakness: "Low organic reach on video platforms",
    socialMetrics: {
      followers: 5400,
      likes: 1200,
      watchStats: "45k views",
      engagements: 3100
    },
    status: "new"
  }
];

// All functions now return mock data to avoid database connection issues during build
export async function getProjects(): Promise<Project[]> {
  return mockProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return mockProjects.find(p => p.slug === slug) || null;
}

export async function getPosts(): Promise<Post[]> {
  return mockPosts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return mockPosts.find(p => p.slug === slug) || null;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return mockTeamMembers;
}

export async function getTeamDivisions(): Promise<TeamDivision[]> {
  return mockTeamDivisions;
}

export async function getJobs(): Promise<Job[]> {
  return mockJobs;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return mockTestimonials;
}

export async function getLeads(): Promise<Lead[]> {
  return mockLeads;
}

// Also export as named arrays for pages that import them directly
export const teamMembers = mockTeamMembers;
export const teamDivisions = mockTeamDivisions;
export const jobs = mockJobs;
export const posts = mockPosts;
export const projects = mockProjects;
export const testimonials = mockTestimonials;
export const leads = mockLeads;

// Metrics for the metrics strip component
export const metrics = [
  { value: "50+", label: "Projects Delivered" },
  { value: "10+", label: "Years Experience" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" }
];

// Services offered
export const services = [
  { title: "Web Development", description: "Modern, responsive websites built with cutting-edge technologies", points: ["Next.js & React", "Custom APIs", "CMS Integration"] },
  { title: "Mobile Apps", description: "Native and cross-platform mobile applications", points: ["iOS & Android", "React Native", "App Store Optimization"] },
  { title: "AI Solutions", description: "Intelligent automation and machine learning integration", points: ["Machine Learning", "Automation", "Smart Analytics"] },
  { title: "Cloud Infrastructure", description: "Scalable cloud architecture and DevOps", points: ["AWS & Azure", "Docker & Kubernetes", "CI/CD Pipelines"] },
  { title: "UI/UX Design", description: "Beautiful, intuitive user interfaces", points: ["Figma Design", "Prototyping", "User Research"] },
  { title: "Digital Marketing", description: "Growth-focused marketing strategies", points: ["SEO", "Social Media", "Content Marketing"] }
];
