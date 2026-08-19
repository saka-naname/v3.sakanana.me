export const siteNavigation = [
  { label: "About", href: "/about/" },
  { label: "Works", href: "/works/" },
  { label: "Notes", href: "/notes/" },
] as const;

export const socialLinks = [
  {
    label: "GitHub",
    accessibleLabel: "GitHub プロフィールを見る",
    href: "https://github.com/saka-naname",
    icon: "hugeicons:github-01",
  },
  {
    label: "Bluesky",
    accessibleLabel: "Bluesky プロフィールを見る",
    href: "https://bsky.app/profile/sakanana.me",
    icon: "hugeicons:bluesky",
  },
  {
    label: "X",
    accessibleLabel: "X プロフィールを見る",
    href: "https://x.com/sakanana_me",
    icon: "hugeicons:new-twitter",
  },
] as const;
