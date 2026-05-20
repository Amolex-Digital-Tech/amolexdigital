"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Sales person / Front desk personality
const responses = {
  greeting: `Hi there! 😊 Welcome to Amolex Digital Technologies!\n\nI'm Sarah, the one who answers when you reach out. How can I help you today?`,
  
  services: `Great choice! We help businesses with:\n\n→ Websites & Web Apps\n→ Mobile Apps  \n→ Digital Marketing (SEO, Social Media, Ads)\n→ AI & Automation Solutions\n→ Branding & Design\n\nWhat caught your eye? I'd love to hear what you're working on!`,

  interested: (topic: string) => `Oh that's exciting! ${topic} is something we do really well here.\n\nTell me more about what you're looking for - what's the goal? That way I can see if we're a good fit and connect you with the right person.`,

  pricing: `I totally get it - you need to know the investment! 📊\n\nPricing depends on what you need, but we have options for different budgets. The best way to give you accurate numbers is to chat about your project.\n\nCan you tell me a bit about what you're looking for? I can then set you up with a free consultation!`,

  contact: `Of course! Here's how to reach us:\n\n📧 amolexdigitaltech@outlook.com\n📱 +251-974-238-620 / +251-907-192-311\n📍 ORDA Building, 15th Floor, Legehar, Addis Ababa\n\nBut honestly, I'm right here! Feel free to tell me what you need - I can help you right now or connect you with our team. 💬`,

  default: (userMessage: string) => `I appreciate you reaching out! 🙌\n\nI'm here to help make things easy for you. Whether you have questions about our services, want to start a project, or just exploring - I'm your person!\n\nSo tell me - what brings you to Amolex today?`,

  closing: `Perfect! I'd love to learn more. What's the project you're thinking about? The more I know, the better I can help you!`,
  
  thanks: `You're so welcome! 😊 That's what I'm here for!\n\nAnything else you'd like to know? I'm happy to help with anything!`,

  goodbye: `Aww, okay! It was nice chatting with you! 👋\n\nRemember - we're here whenever you need us. Don't hesitate to reach out. Have a great one!`,
};

// Sales-focused response logic
function getResponse(message: string): string {
  const lower = message.toLowerCase();
  
  // Greetings
  if (lower.match(/^(hi|hey|hello|hey there|good morning|good afternoon|good evening|hola|hi there|yo|sup)/)) {
    return responses.greeting;
  }
  
  // Services
  if (lower.includes("service") || lower.includes("offer") || lower.includes("do you") || lower.includes("what do you")) {
    return responses.services;
  }
  
  // Specific interests
  const interestKeywords: Record<string, string> = {
    "web": "Web development",
    "website": "Web development",
    "site": "Web development", 
    "development": "Web development",
    "app": "Mobile apps",
    "mobile": "Mobile apps",
    "ios": "Mobile apps",
    "android": "Mobile apps",
    "marketing": "Digital marketing",
    "seo": "Digital marketing",
    "social media": "Digital marketing",
    "ads": "Digital marketing",
    "advertising": "Digital marketing",
    "ai": "AI solutions",
    "automation": "AI solutions",
    "chatbot": "AI solutions",
    "brand": "Branding",
    "logo": "Branding",
    "design": "Design",
  };
  
  for (const [keyword, topic] of Object.entries(interestKeywords)) {
    if (lower.includes(keyword)) {
      return responses.interested(topic);
    }
  }
  
  // Pricing
  if (lower.includes("price") || lower.includes("cost") || lower.includes("budget") || lower.includes("how much") || lower.includes("expensive") || lower.includes("quote") || lower.includes("estimate")) {
    return responses.pricing;
  }
  
  // Contact
  if (lower.includes("contact") || lower.includes("reach") || lower.includes("call") || lower.includes("phone") || lower.includes("email") || lower.includes("address") || lower.includes("location") || lower.includes("where")) {
    return responses.contact;
  }
  
  // Portfolio
  if (lower.includes("portfolio") || lower.includes("work") || lower.includes("project") || lower.includes("done") || lower.includes("case study") || lower.includes("example")) {
    return `Ooh I love that you're checking out our work! We have some really cool projects in our portfolio.\n\nBut you know what - the best way to see if we're a fit is to chat about YOUR project. Tell me what you're working on!`;
  }
  
  // Timeline
  if (lower.includes("time") || lower.includes("how long") || lower.includes("duration") || lower.includes("when") || lower.includes("fast") || lower.includes("quick")) {
    return `Great question! Timelines depend on what we're building. But here's the thing - we'd rather do it right than fast.\n\nLet's talk about your project first, and we'll give you a realistic timeline. Sound good?`;
  }
  
  // Process
  if (lower.includes("process") || lower.includes("how do you") || lower.includes("steps") || lower.includes("work")) {
    return `I love that you asked! Here's how we roll:\n\n1. We chat about your project\n2. We put together a proposal\n3. We design & build\n4. You launch & shine!\n\nSimple, right? Want to start?`;
  }
  
  // Questions
  if (lower.includes("?") || lower.includes("can you") || lower.includes("do you think") || lower.includes("should i")) {
    return responses.closing;
  }
  
  // Thanks
  if (lower.includes("thank") || lower.includes("thanks") || lower.includes("appreciate") || lower.includes("helpful")) {
    return responses.thanks;
  }
  
  // Goodbye
  if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("see you") || lower.includes("talk later") || lower.includes("later")) {
    return responses.goodbye;
  }
  
  // Default
  return responses.default(message);
}

export function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Brand color
  const brandColor = "#103D2E";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: responses.greeting,
        timestamp: new Date()
      }]);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Label - Shows when chat is closed */}
      {!isOpen && (
        <div 
          className="fixed bottom-20 right-6 z-40 flex flex-col items-center gap-1"
        >
          <span 
            className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap shadow-md"
            style={{ backgroundColor: 'white', color: brandColor }}
          >
            Talk to our sales team
          </span>
        </div>
      )}

      {/* Chat Button - Brand Color */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: brandColor, marginTop: '8px' }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Chat Window - Brand Colors */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-84 max-w-[calc(100vw-3rem)] h-[80vh] max-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
          {/* Header - Brand Color */}
          <div 
            className="px-5 py-4 text-white"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 relative">
                <Image
                  src="/sarah-avatar.png"
                  alt="Sarah"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sarah</h3>
                <p className="text-xs text-white/80">Sales & Support • Online</p>
              </div>
            </div>
          </div>

          {/* Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 scrollbar-thin scrollbar-thumb-[#103D2E] scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-100 dark:border-slate-700"
                  }`}
                  style={message.role === "user" ? { backgroundColor: brandColor } : undefined}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-md border border-slate-100 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: brandColor, animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: brandColor, animationDelay: "100ms" }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: brandColor, animationDelay: "200ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Brand Color */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Say hi! 👋"
                className="h-11 text-sm bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-2"
                style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="h-11 w-11"
                style={{ backgroundColor: brandColor }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
