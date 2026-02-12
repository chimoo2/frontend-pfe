import React, { useRef, useEffect, useState } from "react";

const initialNodes = [
  { id: "AI", label: "AI", type: "skill" },
  { id: "Data", label: "Data", type: "skill" },
  { id: "Frontend", label: "Frontend", type: "skill" },
  { id: "Data Scientist", label: "Data Scientist", type: "job" },
  { id: "Frontend Engineer", label: "Frontend Engineer", type: "job" },
  { id: "ML Bootcamp", label: "ML Bootcamp", type: "course" },
  { id: "React 101", label: "React 101", type: "course" },
];

const initialLinks = [
  { source: "AI", target: "Data Scientist" },
  { source: "Data", target: "Data Scientist" },
  { source: "Frontend", target: "Frontend Engineer" },
  { source: "AI", target: "ML Bootcamp" },
  { source: "Frontend", target: "React 101" },
];

export default function SkillGraph({ width = 420, height = 220 }) {
  const svgRef = useRef(null);
  const rafRef = useRef(null);
  const nodesRef = useRef(
    initialNodes.map((n, i) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 80,
      y: height / 2 + (Math.random() - 0.5) * 60,
      vx: 0,
      vy: 0,
    }))
  );
  const linksRef = useRef(initialLinks.map((l) => ({ ...l })));
  const [, setTick] = useState(0);
  const [hover, setHover] = useState(null);
  const draggingRef = useRef(null);
  const frameCount = useRef(0);

  useEffect(() => {
    function step() {
      const nodes = nodesRef.current;
      const links = linksRef.current;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          let dist2 = dx * dx + dy * dy;
          if (dist2 < 0.01) dist2 = 0.01;
          const dist = Math.sqrt(dist2);
          const repulse = 2000 / dist2;
          const ux = (dx / dist) * repulse;
          const uy = (dy / dist) * repulse;
          if (!a.fx) { a.vx += ux; a.vy += uy; }
          if (!b.fx) { b.vx -= ux; b.vy -= uy; }
        }
      }

      for (let k = 0; k < links.length; k++) {
        const l = links[k];
        const s = nodes.find((n) => n.id === (l.source.id || l.source));
        const t = nodes.find((n) => n.id === (l.target.id || l.target));
        if (!s || !t) continue;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const desired = 80;
        const kspring = 0.02;
        const fx = (dist - desired) * (dx / dist) * kspring;
        const fy = (dist - desired) * (dy / dist) * kspring;
        if (!s.fx) { s.vx += fx; s.vy += fy; }
        if (!t.fx) { t.vx -= fx; t.vy -= fy; }
      }

      for (let n of nodes) {
        if (!n.fx) {
          n.vx += (width / 2 - n.x) * 0.0008;
          n.vy += (height / 2 - n.y) * 0.0008;
        } else {
          n.x = n.fx;
          n.y = n.fy;
          n.vx = 0;
          n.vy = 0;
        }

        n.vx *= 0.88;
        n.vy *= 0.88;

        if (!n.fx) {
          n.x += n.vx;
          n.y += n.vy;
        }

        const pad = 18;
        n.x = Math.max(pad, Math.min(width - pad, n.x));
        n.y = Math.max(pad, Math.min(height - pad, n.y));
      }

      frameCount.current++;
      if (frameCount.current % 3 === 0) setTick((t) => t + 1);

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [width, height]);

  function pointerToLocal(e) {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e, node) {
    const p = pointerToLocal(e);
    node.fx = p.x;
    node.fy = p.y;
    draggingRef.current = node;
    setHover(node);
  }

  function onPointerMove(e, node) {
    if (draggingRef.current && draggingRef.current.id === node.id) {
      const p = pointerToLocal(e);
      node.fx = p.x;
      node.fy = p.y;
    }
  }

  function onPointerUp(e) {
    if (draggingRef.current) {
      draggingRef.current.fx = null;
      draggingRef.current.fy = null;
      draggingRef.current = null;
      setHover(null);
    }
  }

  function colorFor(type) {
    if (type === "skill") return "#7c3aed";
    if (type === "job") return "#06b6d4";
    if (type === "course") return "#10b981";
    return "#64748b";
  }

  const nodes = nodesRef.current;
  const links = linksRef.current;

  return (
    <div className="skill-graph" style={{ width: "100%", height: "100%", position: "relative" }}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" onPointerUp={onPointerUp}>
        <g className="links" stroke="#c7d2fe" strokeOpacity={0.9} strokeWidth={1.6}>
          {links.map((l, i) => {
            const src = nodes.find((n) => n.id === (l.source.id || l.source));
            const tgt = nodes.find((n) => n.id === (l.target.id || l.target));
            if (!src || !tgt) return null;
            return <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} />;
          })}
        </g>

        <g className="nodes">
          {nodes.map((n) => (
            <g
              key={n.id}
              className={`node ${n.type}`}
              transform={`translate(${n.x}, ${n.y})`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onPointerDown={(e) => onPointerDown(e, n)}
              onPointerMove={(e) => onPointerMove(e, n)}
              style={{ cursor: "grab" }}
            >
              <circle r={n.type === "job" ? 16 : 12} fill={colorFor(n.type)} opacity={0.96} />
              <text x={0} y={n.type === "job" ? 30 : 22} fontSize={11} fontFamily="Inter, Roboto, sans-serif" fill="#0f172a" textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {hover && (
        <div className="graph-tooltip" role="status">
          <strong>{hover.label}</strong>
          <div style={{ fontSize: 12, color: "#475569" }}>{hover.type === "skill" ? "Skill" : hover.type === "job" ? "Role" : "Course"}</div>
        </div>
      )}
    </div>
  );
}
