export const profileContent = {
  name: "Stas Neprokin",
  bio: "SpaceX designs, manufactures and launches the world's most advanced rockets and spacecraft.",
  location: "Earth",
  joined: "April 2009",
  websiteLabel: "spacex.com",
  websiteUrl: "https://www.spacex.com",
  links: [
    { label: "spacex.com", href: "https://www.spacex.com" },
    { label: "spacex.com", href: "https://www.spacex.com" },
    { label: "spacex.com", href: "https://www.spacex.com" },
  ],
  freePlaylists: 2,
  paidPlaylists: 4,
  desktopStats: [
    { value: "143", label: "Following" },
    { value: "149", label: "View" },
    { value: "149", label: "Likes" },
  ],
  mobileStats: [
    { value: "120", label: "Following" },
    { value: "40M", label: "Followers" },
    { value: "40M", label: "Likes" },
  ],
  about: [
    { value: "63.5M", label: "Views", icon: "views" },
    { value: "1.2M", label: "Likes", icon: "likes" },
    { value: "1.6M", label: "Visits", icon: "visits" },
    { value: "1.4M", label: "Shares", icon: "shares" },
    { value: "1,169", label: "videos", icon: "videos" },
  ],
  categories: [
    "Traveling",
    "Corporate Life",
    "Couples",
    "Trending Topic",
    "Festival",
    "Music listening",
    "Reading time",
    "Onlyfans",
  ],
  storyName: "John Deo",
  storyCount: 10,
} as const;

export type ProfileTab = "long" | "short" | "playlist" | "guestbook";

export const profileTabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "long", label: "Long video" },
  { id: "short", label: "Short video" },
  { id: "playlist", label: "Playlist" },
  { id: "guestbook", label: "Guestbook" },
];
