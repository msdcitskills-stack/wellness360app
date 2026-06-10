import {
  Ribbon, Brain, HeartPulse, Baby, Flower2, Apple, Droplet, Scale,
  Sparkles, Bone, Activity, Stethoscope, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Ribbon, Brain, HeartPulse, Baby, Flower2, Apple, Droplet, Scale,
  Sparkles, Bone, Activity,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Stethoscope;
  return <Icon className={className} aria-hidden />;
}
