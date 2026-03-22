import { useState, useEffect, useRef } from "react";

const BOT_ICON_URL =
  "https://cdn-icons-png.flaticon.com/512/8943/8943377.png";

export default function Chatbot() {

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [{ role: "bot", text: "How can I help you manage your subscriptions today?" }];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef(null);

  // Save chat history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chat, isLoading]);

  // Text to Speech
  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Voice Recognition
  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {

      const transcript = event.results[0][0].transcript;

      setMessage(transcript);

      setTimeout(() => {
        sendMessage(transcript);
      }, 400);
    };

    recognition.start();
  };

  // Send Message
  const sendMessage = async (voiceMessage) => {

    const text = voiceMessage || message;

    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", text };

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
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.open(data.redirectUrl, "_blank");
      }

      let botReply = data.message || "Done.";

      if (data.subscriptions?.length > 0) {
        const list = data.subscriptions
          .map((s) => `• ${s.serviceName}: ₹${s.price}`)
          .join("\n");

        botReply += `\n\n${list}`;
      }

      setChat((prev) => [...prev, { role: "bot", text: botReply }]);

      speakResponse(botReply);

    } catch (err) {

      const errorMsg = "Connection error. Please try again.";

      setChat((prev) => [...prev, { role: "bot", text: errorMsg }]);

      speakResponse(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#050508] text-slate-300 font-sans overflow-hidden">

      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.03] bg-black/20 backdrop-blur-md">
        <img
          src={BOT_ICON_URL}
          className="w-10 h-10 rounded-full border border-white/10 p-1"
          alt="AI"
        />

        <h2 className="text-white text-lg font-bold">
          RenewMate <span className="text-cyan-400">AI</span>
        </h2>
      </header>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-10 lg:px-32 py-8 space-y-6 custom-scrollbar"
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-5 py-3.5 rounded-2xl text-sm border shadow-xl ${msg.role === "user"
                  ? "bg-white/[0.05] border-white/10 text-white rounded-br-none"
                  : "bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-cyan-500/20 text-slate-200 rounded-tl-none"
                } max-w-[80%]`}
            >
              <div className="whitespace-pre-wrap font-medium">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-xs text-cyan-400 animate-pulse">
            RenewMate AI is thinking...
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="px-6 pb-2 flex flex-wrap gap-2 justify-center text-xs">
        <button
          onClick={() => sendMessage("Show my subscriptions")}
          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          My Subscriptions
        </button>

        <button
          onClick={() => sendMessage("What renews this week")}
          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Renewals
        </button>

        <button
          onClick={() => sendMessage("Show my monthly spending")}
          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Spending
        </button>
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 pb-8 pt-4">
        <div className="max-w-4xl mx-auto">

          <div className="relative flex items-center bg-[#0d0d12] border border-white/10 rounded-2xl p-2">

            <button
              onClick={startListening}
              className={`p-3 rounded-xl ${isListening
                  ? "text-red-500 bg-red-500/10"
                  : "text-slate-500 hover:text-white"
                }`}
            >
              🎤
            </button>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 px-4 text-xl"
              placeholder="Type your command..."
            />

            <button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isLoading}
              className="px-6 py-2 bg-white text-black font-bold text-xs uppercase rounded-xl hover:bg-cyan-400 disabled:opacity-20"
            >
              Send
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}