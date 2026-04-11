"use client";

import { type ReactNode } from "react";

interface SewerGrateProps {
  children: ReactNode;
  className?: string;
}

export default function SewerGrate({ children, className = "" }: SewerGrateProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer grate frame — thick dark metal border */}
      <div
        className="relative bg-deep-earth/92 backdrop-blur-sm p-6 md:p-10"
        style={{
          border: "3px solid rgba(80,65,50,0.6)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Corner bolts */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />

        {/* Subtle grate lines — horizontal slats */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)",
          }}
        />

        {/* Graffiti texture scratch */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }}>
          <line x1="15%" y1="8%" x2="35%" y2="12%" stroke="#E63462" strokeWidth="1" strokeLinecap="round" />
          <line x1="70%" y1="85%" x2="88%" y2="90%" stroke="#8B5CF6" strokeWidth="0.8" strokeLinecap="round" />
          <text x="80%" y="15%" fontSize="4" fill="#E63462" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">W</text>
        </svg>

        {/* Dirt/rust stain at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.06,
            background: "radial-gradient(ellipse at 0% 100%, rgba(100,70,30,0.5) 0%, transparent 40%), radial-gradient(ellipse at 100% 0%, rgba(80,50,20,0.3) 0%, transparent 35%)",
          }}
        />

        {children}
      </div>
    </div>
  );
}
