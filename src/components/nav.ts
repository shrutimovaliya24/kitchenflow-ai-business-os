import {
  LayoutDashboard,
  Headphones,
  ShieldCheck,
  Megaphone,
  Wallet,
  Activity,
  Network,
  Bot,
  FlaskConical,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer-support", label: "Customer Support", icon: Headphones },
  { href: "/partner-verification", label: "Partner Verification", icon: ShieldCheck },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/finance", label: "Finance Dashboard", icon: Wallet },
  { href: "/workflow-monitoring", label: "Workflow Monitoring", icon: Activity },
  { href: "/architecture", label: "Architecture", icon: Network },
  { href: "/agents-paci", label: "Agents & PACI", icon: Bot },
  { href: "/testing-safety", label: "Testing & Safety", icon: FlaskConical },
  { href: "/content-script", label: "Content Script", icon: Clapperboard },
];
