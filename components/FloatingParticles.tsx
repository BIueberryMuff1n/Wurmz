const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: `${(i * 1.3) % 8}s`,
  duration: `${18 + (i % 5) * 3}s`,
  size: 2 + (i % 3),
  opacity: 0.08 + (i % 4) * 0.03,
  driftX: `${-15 + (i % 7) * 5}px`,
  color: i % 3 === 0 ? "#E63462" : "#3D2B1F",
}));

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0,
            animation: `float-up ${p.duration} ${p.delay} infinite`,
            ["--particle-opacity" as string]: p.opacity,
            ["--drift-x" as string]: p.driftX,
          }}
        />
      ))}
    </div>
  );
}
