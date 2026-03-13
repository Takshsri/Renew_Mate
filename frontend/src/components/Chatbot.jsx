import { useState, useEffect, useRef } from "react";

const BOT_ICON_URL = "https://cdn-icons-png.flaticon.com/512/8943/8943377.png"; 

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "bot", text: " How can I help you manage your subscriptions today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setMessage(e.results[0][0].transcript);
    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chat, isLoading]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    const userMessage = { role: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await res.json();
      let botReply = data.message || "Done.";
      if (data.subscriptions?.length > 0) {
        const list = data.subscriptions.map(s => `• ${s.serviceName}: ₹${s.price}`).join("\n");
        botReply += `\n\n${list}`;
      }
      setChat((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      setChat((prev) => [...prev, { role: "bot", text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#050508] text-slate-300 font-sans overflow-hidden">
      
      {/* 1. Clean Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/[0.03] bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-sm"></div>
            <img src={BOT_ICON_URL} className="relative w-10 h-10 rounded-full bg-black border border-white/10 p-1" alt="AI" />
          </div>
          <h2 className="text-white text-base sm:text-lg font-bold tracking-tight">
            RenewMate <span className="text-cyan-400">AI</span>
          </h2>
        </div>
      </header>

      {/* 2. Chat Area (No Labels) */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto px-4 sm:px-10 lg:px-32 py-8 space-y-6 custom-scrollbar"
      >
        {chat.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`px-5 py-3.5 rounded-2xl text-sm sm:text-base leading-relaxed border shadow-xl ${
              msg.role === "user" 
                ? "bg-white/[0.05] border-white/10 text-white rounded-br-none" 
                : "bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-cyan-500/20 text-slate-200 rounded-tl-none"
            } max-w-[90%] sm:max-w-[75%] lg:max-w-[60%]`}>
              <div className="whitespace-pre-wrap font-medium tracking-wide">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-1.5 items-center px-2">
            <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>

      {/* 3. Input Section */}
      <div className="px-4 sm:px-6 pb-8 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-[#0d0d12] border border-white/10 rounded-2xl p-2 focus-within:border-cyan-500/40 transition-all shadow-2xl">
            
            <button 
              onClick={startListening}
              className={`p-3 rounded-xl transition-all ${
                isListening ? "text-red-500 bg-red-500/10" : "text-slate-500 hover:text-white"
              }`}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 px-4 text-sm font-medium"
              placeholder="Type your command..."
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-5 active:scale-95"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}