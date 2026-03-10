import { useState, useEffect, useRef } from "react";

// Example bot icon, can be replaced with your desired image URL
const BOT_ICON_URL = "https://cdn-icons-png.flaticon.com/512/8943/8943377.png"; 

export default function Chatbot() {
  const [message, setMessage] = useState("");
 const [chat, setChat] = useState([
  { role: "bot", text: "Hi! I can help you manage subscriptions. Try: 'Add Spotify 119 monthly' or 'Show my subscriptions'." }
]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  // --- Voice Logic (Speech to Text) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      body: JSON.stringify({
        message: userMessage.text
      })
    });

    const data = await res.json();

    let botReply = data.message || "Request completed.";

    // If backend returned subscriptions, show them
    if (data.subscriptions && data.subscriptions.length > 0) {

      const list = data.subscriptions
        .map(sub => `${sub.serviceName} - ₹${sub.price}`)
        .join("\n");

      botReply = `${botReply}\n\n${list}`;
    }

    setChat((prev) => [
      ...prev,
      { role: "bot", text: botReply }
    ]);

  } catch (err) {

    setChat((prev) => [
      ...prev,
      { role: "bot", text: "Connection failed." }
    ]);

  } finally {

    setIsLoading(false);

  }

};
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] p-4 font-sans text-slate-200">
      <div className="w-full max-w-md h-[600px] flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            {/* The small chatbot image replacement */}
            <img src={BOT_ICON_URL} alt="Bot Icon" className="w-8 h-8 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"/>
            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] animate-pulse ml-2" />
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-50">Secure Channel</span>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {chat.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed border transition-all ${
                msg.role === "user" 
                  ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-50 rounded-tr-none shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                  : "bg-white/5 border-white/10 text-slate-300 rounded-tl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-1 p-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="flex gap-2 items-center bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-cyan-500/50 transition-all">
            
            {/* Microphone Button */}
            <button 
              onClick={startListening}
              className={`p-2.5 rounded-xl transition-all ${isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "hover:bg-white/5 text-slate-400"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-white placeholder:text-slate-500"
              placeholder={isListening ? "Listening..." : "Execute command..."}
            />

            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}