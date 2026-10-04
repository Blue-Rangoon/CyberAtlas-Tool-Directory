/**
 * Icon registry.
 *
 * Data files reference icons by string key (so content stays serialisable for a
 * future MDX/JSON pipeline) and the UI resolves them here, against one
 * consistently-styled Lucide set. Unknown keys fall back to a neutral icon
 * rather than rendering nothing.
 */
import {
  Apple,
  Blocks,
  Bug,
  Cloud,
  Code,
  Compass,
  Container,
  Cpu,
  Database,
  FileSearch,
  FolderSearch,
  Globe,
  HardDrive,
  Hash,
  KeyRound,
  Layers,
  ListChecks,
  Lock,
  Microscope,
  Monitor,
  Network,
  Package,
  Puzzle,
  Radio,
  Radar,
  ScanSearch,
  Search,
  ShieldCheck,
  Target,
  Terminal,
  UserRound,
  Waypoints,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const DATA_ICONS: Record<string, LucideIcon> = {
  // platforms
  Apple,
  Monitor,
  Terminal,
  Blocks,
  Layers,
  Boxes: Blocks,
  Package,
  Container,
  Code,
  Globe,
  // categories
  ScanSearch,
  Target,
  Network,
  Microscope,
  Radio,
  Cloud,
  Wrench,
  // tools
  Radar,
  Waypoints,
  Zap,
  UserRound,
  Database,
  Lock,
  FileSearch,
  FolderSearch,
  Bug,
  KeyRound,
  Hash,
  Compass,
  Cpu,
  HardDrive,
  ListChecks,
  Puzzle,
  Search,
  Shield: ShieldCheck,
  ShieldCheck,
};

export function getIcon(key: string | undefined): LucideIcon {
  if (!key) return Wrench;
  return DATA_ICONS[key] ?? Wrench;
}
