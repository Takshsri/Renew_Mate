import { Link } from "react-router-dom";
import { Home, MessageSquareWarning, RefreshCw, Wifi } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.4 + 0.1,
  opacity: Math.random() * 0.5 + 0.1,
  drift: (Math.random() - 0.5) * 0.3,
}));

const HEX_CHARS = "01ABCDEF";
function randomHex(len = 6) {
  return Array.from({ length: len }, () =>
    HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
  ).join("");
}

export default function NotFound() {
  const [eyeStyle, setEyeStyle] = useState({ transform: "translate(0px, 0px)" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState(PARTICLES);
  const [hexLines, setHexLines] = useState(() =>
    Array.from({ length: 6 }, () => randomHex(24))
  );
  const [blinkIndex, setBlinkIndex] = useState(-1);
  const [statusMsg, setStatusMsg] = useState("SCANNING...");
  const [signalStrength, setSignalStrength] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [isHovering404, setIsHovering404] = useState(false);
  const pageRef = useRef(null);
  const frameRef = useRef(null);
  const particleRef = useRef(PARTICLES);
  const timeRef = useRef(0);

  const isLoggedIn = !!localStorage.getItem("token");

  const STATUS_MSGS = [
    "SCANNING...", "PATH NOT FOUND", "RE-ROUTING...",
    "SIGNAL LOST", "SEARCHING...", "ERR_404"
  ];

  // Mouse tracking
  useEffect(() => {
    const handler = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / (rect.width / 2)) * 12;
      const y = ((e.clientY - cy) / (rect.height / 2)) * 12;
      setEyeStyle({ transform: `translate(${x}px, ${y}px)` });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Particle animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016;
      particleRef.current = particleRef.current.map((p) => {
        let y = p.y - p.speed * 0.08;
        let x = p.x + Math.sin(timeRef.current * p.speed + p.id) * p.drift * 0.02;
        if (y < -2) { y = 102; x = Math.random() * 100; }
        if (x < 0) x = 100;
        if (x > 100) x = 0;
        return { ...p, x, y };
      });
      setParticles([...particleRef.current]);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Hex scramble effect
  useEffect(() => {
    const id = setInterval(() => {
      const lineIdx = Math.floor(Math.random() * 6);
      setBlinkIndex(lineIdx);
      setHexLines((prev) => {
        const next = [...prev];
        next[lineIdx] = randomHex(24);
        return next;
      });
      setTimeout(() => setBlinkIndex(-1), 150);
    }, 280);
    return () => clearInterval(id);
  }, []);

  // Status cycling
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % STATUS_MSGS.length;
      setStatusMsg(STATUS_MSGS[i]);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Signal strength animation
  useEffect(() => {
    let val = 0;
    let dir = 1;
    const id = setInterval(() => {
      val += dir * (Math.random() * 12 + 4);
      if (val >= 100) { val = 100; dir = -1; }
      if (val <= 0) { val = 0; dir = 1; }
      setSignalStrength(Math.round(val));
    }, 200);
    return () => clearInterval(id);
  }, []);

  // Glitch on hover
  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 500);
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen flex items-center justify-center px-6 overflow-hidden relative"
      style={{
        background: "#03040a",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes scan-line {
          0% { top: -4px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes mouth-pulse {
          0%, 100% { width: 100%; }
          40% { width: 30%; }
          60% { width: 80%; }
          80% { width: 10%; }
        }
        @keyframes blink-eye {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.05); }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes glitch-shift {
          0%   { clip-path: inset(0 0 85% 0); transform: translate(-4px, 0); }
          20%  { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); }
          40%  { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 0); }
          60%  { clip-path: inset(70% 0 5%  0); transform: translate(3px, 0); }
          80%  { clip-path: inset(40% 0 40% 0); transform: translate(-3px, 0); }
          100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
        }
        @keyframes glitch-shift2 {
          0%   { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); color: #f0f; }
          25%  { clip-path: inset(10% 0 70% 0); transform: translate(-3px, 0); color: #0ff; }
          50%  { clip-path: inset(40% 0 30% 0); transform: translate(5px, 0); color: #f0f; }
          75%  { clip-path: inset(80% 0 5%  0); transform: translate(-2px, 0); color: #0ff; }
          100% { clip-path: inset(60% 0 10% 0); transform: translate(0, 0); color: #f0f; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-bar {
          0%   { width: 0%; }
          30%  { width: 45%; }
          60%  { width: 62%; }
          80%  { width: 78%; }
          100% { width: 87%; }
        }
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes status-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent);
          animation: scan-line 2.5s linear infinite;
          pointer-events: none;
        }
        .robot-eye { animation: blink-eye 4s ease-in-out infinite; transform-origin: center; }
        .progress-bar-fill { animation: progress-bar 4s ease-out forwards; }
        .cursor { animation: cursor-blink 1s step-end infinite; }
        .status-dot { animation: status-dot 1.2s ease-in-out infinite; }

        .glitch-base { position: relative; display: inline-block; }
        .glitch-base::before,
        .glitch-base::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          color: inherit; width: 100%;
        }
        .glitch-active::before {
          animation: glitch-shift 0.4s steps(1) infinite;
          color: #0ff;
        }
        .glitch-active::after {
          animation: glitch-shift2 0.4s steps(1) infinite;
          color: #f0f;
        }

        .ring-pulse {
          position: absolute; inset: -12px; border-radius: 50%;
          border: 1px solid rgba(34,211,238,0.3);
          animation: ring-pulse 2s ease-out infinite;
        }
        .ring-pulse-2 {
          animation-delay: 0.7s;
        }

        .fade-up { animation: fade-up 0.7s ease-out forwards; }
        .fade-up-1 { animation: fade-up 0.7s 0.1s ease-out both; }
        .fade-up-2 { animation: fade-up 0.7s 0.25s ease-out both; }
        .fade-up-3 { animation: fade-up 0.7s 0.4s ease-out both; }
        .fade-up-4 { animation: fade-up 0.7s 0.55s ease-out both; }
        .fade-up-5 { animation: fade-up 0.7s 0.7s ease-out both; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 4px;
          background: #22d3ee; color: #000;
          font-family: inherit; font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%); transition: transform 0.4s;
        }
        .btn-primary:hover { background: #67e8f9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,211,238,0.3); }
        .btn-primary:hover::before { transform: translateX(100%); }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 4px;
          background: transparent; color: #67e8f9;
          font-family: inherit; font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; border: 1px solid rgba(34,211,238,0.3); cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(34,211,238,0.06);
          border-color: rgba(34,211,238,0.6);
          transform: translateY(-2px);
        }
        .btn-secondary:active { transform: scale(0.97); }

        .hex-line { transition: color 0.1s; }
        .hex-line.active { color: #22d3ee; text-shadow: 0 0 8px #22d3ee; }
      `}</style>

      {/* Particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#22d3ee",
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Mouse radial glow */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,211,238,0.06), transparent 45%)`,
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.15,
          backgroundImage: `linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,4,10,0.85) 100%)",
      }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, width: "100%", textAlign: "center" }}>

        {/* Top status bar */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 48, fontSize: 11, color: "rgba(34,211,238,0.5)", letterSpacing: "0.12em" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="status-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
            SYSTEM ONLINE
          </span>
          <span style={{ color: "rgba(34,211,238,0.2)" }}>|</span>
          <span>NODE: 0x{randomHex(4)}</span>
          <span style={{ color: "rgba(34,211,238,0.2)" }}>|</span>
          <span style={{ color: "#f87171" }}>ERR: PATH_UNRESOLVABLE</span>
        </div>

        {/* Robot face */}
        <div className="fade-up-1" style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <div style={{ position: "relative" }}>
            <div className="ring-pulse" />
            <div className="ring-pulse ring-pulse-2" />
            <div style={{
              position: "relative", width: 160, height: 160, borderRadius: 20,
              background: "linear-gradient(145deg, #0a0e1a, #060810)",
              border: "1px solid rgba(34,211,238,0.25)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 20, overflow: "hidden",
              boxShadow: "0 0 40px rgba(34,211,238,0.08), inset 0 1px 0 rgba(34,211,238,0.1)",
            }}>
              <div className="scan-line" />

              {/* Status badge */}
              <div style={{
                position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
                display: "flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 3,
                background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                fontSize: 9, fontWeight: 700, color: "#22d3ee", letterSpacing: "0.15em",
                whiteSpace: "nowrap",
              }}>
                <span className="status-dot" style={{ display: "inline-block", width: 4, height: 4, borderRadius: "50%", background: "#22d3ee" }} />
                {statusMsg}
              </div>

              {/* Eyes */}
              <div style={{ display: "flex", gap: 28, marginTop: 20 }}>
                {[0, 1].map((i) => (
                  <div key={i} className="robot-eye" style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: "#050810",
                    border: "1.5px solid rgba(34,211,238,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.8)",
                  }}>
                    <div style={{
                      ...eyeStyle,
                      width: 14, height: 14, borderRadius: "50%",
                      background: "#22d3ee",
                      boxShadow: "0 0 12px rgba(34,211,238,0.9), 0 0 4px rgba(34,211,238,0.6)",
                      transition: "transform 80ms ease-out",
                      flexShrink: 0,
                    }} />
                  </div>
                ))}
              </div>

              {/* Mouth / signal meter */}
              <div style={{ display: "flex", alignItems: "center", gap: 2, paddingBottom: 8 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{
                    width: 3, height: 4 + i * 1.5,
                    borderRadius: 1,
                    background: i < Math.ceil(signalStrength / 14)
                      ? `rgba(34,211,238,${0.5 + i * 0.06})`
                      : "rgba(34,211,238,0.1)",
                    transition: "background 0.15s",
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 404 display */}
        <div
          className="fade-up-2"
          style={{ position: "relative", marginBottom: 16, lineHeight: 1 }}
          onMouseEnter={() => { setIsHovering404(true); triggerGlitch(); }}
          onMouseLeave={() => setIsHovering404(false)}
        >
          {/* Behind glow */}
          <div style={{
            position: "absolute", inset: 0,
            fontSize: "clamp(100px, 20vw, 168px)", fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: "1px rgba(34,211,238,0.08)",
            filter: "blur(8px)",
            userSelect: "none",
          }}>404</div>

          <h1
            data-text="404"
            className={`glitch-base ${glitching ? "glitch-active" : ""}`}
            style={{
              fontSize: "clamp(100px, 20vw, 168px)", fontWeight: 900, margin: 0,
              color: "#22d3ee",
              WebkitTextStroke: "1px rgba(34,211,238,0.4)",
              letterSpacing: "-4px",
              textShadow: isHovering404
                ? "0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(34,211,238,0.2)"
                : "0 0 20px rgba(34,211,238,0.2)",
              cursor: "default",
              userSelect: "none",
            }}
          >
            404
          </h1>
        </div>

        {/* Title */}
        <h2 className="fade-up-3" style={{
          fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 700,
          color: "#e2e8f0", margin: "0 0 12px",
          letterSpacing: "0.04em",
        }}>
          DATA TRANSMISSION INTERRUPTED
        </h2>

        <p className="fade-up-3" style={{
          fontSize: 14, color: "rgba(148,163,184,0.8)", lineHeight: 1.8,
          maxWidth: 480, margin: "0 auto 40px",
          letterSpacing: "0.03em",
        }}>
          The requested route could not be resolved.
          RenewMate AI is scanning alternate pathways...
        </p>

        {/* Progress / terminal block */}
        <div className="fade-up-4" style={{
          background: "rgba(34,211,238,0.03)",
          border: "1px solid rgba(34,211,238,0.12)",
          borderRadius: 6, padding: "16px 20px",
          marginBottom: 36, textAlign: "left",
          fontSize: 11, lineHeight: 1.9,
          color: "rgba(34,211,238,0.4)",
          fontFamily: "inherit",
          letterSpacing: "0.08em",
          overflow: "hidden",
        }}>
          {hexLines.map((line, i) => (
            <div
              key={i}
              className={`hex-line${blinkIndex === i ? " active" : ""}`}
              style={{ display: "flex", gap: 12 }}
            >
              <span style={{ color: "rgba(34,211,238,0.2)", width: 20, flexShrink: 0 }}>{String(i).padStart(2, "0")}</span>
              <span style={{ letterSpacing: "0.12em" }}>{line}</span>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "rgba(34,211,238,0.35)", fontSize: 10 }}>SCAN</span>
            <div style={{ flex: 1, height: 2, background: "rgba(34,211,238,0.1)", borderRadius: 1, overflow: "hidden" }}>
              <div className="progress-bar-fill" style={{ height: "100%", background: "#22d3ee", borderRadius: 1, width: 0 }} />
            </div>
            <span style={{ color: "rgba(34,211,238,0.35)", fontSize: 10 }}>87%</span>
          </div>

          <div style={{ marginTop: 8, color: "rgba(34,211,238,0.5)", fontSize: 11 }}>
            &gt; error_code: 0x{randomHex(3)} — route unresolvable
            <span className="cursor" style={{ marginLeft: 2 }}>_</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="fade-up-5" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn-primary">
            <Home size={16} />
            Return Home
          </Link>
          <Link to={isLoggedIn ? "/chat" : "/login"} className="btn-secondary">
            <MessageSquareWarning size={16} />
            {isLoggedIn ? "Report to AI" : "Login to Continue"}
          </Link>
        </div>

        {/* Footer trace */}
        <div className="fade-up-5" style={{ marginTop: 52, fontSize: 10, color: "rgba(34,211,238,0.2)", letterSpacing: "0.15em" }}>
          RENEWMATE AI &nbsp;·&nbsp; SYSTEM v2.4.1 &nbsp;·&nbsp; NODE 0x{randomHex(4)} &nbsp;·&nbsp;
          <span style={{ color: "rgba(239,68,68,0.5)" }}>ERR_ROUTE_404</span>
        </div>
      </div>
    </div>
  );
}