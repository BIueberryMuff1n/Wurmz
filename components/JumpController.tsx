"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface JumpState {
  hasJumped: boolean;
  jump: () => void;
}

const JumpContext = createContext<JumpState>({
  hasJumped: false,
  jump: () => {},
});

export function useJump() {
  return useContext(JumpContext);
}

export function JumpProvider({ children }: { children: ReactNode }) {
  const [hasJumped, setHasJumped] = useState(false);

  function jump() {
    setHasJumped(true);
  }

  return (
    <JumpContext.Provider value={{ hasJumped, jump }}>
      {children}
    </JumpContext.Provider>
  );
}
