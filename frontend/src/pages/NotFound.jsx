import { Link } from "react-router-dom";
import { Home, MessageSquareWarning } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

const N_ORBS = 12;
const N_DOTS = 40;

function rand(min, max) { return Math.random() * (max - min) + min; }

const INIT_ORBS = Array.from({ length: N_ORBS }, (_, i) => ({
  id: i,
  x: rand(5, 95), y: rand(5, 95),
  r: rand(60, 200),
  vx: rand(-0.012, 0.012), vy: rand(-0.012, 0.012),
  phase: rand(0, Math.PI * 2),
  speed: rand(0.003, 0.008),
  hue: i % 3 === 0 ? 185 : i % 3 === 1 ? 200 : 220,
  alpha: rand(0.03, 0.09),
}));

const INIT_DOTS = Array.from({ length: N_DOTS }, (_, i) => ({
  id: i,
  x: rand(0, 100), y: rand(0, 100),
  size: rand(1, 2.5),
  vy: -rand(0.015, 0.05),
  vx: rand(-0.008, 0.008),
  alpha: rand(0.2, 0.7),
  pulse: rand(0, Math.PI * 2),
}));

export default function NotFound() {
  const canvasRef = useRef(null);
  const pageRef = useRef(null);
  const stateRef = useRef({
    orbs: INIT_ORBS.map(o => ({ ...o })),
    dots: INIT_DOTS.map(d => ({ ...d })),
    mouse: { x: 0.5, y: 0.5 },
    t: 0,
    blink: 0,
    nextBlink: rand(2, 5),
    ripples: [],
  });
  const frameRef = useRef(null);
  const [eyeXY, setEyeXY] = useState({ x: 0, y: 0 });
  const [blinkScale, setBlinkScale] = useState(1);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const onMove = (e) => {
      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      stateRef.current.mouse = { x: mx, y: my };
      setEyeXY({ x: (mx - 0.5) * 14, y: (my - 0.5) * 14 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const s = stateRef.current;
      s.t += 0.016;
      ctx.clearRect(0, 0, w, h);

      s.orbs.forEach(o => {
        o.x += o.vx + Math.sin(s.t * o.speed + o.phase) * 0.006;
        o.y += o.vy + Math.cos(s.t * o.speed + o.phase * 1.3) * 0.006;
        if (o.x < -5) o.x = 105; if (o.x > 105) o.x = -5;
        if (o.y < -5) o.y = 105; if (o.y > 105) o.y = -5;
        const gx = (o.x / 100) * w, gy = (o.y / 100) * h;
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, o.r);
        gr.addColorStop(0, `hsla(${o.hue},90%,65%,${o.alpha})`);
        gr.addColorStop(1, `hsla(${o.hue},90%,65%,0)`);
        ctx.beginPath(); ctx.arc(gx, gy, o.r, 0, Math.PI * 2);
        ctx.fillStyle = gr; ctx.fill();
      });

      s.ripples = s.ripples.filter(r => r.age < r.life);
      s.ripples.forEach(r => {
        r.age += 0.016;
        const prog = r.age / r.life;
        ctx.beginPath();
        ctx.arc((r.x / 100) * w, (r.y / 100) * h, prog * r.maxR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34,211,238,${(1 - prog) * 0.3})`;
        ctx.lineWidth = 1.5; ctx.stroke();
      });

      s.dots.forEach(d => {
        d.y += d.vy; d.x += d.vx; d.pulse += 0.04;
        if (d.y < -2) { d.y = 102; d.x = rand(0, 100); }
        const a = d.alpha * (0.6 + 0.4 * Math.sin(d.pulse));
        ctx.beginPath();
        ctx.arc((d.x / 100) * w, (d.y / 100) * h, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${a})`; ctx.fill();
      });

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const waveY = h * 0.82 + wave * 18;
        const amp = 10 + wave * 6;
        const freq = 0.006 - wave * 0.001;
        const spd = s.t * (0.4 + wave * 0.15);
        for (let x = 0; x <= w; x += 4) {
          const y = waveY + Math.sin(x * freq + spd) * amp + Math.sin(x * freq * 1.7 + spd * 0.6) * (amp * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(34,211,238,${0.07 - wave * 0.02})`;
        ctx.lineWidth = 1; ctx.stroke();
      }

      s.blink += 0.016;
      if (s.blink >= s.nextBlink) {
        s.blink = 0; s.nextBlink = rand(2, 6);
        setBlinkScale(0);
        setTimeout(() => setBlinkScale(1), 120);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const spawnRipple = useCallback(() => {
    stateRef.current.ripples.push({ x: rand(30, 70), y: rand(30, 70), maxR: rand(60, 120), age: 0, life: rand(1.2, 2) });
  }, []);

  useEffect(() => {
    const id = setInterval(spawnRipple, 1400);
    return () => clearInterval(id);
  }, [spawnRipple]);

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", background: "#030509", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap');
        @keyframes float-up { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes num-float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes orbit1 { from { transform:rotate(0deg) translateX(90px) rotate(0deg); } to { transform:rotate(360deg) translateX(90px) rotate(-360deg); } }
        @keyframes orbit2 { from { transform:rotate(120deg) translateX(70px) rotate(-120deg); } to { transform:rotate(480deg) translateX(70px) rotate(-480deg); } }
        @keyframes orbit3 { from { transform:rotate(240deg) translateX(110px) rotate(-240deg); } to { transform:rotate(600deg) translateX(110px) rotate(-600deg); } }
        @keyframes ring-expand { 0% { transform:scale(1); opacity:0.5; } 100% { transform:scale(2.2); opacity:0; } }
        @keyframes ring-expand2 { 0% { transform:scale(1); opacity:0.3; } 100% { transform:scale(1.8); opacity:0; } }
        @keyframes face-breathe { 0%,100% { transform:scale(1); } 50% { transform:scale(1.018); } }
        @keyframes glitch1 { 0%,100% { clip-path:inset(0 0 95% 0); transform:translateX(-3px); } 33% { clip-path:inset(40% 0 40% 0); transform:translateX(3px); } 66% { clip-path:inset(80% 0 5% 0); transform:translateX(-2px); } }
        @keyframes glitch2 { 0%,100% { clip-path:inset(70% 0 10% 0); transform:translateX(3px); color:#f472b6; } 33% { clip-path:inset(10% 0 70% 0); transform:translateX(-3px); color:#22d3ee; } 66% { clip-path:inset(45% 0 35% 0); transform:translateX(2px); color:#f472b6; } }
        @keyframes scan-face { 0% { top:0; opacity:0; } 5% { opacity:1; } 95% { opacity:0.7; } 100% { top:100%; opacity:0; } }
        @keyframes shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }
        .n404 { font-size:clamp(120px,22vw,180px); font-weight:900; color:#22d3ee; line-height:1; letter-spacing:-6px; animation:num-float 4s ease-in-out infinite; position:relative; cursor:default; user-select:none; display:inline-block; }
        .n404::before,.n404::after { content:"404"; position:absolute; top:0; left:0; width:100%; opacity:0; }
        .n404:hover::before { opacity:1; color:#22d3ee; animation:glitch1 0.35s steps(1) infinite; }
        .n404:hover::after { opacity:1; animation:glitch2 0.35s steps(1) infinite; }
        .n404:hover { text-shadow:0 0 40px rgba(34,211,238,0.6),0 0 80px rgba(34,211,238,0.2); }
        .face-wrap { animation:face-breathe 3.5s ease-in-out infinite; }
        .orb-dot { width:10px; height:10px; border-radius:50%; position:absolute; background:#22d3ee; box-shadow:0 0 8px rgba(34,211,238,0.9); }
        .orb-dot-1 { animation:orbit1 6s linear infinite; }
        .orb-dot-2 { animation:orbit2 9s linear infinite; }
        .orb-dot-3 { animation:orbit3 12s linear infinite; background:#818cf8; box-shadow:0 0 8px rgba(129,140,248,0.9); }
        .ring-1 { position:absolute; border-radius:50%; border:1px solid rgba(34,211,238,0.25); animation:ring-expand 3s ease-out infinite; }
        .ring-2 { position:absolute; border-radius:50%; border:1px solid rgba(34,211,238,0.15); animation:ring-expand2 3s 1.5s ease-out infinite; }
        .scan-bar { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(34,211,238,0.45),transparent); animation:scan-face 2.8s linear infinite; pointer-events:none; }
        .btn-main { display:inline-flex; align-items:center; gap:10px; padding:15px 32px; border-radius:6px; background:#22d3ee; color:#000; font-family:'Inter',sans-serif; font-size:14px; font-weight:700; letter-spacing:0.04em; text-decoration:none; cursor:pointer; border:none; position:relative; overflow:hidden; transition:transform 0.2s,box-shadow 0.2s,background 0.2s; }
        .btn-main::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); transform:translateX(-100%); }
        .btn-main:hover { background:#67e8f9; transform:translateY(-3px); box-shadow:0 12px 32px rgba(34,211,238,0.35); }
        .btn-main:hover::after { animation:shimmer 0.5s ease forwards; }
        .btn-main:active { transform:scale(0.97); }
        .btn-ghost { display:inline-flex; align-items:center; gap:10px; padding:15px 32px; border-radius:6px; background:transparent; color:#7dd3fc; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; letter-spacing:0.04em; text-decoration:none; cursor:pointer; border:1.5px solid rgba(34,211,238,0.3); transition:transform 0.2s,border-color 0.2s,background 0.2s,color 0.2s; }
        .btn-ghost:hover { background:rgba(34,211,238,0.07); border-color:rgba(34,211,238,0.7); color:#22d3ee; transform:translateY(-3px); }
        .btn-ghost:active { transform:scale(0.97); }
        .fade1 { animation:float-up 0.6s 0.0s ease-out both; }
        .fade2 { animation:float-up 0.6s 0.15s ease-out both; }
        .fade3 { animation:float-up 0.6s 0.3s ease-out both; }
        .fade4 { animation:float-up 0.6s 0.45s ease-out both; }
      `}</style>

      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />

      <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.07, backgroundImage:`linear-gradient(rgba(34,211,238,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.4) 1px,transparent 1px)`, backgroundSize:"52px 52px" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(3,5,9,0.9) 100%)" }} />

      <div style={{ position:"relative", zIndex:10, textAlign:"center", maxWidth:640, padding:"0 24px" }}>

        {/* Robot */}
        <div className="fade1" style={{ display:"flex", justifyContent:"center", marginBottom:48 }}>
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:180, height:180 }}>
            <div className="ring-1" style={{ width:180, height:180, left:0, top:0 }} />
            <div className="ring-2" style={{ width:180, height:180, left:0, top:0 }} />
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}>
              <div className="orb-dot orb-dot-1" />
              <div className="orb-dot orb-dot-2" />
              <div className="orb-dot orb-dot-3" />
            </div>
            <div className="face-wrap" style={{ position:"relative", width:130, height:130, borderRadius:22, background:"linear-gradient(160deg,#0c1020,#070b16)", border:"1.5px solid rgba(34,211,238,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, overflow:"hidden", boxShadow:"0 0 40px rgba(34,211,238,0.1),inset 0 1px 0 rgba(34,211,238,0.1)", zIndex:2 }}>
              <div className="scan-bar" />
              <div style={{ display:"flex", gap:22 }}>
                {[0,1].map(i => (
                  <div key={i} style={{ width:34, height:34, borderRadius:"50%", background:"#060912", border:"1.5px solid rgba(34,211,238,0.25)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", transform:`scaleY(${blinkScale})`, transition:"transform 0.06s ease" }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:"#22d3ee", boxShadow:"0 0 10px rgba(34,211,238,1)", flexShrink:0, transform:`translate(${eyeXY.x * 0.6}px,${eyeXY.y * 0.6}px)`, transition:"transform 80ms ease-out" }} />
                  </div>
                ))}
              </div>
              <svg width="48" height="14" viewBox="-24 -7 48 14" style={{ overflow:"visible" }}>
                <path d="M -20 0 Q -10 -6 0 0 Q 10 6 20 0" fill="none" stroke="rgba(34,211,238,0.7)" strokeWidth="2" strokeLinecap="round" style={{ animation:"mouth-wave 2s ease-in-out infinite" }} />
              </svg>
            </div>
          </div>
        </div>

        {/* 404 */}
        <div className="fade2" style={{ position:"relative", marginBottom:20 }}>
          <div style={{ position:"absolute", inset:"-20px -40px", background:"radial-gradient(ellipse at center,rgba(34,211,238,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
          <span className="n404">404</span>
        </div>

        <h2 className="fade3" style={{ fontSize:"clamp(18px,3.5vw,26px)", fontWeight:700, color:"#f1f5f9", margin:"0 0 14px", letterSpacing:"-0.02em" }}>
          Lost in the Digital Void
        </h2>

        <p className="fade3" style={{ fontSize:15, color:"rgba(148,163,184,0.85)", lineHeight:1.75, maxWidth:440, margin:"0 auto 44px" }}>
          This page doesn't exist — but RenewMate AI is already mapping a new route back for you.
        </p>

        <div className="fade4" style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <Link to="/" className="btn-main"><Home size={17} />Back to Home</Link>
          <Link to={isLoggedIn ? "/chat" : "/login"} className="btn-ghost">
            <MessageSquareWarning size={17} />
            {isLoggedIn ? "Ask the AI" : "Login to Continue"}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes mouth-wave {
          0%   { d: path("M -20 0 Q -10 -6 0 0 Q 10 6 20 0"); }
          25%  { d: path("M -20 0 Q -10 6 0 0 Q 10 -6 20 0"); }
          50%  { d: path("M -20 0 Q -5 -8 0 0 Q 5 8 20 0"); }
          75%  { d: path("M -20 0 Q -10 4 0 0 Q 10 -4 20 0"); }
          100% { d: path("M -20 0 Q -10 -6 0 0 Q 10 6 20 0"); }
        }
      `}</style>
    </div>
  );
}