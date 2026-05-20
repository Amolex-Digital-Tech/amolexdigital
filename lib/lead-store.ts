export type LeadStatus = "hot" | "warm" | "cold" | "archived";
export type TimelineType = "call" | "email" | "meeting";
export type ContactPreference = "email" | "phone";

export interface TimelineEvent {
  id: string;
  type: TimelineType;
  title: string;
  note: string;
  by: string;
  at: string;
}

export interface LeadNote {
  id: string;
  author: string;
  content: string;
  at: string;
  source: "manual" | "voice";
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  lastActivityAt: string;
  createdAt: string;
  source: string;
  region: string;
  assignedAgent: string;
  interest: string;
  score: number;
  engagementScore: number;
  contactPreference: ContactPreference;
  notes: LeadNote[];
  followUpHistory: TimelineEvent[];
}

export interface NewLeadFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  region: string;
  assignedAgent: string;
  interest: string;
  score: string;
  engagementScore: string;
  contactPreference: ContactPreference;
  createdAt: string;
  lastActivityAt: string;
  noteAuthor: string;
  noteContent: string;
  followUpType: TimelineType;
  followUpTitle: string;
  followUpNote: string;
  followUpBy: string;
  followUpAt: string;
}

export const LEAD_STORAGE_KEY = "amolex:admin:leads";

export const SOURCE_OPTIONS = [
  "Website Form",
  "LinkedIn Campaign",
  "Referral",
  "Cold Email",
  "Partner Referral",
  "Webinar",
  "Event Booth",
];

export const REGION_OPTIONS = ["North America", "Europe", "Middle East", "Africa", "Asia-Pacific"];
export const AGENT_OPTIONS = ["Sarah Kim", "Daniel Reed", "Amina Yusuf", "Jonathan Miles", "Leila Haddad"];
export const INTEREST_OPTIONS = ["Enterprise", "Growth", "Professional", "Custom", "Starter"];

export function buildSeedLeads(): Lead[] {
  const roster = [
    ["Sarah Chen", "TechCore Labs"],
    ["Michael Rodriguez", "InnovateX"],
    ["Emma Thompson", "Global Tech Inc"],
    ["David Kim", "StartUp Ventures"],
    ["Lisa Anderson", "Creative Minds"],
    ["Noah Williams", "BlueOrbit"],
    ["Priya Patel", "Streamline Group"],
    ["James Carter", "FusionBridge"],
    ["Olivia Martin", "Velocity Data"],
    ["Ethan Brooks", "Catalyst Works"],
    ["Mariam Ali", "Pioneer Commerce"],
    ["Carlos Diaz", "NexWave Systems"],
    ["Hannah Moore", "Silverline Hub"],
    ["Ahmed Nasser", "Vertex Partners"],
    ["Chloe Adams", "SignalFlow"],
    ["Samuel Johnson", "Monarch Labs"],
    ["Nina Rivera", "CloudSpring"],
    ["Victor Hugo", "Axis Intelligence"],
    ["Ava Wilson", "BrightPath Media"],
    ["Mateo Silva", "OmniGrid"],
    ["Fatima Noor", "PrimeScale"],
    ["Jacob Lee", "NorthGate Advisors"],
    ["Sophie Turner", "Aurora Systems"],
    ["Liam Morgan", "Everest Dynamics"],
    ["Grace Park", "Benchmark Studio"],
    ["Benjamin Cole", "Apex Programs"],
    ["Amara Okoye", "Frontline Matrix"],
    ["Ryan Foster", "Quantum Delta"],
    ["Lucy Evans", "Unified Growth"],
    ["Yousef Karim", "Nimbus Harbor"],
  ] as const;

  const now = Date.now();

  return roster.map(([name, company], index) => {
    const score = 48 + ((index * 9) % 50);
    const status: LeadStatus = index % 11 === 0 ? "archived" : score >= 82 ? "hot" : score >= 66 ? "warm" : "cold";
    const createdAt = new Date(now - (index % 21) * 86_400_000 - (index % 4) * 3_600_000).toISOString();
    const lastActivityAt = new Date(now - ((index * 17) % 180) * 3_600_000).toISOString();
    const source = SOURCE_OPTIONS[index % SOURCE_OPTIONS.length];
    const region = REGION_OPTIONS[index % REGION_OPTIONS.length];
    const assignedAgent = AGENT_OPTIONS[index % AGENT_OPTIONS.length];
    const interest = INTEREST_OPTIONS[index % INTEREST_OPTIONS.length];
    const noteAt = new Date(now - ((index + 1) % 4) * 86_400_000).toISOString();

    return {
      id: `lead-${index + 1}`,
      name,
      company,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: `+1 (555) ${String(100 + index).padStart(3, "0")}-${String(1000 + index * 7).slice(0, 4)}`,
      status,
      lastActivityAt,
      createdAt,
      source,
      region,
      assignedAgent,
      interest,
      score,
      engagementScore: Math.min(100, score + (status === "hot" ? 6 : status === "warm" ? 2 : -4)),
      contactPreference: index % 2 === 0 ? "email" : "phone",
      notes: [
        {
          id: `${index}-note-1`,
          author: assignedAgent,
          content: "Qualified for next-stage follow-up based on recent engagement.",
          at: noteAt,
          source: "manual",
        },
      ],
      followUpHistory: [
        {
          id: `${index}-call`,
          type: "call",
          title: "Discovery Call",
          note: "Initial qualification and budget discussion.",
          by: assignedAgent,
          at: new Date(now - ((index + 3) % 10) * 86_400_000).toISOString(),
        },
        {
          id: `${index}-email`,
          type: "email",
          title: "Proposal Email",
          note: "Sent proposal with pricing tiers and onboarding timeline.",
          by: assignedAgent,
          at: new Date(now - ((index + 1) % 7) * 86_400_000).toISOString(),
        },
        {
          id: `${index}-meeting`,
          type: "meeting",
          title: "Product Demo",
          note: "Demo completed with core stakeholders present.",
          by: assignedAgent,
          at: new Date(now - ((index + 2) % 5) * 86_400_000).toISOString(),
        },
      ],
    };
  });
}

