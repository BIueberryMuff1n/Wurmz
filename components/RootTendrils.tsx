export default function RootTendrils() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Left tendril */}
      <svg
        className="absolute -left-8 top-1/4 opacity-[0.07]"
        width="120"
        height="600"
        viewBox="0 0 120 600"
        fill="none"
        style={{ animation: "drift 20s ease-in-out infinite" }}
      >
        <path
          d="M60 0 C40 80 80 160 50 240 C20 320 70 400 45 480 C30 540 60 580 55 600"
          stroke="#3D2B1F"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M50 240 C30 260 10 280 5 320"
          stroke="#3D2B1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M45 480 C25 500 15 510 10 540"
          stroke="#3D2B1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Right tendril */}
      <svg
        className="absolute -right-8 top-1/3 opacity-[0.07]"
        width="120"
        height="500"
        viewBox="0 0 120 500"
        fill="none"
        style={{
          animation: "drift 25s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      >
        <path
          d="M60 0 C80 70 40 140 70 210 C100 280 50 350 75 420 C90 460 60 490 65 500"
          stroke="#3D2B1F"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M70 210 C90 230 110 250 115 280"
          stroke="#3D2B1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Bottom right tendril */}
      <svg
        className="absolute -right-4 bottom-0 opacity-[0.05]"
        width="100"
        height="400"
        viewBox="0 0 100 400"
        fill="none"
        style={{
          animation: "drift 22s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      >
        <path
          d="M50 400 C30 340 70 280 40 220 C20 160 60 100 50 40"
          stroke="#3D2B1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
