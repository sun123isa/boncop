import type { ReactNode } from "react";

export type AboutIconName =
  | "arrow-right"
  | "rocket"
  | "shield"
  | "sparkles"
  | "target"
  | "users";

const ICON_PATHS: Record<AboutIconName, ReactNode> = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.9-.9.9-2.4 0-3.3-.9-.9-2.4-.9-3.3 0Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.5A12.5 12.5 0 0 1 21 3a12.5 12.5 0 0 1-5.5 10.5A22 22 0 0 1 12 15Z" />
      <path d="M9 12H4s.5-2.8 2-4c1.5-1.2 4-1 4-1M12 15v5s2.8-.5 4-2c1.2-1.5 1-4 1-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkles: (
    <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: AboutIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
