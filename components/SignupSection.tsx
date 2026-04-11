"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const SUCCESS_MESSAGES = [
  "Welcome underground",
  "You've been wormed",
  "See you on 4/20",
  "You're in \u{1FAB1}",
];

export default function SignupSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const successMessage = useMemo(
    () => SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)],
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center text-center max-w-xl mx-auto"
      >
        <div className="relative bg-deep-earth/92 backdrop-blur-sm p-6 md:p-10" style={{ border: "3px solid rgba(80,65,50,0.6)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)" }}>
        {/* Corner bolts */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        {/* Brick pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.035, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(80,55,35,0.8) 24px, rgba(80,55,35,0.8) 25px), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(80,55,35,0.5) 48px, rgba(80,55,35,0.5) 49px)" }} />
        {/* Graffiti scratch */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
          <text x="85%" y="92%" fontSize="5" fill="#E63462" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-5 85 92)">🪱</text>
        </svg>
        <h2 className="font-display text-3xl md:text-5xl text-mycelium mb-4">
          Stay Underground
        </h2>
        <p className="font-mono text-base md:text-lg text-mycelium/60 mb-8">
          Get drop alerts and growing knowledge. No spam, just soil.
        </p>

        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-2xl text-crimson-neon"
          >
            {successMessage}
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-3 flex-col min-[400px]:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-root-brown bg-deep-earth px-4 py-3 font-mono text-mycelium placeholder:text-mycelium/30 outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(230,52,98,0.5)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-crimson-neon px-6 py-3 font-mono font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(230,52,98,0.5)] disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </form>
        )}

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 font-mono text-sm text-crimson-neon"
          >
            {errorMsg}
          </motion.p>
        )}
        </div>
      </motion.div>
    </section>
  );
}
