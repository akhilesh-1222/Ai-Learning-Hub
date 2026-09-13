"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  GraduationCap, Zap, FileText, Code, MessageSquare, 
  Send, Loader2, ArrowLeft, Bot, User, Copy, Check,
  RotateCcw, Sparkles, Plus, CornerDownLeft, RefreshCw, Lightbulb
} from "lucide-react";
import api from "@/lib/axios";
import ReactMarkdown from "react-markdown";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface Chat {
  _id: string;
  assistantType: string;
  title: string;
}

const PROMPT_SUGGESTIONS: Record<string, { title: string; prompt: string; icon: string }[]> = {
  Tutor: [
    { title: "Real-world Analogy", prompt: "Explain Dynamic Programming using a real-world analogy and simple examples.", icon: "💡" },
    { title: "Quiz My Knowledge", prompt: "Quiz me on Operating Systems Memory Management with 3 conceptual questions.", icon: "🧪" },
    { title: "Step-by-Step Breakdown", prompt: "Break down how DNS resolution works from browser URL to IP address.", icon: "🔍" },
    { title: "Concept Comparison", prompt: "What are the core differences between SQL and NoSQL databases?", icon: "⚡" },
  ],
  ExamCoach: [
    { title: "4-Week Revision Plan", prompt: "Create a 4-week structured revision timetable for my upcoming Data Structures exam.", icon: "📅" },
    { title: "High-Yield Topics", prompt: "What are the most frequent high-yield topics asked in computer science finals?", icon: "🎯" },
    { title: "Time Management", prompt: "How should I allocate my 3 hours during a technical theory exam?", icon: "⏱️" },
    { title: "Daily Study Checklist", prompt: "Give me a daily 2-hour study checklist for algorithms and DBMS.", icon: "📋" },
  ],
  NotesExplainer: [
    { title: "Summarize Core Points", prompt: "Summarize the key takeaways and formulas from my uploaded notes.", icon: "📑" },
    { title: "Generate Flashcards", prompt: "Generate 5 active-recall flashcards with questions and answers from my PDF.", icon: "🗂️" },
    { title: "Explain Hard Concept", prompt: "Explain the most complex section from my uploaded document in simple words.", icon: "📌" },
    { title: "Potential Exam Questions", prompt: "What are 3 likely exam questions that can be asked from these notes?", icon: "❓" },
  ],
  CodingTutor: [
    { title: "Complexity Analysis", prompt: "Can you analyze the time and space complexity of a recursive binary tree traversal?", icon: "⏱️" },
    { title: "Debug Logic Error", prompt: "Review this algorithm for off-by-one errors and integer overflow bugs.", icon: "🐛" },
    { title: "Compare Algorithms", prompt: "When should I choose Dijkstra's algorithm over Bellman-Ford or BFS?", icon: "🛠️" },
    { title: "Practice Challenge", prompt: "Give me an intermediate Graph problem with progressive hints.", icon: "💻" },
  ],
  InterviewTrainer: [
    { title: "Frontend Mock Interview", prompt: "Let's start a mock technical interview for a Frontend React & TypeScript role.", icon: "🎯" },
    { title: "System Design Question", prompt: "Ask me an introductory system design question, like designing a URL shortener.", icon: "💼" },
    { title: "Node.js Event Loop", prompt: "Test my in-depth knowledge of Node.js event loop and microtask queues.", icon: "🧠" },
    { title: "Answer Evaluation", prompt: "I'll answer your question, and please grade it with a score out of 10 and rubric feedback.", icon: "📊" },
  ]
};

