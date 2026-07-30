"use client";

import { useEffect, useState } from "react";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

export default function GlobalClickAnimator() {
  const [clicks, setClicks] = useState<ClickEffect[]>([]);

  useEffect(() => {
    let clickId = 0;

    const handleClick = (e: MouseEvent) => {
      // Don't animate if clicking on something that handles its own specific animation, 
      // though a global ripple is usually fine anywhere.
      
      const newClick = {
        id: clickId++,
        x: e.clientX,
        y: e.clientY,
      };

      setClicks((prev) => [...prev, newClick]);

      // Remove the click effect after animation completes (e.g., 600ms)
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
      }, 600);
    };

    // Use capturing phase to ensure we catch all clicks before propagation is stopped
    window.addEventListener("mousedown", handleClick, true);

    return () => {
      window.removeEventListener("mousedown", handleClick, true);
    };
  }, []);

  return (
    <>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="global-click-ripple"
          style={{
            left: click.x,
            top: click.y,
          }}
        />
      ))}
    </>
  );
}
