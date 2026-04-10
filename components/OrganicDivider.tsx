"use client";

interface OrganicDividerProps {
  flip?: boolean;
  color?: string;
}

export default function OrganicDivider({
  flip = false,
  color = "#1E1710",
}: OrganicDividerProps) {
  return (
    <div
      className="relative w-full overflow-hidden pointer-events-none"
      style={{
        height: "80px",
        transform: flip ? "scaleY(-1)" : undefined,
        marginTop: flip ? "-1px" : undefined,
        marginBottom: flip ? undefined : "-1px",
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0,40 C120,60 240,10 360,35 C480,60 600,15 720,40 C840,65 960,20 1080,45 C1200,70 1320,25 1440,40 L1440,80 L0,80 Z"
          fill={color}
          opacity="0.6"
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,40 C120,60 240,10 360,35 C480,60 600,15 720,40 C840,65 960,20 1080,45 C1200,70 1320,25 1440,40 L1440,80 L0,80 Z;
              M0,35 C120,15 240,55 360,40 C480,25 600,60 720,35 C840,10 960,55 1080,40 C1200,25 1320,60 1440,35 L1440,80 L0,80 Z;
              M0,45 C120,70 240,20 360,45 C480,70 600,25 720,50 C840,75 960,30 1080,35 C1200,60 1320,15 1440,45 L1440,80 L0,80 Z;
              M0,40 C120,60 240,10 360,35 C480,60 600,15 720,40 C840,65 960,20 1080,45 C1200,70 1320,25 1440,40 L1440,80 L0,80 Z
            "
          />
        </path>
        {/* Second layer for depth */}
        <path
          d="M0,50 C160,30 320,65 480,45 C640,25 800,60 960,50 C1120,40 1280,55 1440,50 L1440,80 L0,80 Z"
          fill={color}
          opacity="0.3"
        >
          <animate
            attributeName="d"
            dur="16s"
            repeatCount="indefinite"
            values="
              M0,50 C160,30 320,65 480,45 C640,25 800,60 960,50 C1120,40 1280,55 1440,50 L1440,80 L0,80 Z;
              M0,55 C160,70 320,35 480,55 C640,70 800,40 960,55 C1120,70 1280,35 1440,55 L1440,80 L0,80 Z;
              M0,45 C160,25 320,60 480,40 C640,20 800,55 960,45 C1120,30 1280,65 1440,45 L1440,80 L0,80 Z;
              M0,50 C160,30 320,65 480,45 C640,25 800,60 960,50 C1120,40 1280,55 1440,50 L1440,80 L0,80 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}
