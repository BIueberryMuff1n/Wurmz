export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      {/* Tiny worm pointing down */}
      <svg
        width="16"
        height="30"
        viewBox="0 0 16 30"
        className="text-mycelium"
        style={{ animation: "bounce-soft 2s ease-in-out infinite" }}
      >
        <rect
          x="4" y="0" width="8" height="22" rx="4" ry="4"
          fill="#B83228" opacity="0.5"
          stroke="rgba(40,12,8,0.4)" strokeWidth="1"
        />
        <line x1="5" y1="6" x2="11" y2="6" stroke="rgba(60,15,10,0.15)" strokeWidth="0.5" />
        <line x1="5" y1="10" x2="11" y2="10" stroke="rgba(60,15,10,0.15)" strokeWidth="0.5" />
        <line x1="5" y1="14" x2="11" y2="14" stroke="rgba(60,15,10,0.15)" strokeWidth="0.5" />
        <circle cx="8" cy="24" r="3.5" fill="#C43A3A" opacity="0.5" stroke="rgba(40,12,8,0.3)" strokeWidth="0.8" />
        <circle cx="9" cy="23.5" r="0.8" fill="#1a0a05" opacity="0.5" />
        <path d="M5 28 L8 30 L11 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
      </svg>
      {/* Text hint */}
      <span className="font-mono text-[10px] text-mycelium/25 uppercase tracking-[0.2em]">
        scroll to dig
      </span>
    </div>
  );
}