export function loadLeadsFromStorage(seed: Lead[] = buildSeedLeads()): Lead[] {
  if (typeof window === "undefined") {
    return seed;
  }

  try {
    const raw = window.localStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) {
      return seed;
    }

    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed;
  } catch {
    return seed;
  }
}

export function saveLeadsToStorage(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leads));
}

export function createLeadFromForm(values: NewLeadFormValues): Lead {
  const now = new Date().toISOString();
  const toIso = (value: string) => {
    if (!value) return now;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? now : parsed.toISOString();
  };
  const noteContent = values.noteContent.trim();
  const followUpNote = values.followUpNote.trim();
  const followUpTitle = values.followUpTitle.trim();
  const followUpBy = values.followUpBy.trim() || values.assignedAgent || values.noteAuthor || values.name;

  const notes: LeadNote[] = noteContent
    ? [
        {
          id: `note-${Date.now()}`,
          author: values.noteAuthor.trim() || values.assignedAgent || values.name,
          content: noteContent,
          at: now,
          source: "manual",
        },
      ]
    : [];

  const followUpHistory: TimelineEvent[] =
    followUpNote || followUpTitle
      ? [
          {
            id: `timeline-${Date.now()}`,
            type: values.followUpType,
            title: followUpTitle || "Manual Follow-Up",
            note: followUpNote || "Added from admin lead form.",
            by: followUpBy,
            at: toIso(values.followUpAt),
          },
        ]
      : [];

  const createdAt = toIso(values.createdAt);
  const lastActivityAt = toIso(values.lastActivityAt || values.followUpAt || values.createdAt || now);
  const score = Number(values.score || 0);
  const engagementScore = Number(values.engagementScore || score);

  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    status: values.status,
    lastActivityAt,
    createdAt,
    source: values.source.trim(),
    region: values.region.trim(),
    assignedAgent: values.assignedAgent.trim() || "Unassigned",
    interest: values.interest.trim(),
    score: Number.isFinite(score) ? score : 0,
    engagementScore: Number.isFinite(engagementScore) ? engagementScore : 0,
    contactPreference: values.contactPreference,
    notes,
    followUpHistory,
  };
}
