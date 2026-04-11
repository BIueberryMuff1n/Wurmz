import type { SVGProps } from "react";

/** Shared props for all graffiti icons */
type IconProps = SVGProps<SVGSVGElement>;

const DARK = "#1a0a05";
const CRIMSON = "#E63462";
const VIOLET = "#8B5CF6";
const GREEN = "#2d6a1e";

/**
 * Stylized worm curving in soil — replaces 🪱 on "Living Soil" card.
 * Crimson body, thick dark outline, hand-drawn feel.
 */
export function WormIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Soil ground line — rough */}
      <path
        d="M2 34 C6 33, 10 35, 14 34 S22 32, 26 34 S34 35, 38 33"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.25}
      />
      {/* Worm body — S-curve */}
      <path
        d="M8 30 C6 26, 10 22, 14 20 C18 18, 16 12, 20 10 C24 8, 28 12, 30 16 C32 20, 34 18, 35 14"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 30 C6 26, 10 22, 14 20 C18 18, 16 12, 20 10 C24 8, 28 12, 30 16 C32 20, 34 18, 35 14"
        stroke={CRIMSON}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Segments */}
      <line x1={14} y1={19} x2={15} y2={21} stroke={DARK} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
      <line x1={19} y1={10} x2={20} y2={12} stroke={DARK} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
      <line x1={28} y1={13} x2={29} y2={15} stroke={DARK} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
      {/* Eye */}
      <circle cx={35} cy={13} r={2} fill={DARK} />
      <circle cx={35.8} cy={12.4} r={0.8} fill="white" opacity={0.6} />
      {/* Tail end */}
      <circle cx={8} cy={30} r={1.5} fill={CRIMSON} stroke={DARK} strokeWidth={1} />
    </svg>
  );
}

/**
 * Small house/facility with a roof — replaces 🏠 on "Single Source" card.
 * Dark outline, crimson accent on roof.
 */
export function HouseIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Roof — slightly imperfect triangle */}
      <path
        d="M5 20 L19.5 5 L35 20"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20 L19.5 5 L35 20"
        stroke={CRIMSON}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Walls — rough rectangle */}
      <path
        d="M9 20 L9 35 L31 35 L31 20"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <path
        d="M17 35 L17 25 L23 25 L23 35"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door knob */}
      <circle cx={21.5} cy={30} r={1} fill={CRIMSON} />
      {/* Window */}
      <rect x={25} y={24} width={4} height={4} rx={0.5} stroke={DARK} strokeWidth={1.5} />
      <line x1={27} y1={24} x2={27} y2={28} stroke={DARK} strokeWidth={1} />
      <line x1={25} y1={26} x2={29} y2={26} stroke={DARK} strokeWidth={1} />
      {/* Chimney */}
      <path
        d="M27 12 L27 5 L31 5 L31 15"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand trimming scissors — replaces ✂️ on "Small Batch" card.
 * Dark outline, violet accent on handles.
 */
export function ScissorsIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Top blade — slightly curved */}
      <path
        d="M18 18 L36 6"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Bottom blade */}
      <path
        d="M18 22 L36 34"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Pivot point */}
      <circle cx={18} cy={20} r={2.5} fill={DARK} />
      <circle cx={18} cy={20} r={1.5} fill={VIOLET} />
      {/* Top handle — oval loop */}
      <ellipse
        cx={10}
        cy={14}
        rx={6}
        ry={5}
        stroke={DARK}
        strokeWidth={2.5}
        fill="none"
      />
      <ellipse
        cx={10}
        cy={14}
        rx={6}
        ry={5}
        stroke={VIOLET}
        strokeWidth={1.5}
        fill="none"
      />
      {/* Bottom handle — oval loop */}
      <ellipse
        cx={10}
        cy={26}
        rx={6}
        ry={5}
        stroke={DARK}
        strokeWidth={2.5}
        fill="none"
      />
      <ellipse
        cx={10}
        cy={26}
        rx={6}
        ry={5}
        stroke={VIOLET}
        strokeWidth={1.5}
        fill="none"
      />
    </svg>
  );
}

/**
 * Small plant sprouting — for Process step "Grow".
 * Green with dark outline.
 */
