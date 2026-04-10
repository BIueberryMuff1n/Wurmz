"use client";

import PlaneIntro from "./PlaneIntro";
import { useJump } from "./JumpController";

export default function PlaneIntroWrapper() {
  const { hasJumped, jump } = useJump();

  return <PlaneIntro onJump={jump} hasJumped={hasJumped} />;
}
