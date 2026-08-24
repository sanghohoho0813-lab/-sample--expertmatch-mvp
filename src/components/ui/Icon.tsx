"use client";

import {
  Rocket,
  Megaphone,
  TrendingUp,
  Receipt,
  Scale,
  Compass,
  Users,
  PenTool,
  Code2,
  LineChart,
  Video,
  Phone,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Megaphone,
  TrendingUp,
  Receipt,
  Scale,
  Compass,
  Users,
  PenTool,
  Code2,
  LineChart,
  Video,
  Phone,
  MessageSquare,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.9,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Compass;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />;
}
