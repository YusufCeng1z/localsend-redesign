import { Children, type CSSProperties, type ReactNode } from "react";
import "./orbit.css";

// Adapted from Magic UI "Orbiting Circles" (https://magicui.design/docs/components/orbiting-circles).
// Changes: the keyframes live in orbit.css and stop under prefers-reduced-motion.
export function OrbitingCircles({ children, radius = 100, duration = 30, reverse, iconSize = 36 }: { children: ReactNode; radius?: number; duration?: number; reverse?: boolean; iconSize?: number }) {
  const count = Children.count(children);
  return (
    <>
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <circle className="stroke-foreground/10" cx="50%" cy="50%" r={radius} fill="none" />
      </svg>
      {Children.map(children, (child, i) => (
        <div
          style={{ "--duration": duration, "--radius": radius, "--angle": (360 / count) * i, width: iconSize, height: iconSize } as CSSProperties}
          className={`orbit-item absolute inset-0 m-auto flex items-center justify-center rounded-full ${reverse ? "[animation-direction:reverse]" : ""}`}
        >
          {child}
        </div>
      ))}
    </>
  );
}
