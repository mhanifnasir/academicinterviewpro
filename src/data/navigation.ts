import {
  LayoutDashboard,
  User,
  BookOpen,
  Mic,
  Volume2,
  CheckSquare,
  FileText,
  Code2,
  Presentation,
  FolderDown,
  BarChart3,
  CreditCard,
  Settings,
  Users,
  Layers,
  HelpCircle,
  Cpu,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  section?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const CANDIDATE_NAV_ITEMS: NavItem[] = [
  // CORE PREPARATION
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "CORE PREPARATION",
  },
  {
    title: "CS Subject Library",
    href: "/dashboard/subjects",
    icon: BookOpen,
    badge: "21 Subjects",
    section: "CORE PREPARATION",
  },
  {
    title: "MCQ Practice Suite",
    href: "/dashboard/mcq-practice",
    icon: CheckSquare,
    section: "CORE PREPARATION",
  },
  {
    title: "Mock Examinations",
    href: "/dashboard/mock-exams",
    icon: FileText,
    badge: "100-Marks",
    section: "CORE PREPARATION",
  },

  // SELECTION BOARD LABS
  {
    title: "AI Interview Prep",
    href: "/dashboard/interview-prep",
    icon: Mic,
    badge: "AI Panel",
    section: "SELECTION BOARD LABS",
  },
  {
    title: "English Voice Lab",
    href: "/dashboard/english-lab",
    icon: Volume2,
    section: "SELECTION BOARD LABS",
  },
  {
    title: "Programming Lab",
    href: "/dashboard/programming-lab",
    icon: Code2,
    section: "SELECTION BOARD LABS",
  },
  {
    title: "Teaching Practice",
    href: "/dashboard/teaching-practice",
    icon: Presentation,
    section: "SELECTION BOARD LABS",
  },

  // ACADEMIC VAULT
  {
    title: "Study Resources & Past Papers",
    href: "/dashboard/resources",
    icon: FolderDown,
    section: "ACADEMIC VAULT",
  },
  {
    title: "Performance Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    section: "ACADEMIC VAULT",
  },

  // ACCOUNT & SETTINGS
  {
    title: "Profile & Credentials",
    href: "/dashboard/profile",
    icon: User,
    section: "ACCOUNT & SETTINGS",
  },
  {
    title: "Subscription & Plans",
    href: "/dashboard/subscription",
    icon: CreditCard,
    section: "ACCOUNT & SETTINGS",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    section: "ACCOUNT & SETTINGS",
  },
];

export const CANDIDATE_NAV_SECTIONS: NavSection[] = [
  {
    title: "CORE PREPARATION",
    items: CANDIDATE_NAV_ITEMS.filter((i) => i.section === "CORE PREPARATION"),
  },
  {
    title: "SELECTION BOARD LABS",
    items: CANDIDATE_NAV_ITEMS.filter((i) => i.section === "SELECTION BOARD LABS"),
  },
  {
    title: "ACADEMIC VAULT",
    items: CANDIDATE_NAV_ITEMS.filter((i) => i.section === "ACADEMIC VAULT"),
  },
  {
    title: "ACCOUNT & SETTINGS",
    items: CANDIDATE_NAV_ITEMS.filter((i) => i.section === "ACCOUNT & SETTINGS"),
  },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  // GOVERNANCE & USERS
  {
    title: "Admin Overview",
    href: "/admin",
    icon: LayoutDashboard,
    section: "GOVERNANCE",
  },
  {
    title: "Candidates / Users",
    href: "/admin/users",
    icon: Users,
    badge: "12,480",
    section: "GOVERNANCE",
  },

  // ACADEMIC CURRICULUM
  {
    title: "CS Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
    section: "ACADEMIC CURRICULUM",
  },
  {
    title: "Topics & Syllabi",
    href: "/admin/topics",
    icon: Layers,
    section: "ACADEMIC CURRICULUM",
  },
  {
    title: "Question Bank",
    href: "/admin/questions",
    icon: HelpCircle,
    badge: "18.4K",
    section: "ACADEMIC CURRICULUM",
  },
  {
    title: "Mock Tests Manager",
    href: "/admin/mock-tests",
    icon: FileText,
    section: "ACADEMIC CURRICULUM",
  },
  {
    title: "Study Materials & Past Papers",
    href: "/admin/study-materials",
    icon: FolderDown,
    section: "ACADEMIC CURRICULUM",
  },

  // AI & VOICE SYSTEMS
  {
    title: "AI Interview Settings",
    href: "/admin/ai-settings",
    icon: Cpu,
    section: "AI & VOICE SYSTEMS",
  },
  {
    title: "English Lab Scenarios",
    href: "/admin/english-scenarios",
    icon: Volume2,
    section: "AI & VOICE SYSTEMS",
  },

  // COMMERCE & SECURITY
  {
    title: "Subscriptions & PKR Billing",
    href: "/admin/subscriptions",
    icon: CreditCard,
    section: "COMMERCE & SECURITY",
  },
  {
    title: "Audit & Security Logs",
    href: "/admin/audit-logs",
    icon: ShieldAlert,
    section: "COMMERCE & SECURITY",
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
    section: "COMMERCE & SECURITY",
  },
];

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "GOVERNANCE",
    items: ADMIN_NAV_ITEMS.filter((i) => i.section === "GOVERNANCE"),
  },
  {
    title: "ACADEMIC CURRICULUM",
    items: ADMIN_NAV_ITEMS.filter((i) => i.section === "ACADEMIC CURRICULUM"),
  },
  {
    title: "AI & VOICE SYSTEMS",
    items: ADMIN_NAV_ITEMS.filter((i) => i.section === "AI & VOICE SYSTEMS"),
  },
  {
    title: "COMMERCE & SECURITY",
    items: ADMIN_NAV_ITEMS.filter((i) => i.section === "COMMERCE & SECURITY"),
  },
];

export const PUBLIC_NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "CS Subjects", href: "#subjects" },
  { name: "AI Viva Demo", href: "#ai-demo" },
  { name: "English Lab", href: "#english-demo" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];
