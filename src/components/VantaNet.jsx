import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function VantaNet({ color = 0x3b82f6, backgroundColor = 0xf8fbff, showOnMobile = false }) {
  const ref = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!showOnMobile && typeof window !== "undefined" && window.innerWidth < 640) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const mod = await import('vanta/dist/vanta.net.min');
        const NET = mod && (mod.default || mod.NET || mod);
        if (cancelled) return;
        if (NET && ref.current) {
          effectRef.current = NET({
            el: ref.current,
            THREE,
            color,
            backgroundColor,
            maxDistance: 22,
            spacing: 18,
            showDots: true,
            points: 12,
          });
        }
      } catch (err) {
        console.error("VantaNet: failed to import/init", err);
        if (ref.current) ref.current.style.background = "linear-gradient(180deg,#eef2ff 0%, #f8fbff 100%)";
      }
    })();

    return () => {
      cancelled = true;
      if (effectRef.current) {
        try { effectRef.current.destroy(); } catch (e) { /* ignore */ }
      }
    };
  }, [color, backgroundColor, showOnMobile]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
