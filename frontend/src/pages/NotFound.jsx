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
      setEyeXY({ x: (mx - 0.5) * 16, y: (my - 0.5) * 16 });
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
        @keyframes num-float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-15px); } }
        @keyframes ring-expand { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(2.5); opacity:0; } }
        @keyframes face-breathe { 0%,100% { transform:scale(1); filter: brightness(1); } 50% { transform:scale(1.03); filter: brightness(1.2); } }
        @keyframes scan-face { 0% { top:-20%; opacity:0; } 50% { opacity:1; } 100% { top:120%; opacity:0; } }
        @keyframes glitch1 { 0%,100% { clip-path:inset(0 0 95% 0); transform:translateX(-3px); } 33% { clip-path:inset(40% 0 40% 0); transform:translateX(3px); } 66% { clip-path:inset(80% 0 5% 0); transform:translateX(-2px); } }
        @keyframes glitch2 { 0%,100% { clip-path:inset(70% 0 10% 0); transform:translateX(3px); color:#f472b6; } 33% { clip-path:inset(10% 0 70% 0); transform:translateX(-3px); color:#22d3ee; } 66% { clip-path:inset(45% 0 35% 0); transform:translateX(2px); color:#f472b6; } }
        @keyframes shimmer { from { transform:translateX(-100%); } to { transform:translateX(100%); } }
        @keyframes mouth-talk { 0%, 100% { width: 40px; height: 4px; border-radius: 10px; } 50% { width: 35px; height: 8px; border-radius: 50%; } }

        .n404 { font-size:clamp(120px,22vw,180px); font-weight:900; color:#22d3ee; line-height:1; letter-spacing:-6px; animation:num-float 4s ease-in-out infinite; position:relative; cursor:default; user-select:none; display:inline-block; }
        .n404::before,.n404::after { content:"404"; position:absolute; top:0; left:0; width:100%; opacity:0; }
        .n404:hover::before { opacity:1; color:#22d3ee; animation:glitch1 0.35s steps(1) infinite; }
        .n404:hover::after { opacity:1; animation:glitch2 0.35s steps(1) infinite; }
        
        .bot-core { 
            position:relative; 
            width:160px; height:160px; 
            border-radius:50%; 
            background: radial-gradient(circle at 30% 30%, #16213e, #05070a);
            border: 4px solid #22d3ee; 
            box-shadow: 0 0 50px rgba(34,211,238,0.3), inset 0 0 20px rgba(34,211,238,0.2);
            display:flex; flex-direction:column; align-items:center; justifyContent:center;
            overflow:hidden; animation: face-breathe 4s ease-in-out infinite;
        }

        .scan-line {
            position:absolute; width:100%; height:4px; 
            background: linear-gradient(to bottom, transparent, #22d3ee, transparent);
            box-shadow: 0 0 15px #22d3ee;
            animation: scan-face 3s linear infinite;
            z-index: 5;
        }

        .eye-container {
            width: 45px; height: 45px; border-radius: 50%;
            background: #000; border: 3px solid rgba(34,211,238,0.4);
            display:flex; align-items:center; justify-content:center;
            transition: transform 0.06s ease;
        }

        .mouth-bold {
            width: 40px; height: 4px; background: #22d3ee;
            border-radius: 10px; box-shadow: 0 0 12px #22d3ee;
            animation: mouth-talk 2.5s ease-in-out infinite;
        }

        .btn-main { display:inline-flex; align-items:center; gap:10px; padding:16px 36px; border-radius:12px; background:#22d3ee; color:#000; font-family:'Inter',sans-serif; font-size:15px; font-weight:800; text-decoration:none; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 20px rgba(34,211,238,0.2); }
        .btn-main:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 20px 40px rgba(34,211,238,0.4); background:#fff; }
        
        .btn-ghost { display:inline-flex; align-items:center; gap:10px; padding:16px 36px; border-radius:12px; background:rgba(255,255,255,0.03); color:#fff; font-weight:600; text-decoration:none; border: 2px solid rgba(255,255,255,0.1); transition: all 0.3s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: #22d3ee; color: #22d3ee; }
      `}</style>

      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />

      <div style={{ position:"relative", zIndex:10, textAlign:"center", maxWidth:640, padding:"0 24px" }}>

        {/* Enhanced Round Bot */}
        <div className="fade1" style={{ display:"flex", justifyContent:"center", marginBottom:56 }}>
          <div style={{ position:"relative", width:200, height:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {/* Outer Pulse Rings */}
            <div className="ring-1" style={{ position:"absolute", width:"100%", height:"100%", border:"2px solid #22d3ee", borderRadius:"50%" }} />
            
            <div className="bot-core">
              <div className="scan-line" />
              
              {/* Eyes Container */}
              <div style={{ display:"flex", gap:20, marginTop:40, marginBottom:20 }}>
                {[0,1].map(i => (
                  <div key={i} className="eye-container" style={{ transform:`scaleY(${blinkScale})` }}>
                    <div style={{ 
                        width:15, height:15, borderRadius:"50%", background:"#fff", 
                        boxShadow:"0 0 15px #fff, 0 0 30px #22d3ee", 
                        transform:`translate(${eyeXY.x}px,${eyeXY.y}px)`,
                        transition:"transform 100ms ease-out" 
                    }} />
                  </div>
                ))}
              </div>

              {/* Bold Mouth */}
              <div className="mouth-bold" />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="fade2" style={{ marginBottom:20 }}>
          <span className="n404">404</span>
        </div>

        <h2 className="fade3" style={{ fontSize:"clamp(24px,4vw,32px)", fontWeight:800, color:"#fff", margin:"0 0 16px", letterSpacing:"-0.03em" }}>
          SIGNAL LOST IN SPACE
        </h2>

        <p className="fade3" style={{ fontSize:17, color:"#94a3b8", lineHeight:1.6, maxWidth:460, margin:"0 auto 48px", fontWeight:400 }}>
          RenewMate AI couldn't find that frequency. <br/>
          <strong>Stay calm</strong> — we’re recalculating your position.
        </p>

        <div className="fade4" style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <Link to="/" className="btn-main"><Home size={20} strokeWidth={3} /> REBOOT SYSTEM</Link>
          <Link to={isLoggedIn ? "/chat" : "/login"} className="btn-ghost">
            <MessageSquareWarning size={20} />
            {isLoggedIn ? "ASK ASSISTANT" : "LOG IN"}
          </Link>
        </div>
      </div>
    </div>
  );
}