import { useState, useEffect, useRef } from "react";

const BOT_ICON_URL =
  "https://cdn-icons-png.flaticon.com/512/8943/8943377.png";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingField, setPendingField] = useState(null);
  const [inputType, setInputType] = useState("text");
  const [draft, setDraft] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [originalServiceName, setOriginalServiceName] = useState(null);
  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "bot",
            text: "How can I help you manage your subscriptions today?",
          },
        ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chat, isLoading]);

  const speakResponse = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

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

  const sendMessage = async (voiceMessage) => {
    const text = voiceMessage || message;

    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", text };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

   try {
const updatedDraft = pendingField
  ? {
      ...draft,
      [pendingField]: text,
    }
  : draft;

const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    message: text,
    pendingAction,
    pendingField,
    draft: updatedDraft,
    currentStep,
    originalServiceName,
  }),
});


const data = await res.json();

setDraft(data.draft || updatedDraft);

if (data.originalServiceName) {
  setOriginalServiceName(data.originalServiceName);
}

setPendingAction(data.pendingAction || null);
setPendingField(data.pendingField || null);
setInputType(data.inputType || "text");
setCurrentStep(data.currentStep || 0);
setCurrentQuestion(data.message || "");
      let botReply = data.message || "Done.";

      if (data.subscriptions?.length > 0) {
        const list = data.subscriptions
          .map(
            (s) =>
              `• ${s.serviceName}: ₹${s.price} | ${s.billingCycle} | Renews ${new Date(
                s.renewalDate
              ).toLocaleDateString()}`
          )
          .join("\n");

        botReply += `\n\n${list}`;
      }

      if (data.upcoming?.length > 0) {
        const renewals = data.upcoming
          .map(
            (s) =>
              `🔔 ${s.serviceName} renews on ${new Date(
                s.renewalDate
              ).toLocaleDateString()}`
          )
          .join("\n");

        botReply += `\n\n${renewals}`;
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

  const renderDynamicInput = () => {
  
    switch (inputType) {
      case "category":
  return (
    <div className="flex-1 flex gap-2 px-4 flex-wrap">
      {["Entertainment", "Music", "Productivity", "Cloud"].map((cat) => (
        <button
          key={cat}
          onClick={() => setMessage(cat)
           
          }
          className={`px-3 py-2 rounded-lg border ${
            message === cat
              ? "bg-cyan-500 text-black"
              : "bg-white/5 text-white border-white/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
      case "number":
        return (
          <input
            type="number"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 px-4 text-xl"
            placeholder="Enter amount"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 text-xl"
          />
        );

      case "billingCycle":
        return (
          <select
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent text-white px-4 text-xl"
          >
            <option value="">Select billing cycle</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        );

      case "paymentMethod":
        return (
          <div className="flex-1 flex gap-2 px-4 flex-wrap">
            {["Credit Card", "Debit Card", "UPI", "Net Banking"].map(
              (method) => (
                <button
                  key={method}
                  onClick={() => setMessage(method)
                    
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    message === method
                      ? "bg-cyan-500 text-black"
                      : "bg-white/5 text-white border-white/10"
                  }`}
                >
                  {method}
                </button>
              )
            )}
          </div>
        );

      case "file":
        return (
          <input
            type="file"
            onChange={(e) => setMessage(e.target.files?.[0]?.name || "")}
            className="flex-1 text-white px-4"
          />
        );

      case "textarea":
        return (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 text-lg"
            placeholder="Enter notes"
            rows={2}
          />
        );

      default:
        return (
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 px-4 text-xl"
            placeholder="Type your command..."
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#050508] text-slate-300 font-sans overflow-hidden">
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

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-10 lg:px-32 py-8 space-y-6 custom-scrollbar"
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3.5 rounded-2xl text-sm border shadow-xl ${
                msg.role === "user"
                  ? "bg-white/[0.05] border-white/10 text-white rounded-br-none"
                  : "bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-cyan-500/20 text-slate-200 rounded-tl-none"
              } max-w-[80%]`}
            >
              <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="text-xs text-cyan-400 animate-pulse">
            RenewMate AI is thinking...
          </div>
        )}
      </div>

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
          onClick={() => sendMessage("Cancel my Netflix")}
          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>

      <div className="px-4 sm:px-6 pb-8 pt-4">
        <div className="max-w-4xl mx-auto">
<div className="relative flex items-center bg-[#0d0d12] border border-white/10 rounded-2xl p-2 min-h-[70px]">
  <button
    onClick={startListening}
    className={`p-3 rounded-xl ${
      isListening
        ? "text-red-500 bg-red-500/10"
        : "text-slate-500 hover:text-white"
    }`}
  >
    🎤
  </button>

  {pendingAction && (
    <div className="absolute -top-8 left-2 text-sm text-cyan-400">
      {currentQuestion}
    </div>
  )}

  {renderDynamicInput()}

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
