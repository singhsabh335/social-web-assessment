import {
  Clock3,
  FileText,
  Hash,
  Home,
  LayoutGrid,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

export const sidebarItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "videos", label: "Videos", icon: RectangleHorizontal },
  { id: "browse", label: "Browse", icon: LayoutGrid },
  { id: "library", label: "Library", icon: FileText },
  { id: "topics", label: "Topics", icon: Hash },
  { id: "history", label: "History", icon: Clock3 },
];