const ASSISTANT_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  systemHint: string;
}> = {
  Tutor: {
    label: "AI Personal Tutor",
    icon: <GraduationCap className="w-4 h-4 text-indigo-600" />,
    color: "text-indigo-700 border-indigo-200 bg-indigo-50",
    placeholder: "Ask me to explain any concept, solve a doubt, or quiz you...",
    systemHint: "Patient academic tutor. Explains complex concepts with simple analogies and tests your understanding."
  },
  ExamCoach: {
    label: "AI Exam Coach",
    icon: <Zap className="w-4 h-4 text-amber-600" />,
    color: "text-amber-800 border-amber-200 bg-amber-50",
    placeholder: "Tell me your exam date, syllabus, or revision goals...",
    systemHint: "Structured exam strategist. Turns syllabi into daily revision timetables and milestone checklists."
  },
  NotesExplainer: {
    label: "AI Notes Explainer",
    icon: <FileText className="w-4 h-4 text-sky-600" />,
    color: "text-sky-800 border-sky-200 bg-sky-50",
    placeholder: "Ask anything about your uploaded PDF lecture notes...",
    systemHint: "Ground-truth PDF analyst. Extracts topics, generates flashcards, and answers with page citations."
  },
  CodingTutor: {
    label: "AI Coding Tutor",
    icon: <Code className="w-4 h-4 text-emerald-600" />,
    color: "text-emerald-800 border-emerald-200 bg-emerald-50",
    placeholder: "Paste your code snippet or ask an algorithm question...",
    systemHint: "Code debugger and Big-O static analyzer. Finds bugs, edge cases, and optimizes algorithms."
  },
  InterviewTrainer: {
    label: "AI Interview Trainer",
    icon: <MessageSquare className="w-4 h-4 text-violet-600" />,
    color: "text-violet-800 border-violet-200 bg-violet-50",
    placeholder: "Tell me your target job role or answer the interview question...",
    systemHint: "Technical mock interviewer. Conducts turn-based interview rounds with realistic rubric feedback."
  }
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        const [chatsRes, messagesRes] = await Promise.all([
          api.get("/chats"),
          api.get(`/chats/${chatId}/messages`)
        ]);
        const foundChat = chatsRes.data.find((c: Chat) => c._id === chatId);
        setChat(foundChat || null);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error("Failed to load chat", err);
      } finally {
        setLoading(false);
      }
    };
    if (chatId) fetchChatData();
  }, [chatId]);

  const handleSend = async (customPrompt?: string) => {
    const contentToSend = (customPrompt || input).trim();
    if (!contentToSend || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    // Optimistically add user message to UI
    const tempUserMsg: Message = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: contentToSend,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: contentToSend }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullAssistantText = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.token) {
                  fullAssistantText += data.token;
                  setStreamingText(fullAssistantText);
                } else if (data.type === "done" && data.message) {
                  setMessages((prev) => [...prev, data.message]);
                  setStreamingText("");
                } else if (data.type === "error") {
                  throw new Error(data.message || "Error generating response");
                }
              } catch (e: any) {
                if (e.message && e.message !== "Unexpected end of JSON input") {
                  console.warn("Parse warning:", e.message);
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Failed to send message", err);
        const errorMsg: Message = {
          _id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${err.message || "An error occurred while connecting to the AI service. Please try again in a few seconds."}`,
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      abortControllerRef.current = null;
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto grow textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const config = chat ? ASSISTANT_CONFIG[chat.assistantType] || ASSISTANT_CONFIG["Tutor"] : ASSISTANT_CONFIG["Tutor"];
  const suggestions = chat ? PROMPT_SUGGESTIONS[chat.assistantType] || PROMPT_SUGGESTIONS["Tutor"] : PROMPT_SUGGESTIONS["Tutor"];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 text-xs font-medium">Opening your learning workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
      
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800 cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border flex items-center justify-center ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                {chat?.title || config.label}
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">{config.label}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Gemini 2.0 Streaming</span>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Session
          </button>
        </div>
      </div>

      {/* Messages Scroll View (Centered max-w-3xl for optimal human reading) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-[#fafbfc]">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Human-Designed Empty State with Clickable Starters */}
          {messages.length === 0 && !isStreaming && (
            <div className="py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-2.5 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
                  {React.cloneElement(config.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{config.label}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {config.systemHint}
                </p>
              </div>

              {/* Clickable Prompt Starter Cards */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suggested Starters (Click to Send)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(item.prompt)}
                      className="text-left p-3.5 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-xs group"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-base leading-none">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.prompt}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`group max-w-[85%] sm:max-w-[78%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-xs shadow-xs"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-slate-900 prose-headings:font-bold prose-headings:my-2 prose-p:my-1.5 prose-p:leading-relaxed prose-pre:bg-[#0f172a] prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-3.5 prose-pre:my-2 prose-pre:border prose-pre:border-slate-800 prose-code:text-indigo-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:my-1.5 prose-li:my-0.5">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <button
                      onClick={() => copyToClipboard(message.content, message._id)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                    >
                      {copiedId === message._id ? (
                        <><Check className="w-3 h-3 text-emerald-600" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy answer</>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-7 h-7 shrink-0 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center mt-1 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming Response Bubble */}
          {isStreaming && streamingText && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="max-w-[85%] sm:max-w-[78%] bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-xs">
                <div className="prose prose-sm max-w-none text-slate-800 prose-code:text-indigo-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded">
                  <ReactMarkdown>{streamingText}</ReactMarkdown>
                </div>
                <span className="inline-block w-2 h-4 bg-indigo-600 animate-pulse ml-1 rounded-xs align-middle"></span>
              </div>
            </div>
          )}

          {/* Thinking animation before first token */}
          {isStreaming && !streamingText && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-slate-400 mr-2">Thinking...</span>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Human-Designed Centered Command Box */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-slate-300 bg-white shadow-md shadow-slate-100 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100/60 transition-all p-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={config.placeholder}
              disabled={isStreaming}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 resize-none focus:outline-none placeholder:text-slate-400 transition-all leading-relaxed max-h-[160px]"
            />

            {/* Bottom Toolbar row inside the box */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="hidden sm:inline">Press</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-mono">
                  Enter ↵
                </kbd>
                <span className="hidden sm:inline">to send</span>
              </div>

              <div className="flex items-center gap-2">
                {isStreaming ? (
                  <button
                    onClick={stopStreaming}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Stop Generating
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 text-center">
            AI can make mistakes. Verify critical facts and formulas for exams.
          </p>
        </div>
      </div>

    </div>
  );
}
