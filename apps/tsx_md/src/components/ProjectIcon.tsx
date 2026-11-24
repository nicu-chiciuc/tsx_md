import { useState } from "react";
import type { ProjectGlyph } from "@/lib/projects";

interface ProjectIconProps {
  glyph?: ProjectGlyph;
  icon?: string;
  size: number;
}

function GlyphMark({ glyph, size }: { glyph?: ProjectGlyph; size: number }) {
  switch (glyph) {
    case "apl":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="6.5" y="2" width="3" height="3" />
          <rect x="10.5" y="6" width="3" height="3" />
          <rect x="2.5" y="10" width="3" height="3" />
          <rect x="6.5" y="10" width="3" height="3" />
          <rect x="10.5" y="10" width="3" height="3" />
        </svg>
      );
    case "push":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="2" width="3" height="3" rx="0.5" />
          <rect x="11" y="2" width="3" height="3" rx="0.5" />
          <rect x="2" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="11" y="6.5" width="3" height="3" rx="0.5" />
          <rect x="2" y="11" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="11" width="3" height="3" rx="0.5" />
          <rect x="11" y="11" width="3" height="3" rx="0.5" />
        </svg>
      );
    case "planable":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="6" height="6" />
          <rect x="7" y="7" width="6" height="6" />
        </svg>
      );
    case "circles":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" />
          <circle cx="5.5" cy="8" r="2.8" />
          <circle cx="10.5" cy="8" r="2.8" />
        </svg>
      );
    case "gears":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <circle cx="5.5" cy="6" r="3.2" />
          <circle cx="10.8" cy="10.2" r="2.7" />
        </svg>
      );
    case "triangles":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="2.5,13 7,3 13.5,12" />
          <path d="M7 3l1.5 6.5M2.5 13l6-3.5 5 2.5" />
        </svg>
      );
    case "impossible":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="8,2.2 13.8,12.8 2.2,12.8" />
          <polygon points="8,6.5 10.6,11.2 5.4,11.2" />
        </svg>
      );
    case "spiro":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          aria-hidden="true"
        >
          <ellipse cx="8" cy="8" rx="6" ry="2.6" />
          <ellipse cx="8" cy="8" rx="6" ry="2.6" transform="rotate(60 8 8)" />
          <ellipse cx="8" cy="8" rx="6" ry="2.6" transform="rotate(120 8 8)" />
        </svg>
      );
    case "iterseg":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 11l3-5 3 3 3-5 3 4" />
        </svg>
      );
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="4.5" />
        </svg>
      );
  }
}

export function ProjectIcon({ glyph, icon, size }: ProjectIconProps) {
  const [failed, setFailed] = useState(false);

  if (icon && !failed) {
    return (
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="shrink-0 object-contain"
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center text-gray-500"
      style={{ height: size, width: size }}
    >
      <GlyphMark glyph={glyph} size={size} />
    </span>
  );
}
