import type { PlatformDef, PlatformId } from "@/types";

/**
 * Central platform definitions. Badges, installation tabs and filters all read
 * from here so a platform label never drifts between pages.
 */
export const PLATFORMS: Record<PlatformId, PlatformDef> = {
  windows: {
    id: "windows",
    label: "Windows",
    short: "Windows",
    icon: "Monitor",
    isOs: true,
    installable: true,
  },
  macos: {
    id: "macos",
    label: "macOS",
    short: "macOS",
    icon: "Apple",
    isOs: true,
    installable: true,
  },
  linux: {
    id: "linux",
    label: "Linux",
    short: "Linux",
    icon: "Terminal",
    isOs: true,
    installable: true,
  },
  parrot: {
    id: "parrot",
    label: "Parrot OS",
    short: "Parrot",
    icon: "Blocks",
    isOs: true,
    installable: true,
  },
  kali: {
    id: "kali",
    label: "Kali Linux",
    short: "Kali",
    icon: "Layers",
    isOs: true,
    installable: true,
  },
  arch: {
    id: "arch",
    label: "Arch Linux",
    short: "Arch",
    icon: "Boxes",
    isOs: true,
    installable: true,
  },
  fedora: {
    id: "fedora",
    label: "Fedora",
    short: "Fedora",
    icon: "Package",
    isOs: true,
    installable: true,
  },
  docker: {
    id: "docker",
    label: "Docker",
    short: "Docker",
    icon: "Container",
    isOs: false,
    installable: true,
  },
  source: {
    id: "source",
    label: "From Source",
    short: "Source",
    icon: "Code",
    isOs: false,
    installable: true,
  },
  web: {
    id: "web",
    label: "Web / Self-hosted",
    short: "Web",
    icon: "Globe",
    isOs: false,
    installable: false,
  },
};

/** Platforms that make sense as installation tabs (ordered). */
export const INSTALL_PLATFORM_ORDER: PlatformId[] = [
  "windows",
  "macos",
  "linux",
  "kali",
  "parrot",
  "arch",
  "fedora",
  "docker",
  "source",
  "web",
];

/** Platforms offered as directory filters. */
export const FILTERABLE_PLATFORMS: PlatformId[] = [
  "windows",
  "macos",
  "linux",
  "kali",
  "parrot",
  "arch",
  "fedora",
  "docker",
];

export function platformLabel(id: PlatformId): string {
  return PLATFORMS[id]?.label ?? id;
}
