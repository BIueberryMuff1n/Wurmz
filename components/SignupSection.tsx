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
      </motion.div>
    </section>
  );
}