export function SeedlingIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Stem — slightly wobbly */}
      <path
        d="M20 36 C20 30, 19 26, 20 20"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M20 36 C20 30, 19 26, 20 20"
        stroke={GREEN}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M20 24 C16 20, 8 20, 8 16 C12 16, 18 18, 20 22"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 24 C16 20, 8 20, 8 16 C12 16, 18 18, 20 22"
        stroke={GREEN}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.2}
      />
      {/* Right leaf */}
      <path
        d="M20 20 C24 16, 32 14, 33 10 C29 12, 22 14, 20 18"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20 C24 16, 32 14, 33 10 C29 12, 22 14, 20 18"
        stroke={GREEN}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.2}
      />
      {/* Soil line */}
      <path
        d="M12 36 C15 35, 18 36, 20 36 C22 36, 25 35, 28 36"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.3}
      />
    </svg>
  );
}

/**
 * Cannabis fan leaf — for Process step "Harvest".
 * Green with dark outline.
 */
export function LeafIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Stem */}
      <path
        d="M20 38 L20 24"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M20 38 L20 24"
        stroke={GREEN}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Center finger */}
      <path
        d="M20 24 C19 18, 18 10, 20 3 C22 10, 21 18, 20 24"
        stroke={DARK}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.25}
      />
      {/* Left inner finger */}
      <path
        d="M20 24 C16 20, 10 14, 8 8 C12 12, 17 18, 20 24"
        stroke={DARK}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.2}
      />
      {/* Right inner finger */}
      <path
        d="M20 24 C24 20, 30 14, 32 8 C28 12, 23 18, 20 24"
        stroke={DARK}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.2}
      />
      {/* Left outer finger */}
      <path
        d="M20 26 C14 24, 6 22, 3 18 C8 20, 16 24, 20 26"
        stroke={DARK}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.15}
      />
      {/* Right outer finger */}
      <path
        d="M20 26 C26 24, 34 22, 37 18 C32 20, 24 24, 20 26"
        stroke={DARK}
        strokeWidth={2}
        strokeLinejoin="round"
        fill={GREEN}
        fillOpacity={0.15}
      />
    </svg>
  );
}

/**
 * Water drop with ice crystals — for Process step "Wash".
 * Blue-ish with dark outline.
 */
export function WaterDropIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Drop shape — slightly imperfect */}
      <path
        d="M20 4 C20 4, 10 18, 10 25 C10 31, 14 36, 20 36 C26 36, 30 31, 30 25 C30 18, 20 4, 20 4Z"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinejoin="round"
        fill="#3B82F6"
        fillOpacity={0.15}
      />
      <path
        d="M20 4 C20 4, 10 18, 10 25 C10 31, 14 36, 20 36 C26 36, 30 31, 30 25 C30 18, 20 4, 20 4Z"
        stroke="#3B82F6"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Ice crystal — small asterisk inside */}
      <line x1={20} y1={18} x2={20} y2={30} stroke={DARK} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      <line x1={15} y1={21} x2={25} y2={27} stroke={DARK} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      <line x1={25} y1={21} x2={15} y2={27} stroke={DARK} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      {/* Small ice crystals — branch tips */}
      <line x1={18} y1={18} x2={17} y2={17} stroke={DARK} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <line x1={22} y1={18} x2={23} y2={17} stroke={DARK} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <line x1={26} y1={23} x2={27} y2={22} stroke={DARK} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      {/* Highlight */}
      <path
        d="M15 22 C15 20, 17 17, 18 16"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.4}
      />
    </svg>
  );
}

/**
 * Press/clamp shape — for Process step "Press".
 * Crimson with dark outline.
 */
export function PressIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={40}
      height={40}
      fill="none"
      {...props}
    >
      {/* Top plate */}
      <path
        d="M8 14 L32 14"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M8 14 L32 14"
        stroke={CRIMSON}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Bottom plate */}
      <path
        d="M8 28 L32 28"
        stroke={DARK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M8 28 L32 28"
        stroke={CRIMSON}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Screw / press rod */}
      <path
        d="M20 4 L20 14"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Handle bar on top */}
      <path
        d="M14 5 L26 5"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Left frame */}
      <path
        d="M10 14 L10 28"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Right frame */}
      <path
        d="M30 14 L30 28"
        stroke={DARK}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Pressure arrows / hash material */}
      <path
        d="M16 18 L16 24"
        stroke={CRIMSON}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d="M20 16 L20 26"
        stroke={CRIMSON}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d="M24 18 L24 24"
        stroke={CRIMSON}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Base */}
      <path
        d="M6 34 L34 34"
        stroke={DARK}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Legs */}
      <path d="M10 28 L8 34" stroke={DARK} strokeWidth={2} strokeLinecap="round" />
      <path d="M30 28 L32 34" stroke={DARK} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
