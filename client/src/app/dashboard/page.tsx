"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Zap, 
  FileText, 
  Code, 
  MessageSquare, 
  ArrowRight, 
  MessageCircle,
  Loader2,
  Clock,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import api from "@/lib/axios";

interface Chat {
  _id: string;
  assistantType: 'Tutor' | 'ExamCoach' | 'NotesExplainer' | 'CodingTutor' | 'InterviewTrainer';
  title: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingType, setCreatingType] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get("/chats");
        setChats(data);
      } catch (err) {
        console.error("Failed to load user chats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const handleStartChat = async (assistantType: string) => {
    try {
      setCreatingType(assistantType);
      const { data } = await api.post("/chats", { 
        assistantType,
        title: `New ${assistantType === 'ExamCoach' ? 'Exam Coach' : assistantType === 'NotesExplainer' ? 'Notes Explainer' : assistantType === 'CodingTutor' ? 'Coding Tutor' : assistantType === 'InterviewTrainer' ? 'Interview Trainer' : 'Personal Tutor'} Session`
      });
      router.push(`/dashboard/chat/${data._id}`);
    } catch (err) {
      console.error("Failed to create chat", err);
      alert("Failed to start session. Please try again.");
    } finally {
      setCreatingType(null);
    }
  };

  const assistants = [
    {
      type: "Tutor",
      title: "AI Personal Tutor",
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-200",
      description: "Explains concepts simply, with adaptive difficulty levels and interactive learning checkpoints.",
      bullets: ["Core concept breakdowns", "Analogies & examples", "Guided step-by-step learning", "Knowledge check quizzes"]
    },
    {
      type: "ExamCoach",
      title: "AI Exam Coach",
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-200",
      description: "Designs multi-week revision timetables, daily task goals, and strategic high-yield topic recommendations.",
      bullets: ["Custom timetable generator", "Weekly milestone goals", "Daily revision checklists", "Exam syllabus breakdown"]
    },
    {
      type: "NotesExplainer",
      title: "AI Notes Explainer",
      icon: <FileText className="w-5 h-5 text-sky-600" />,
      iconBg: "bg-sky-50 border-sky-200",
      description: "Upload your course PDFs to extract key entities, query content using semantic RAG, and generate flashcards.",
      bullets: ["PDF text & topic extraction", "Strict citations with page references", "Chapter summarizations", "Exam flashcard generator"]
    },
    {
      type: "CodingTutor",
      title: "AI Coding Tutor",
      icon: <Code className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-200",
      description: "Static code inspection for bugs, Big-O complexity analysis, memory safety, and guided coding practice.",
      bullets: ["Bug detection & 1-click repair", "Time & Space complexity analysis", "Syntax optimization tips", "Practice coding challenges"]
    },
    {
      type: "InterviewTrainer",
      title: "AI Interview Trainer",
      icon: <MessageSquare className="w-5 h-5 text-violet-600" />,
      iconBg: "bg-violet-50 border-violet-200",
      description: "Conduct turn-based technical mock interviews, evaluating your spoken/written answers with rubric scores.",
      bullets: ["Role-specific question sets", "Interactive turn-based mock", "Constructive rubric scoring", "Personalized improvement feedback"]
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Clean Welcome Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Learning Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Accelerate Your Learning Path
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Select a specialized AI assistant below to start a dedicated study session, debug code, or prepare for upcoming exams.
          </p>
        </div>
      </div>

      {/* Grid of Assistants */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Select Your AI Assistant
            </h2>
            <p className="text-xs text-slate-500">Each assistant utilizes tailored prompting and specialized tool sets.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assistants.map((assistant) => (
            <div 
              key={assistant.type} 
              className="realistic-card rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border ${assistant.iconBg}`}>
                    {assistant.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    Dedicated Agent
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{assistant.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-5">{assistant.description}</p>

                <div className="space-y-1.5 border-t border-slate-100 pt-4 mb-6">
                  {assistant.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartChat(assistant.type)}
                disabled={creatingType === assistant.type}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {creatingType === assistant.type ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Launching...
                  </>
                ) : (
                  <>
                    <span>Start Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" /> Recent Sessions
        </h2>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-slate-400 gap-2 text-xs font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> Loading past sessions...
          </div>
        ) : chats.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No recent learning sessions yet</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click "Start Session" above to launch your first session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {chats.slice(0, 6).map((chat) => (
              <div 
                key={chat._id}
                onClick={() => router.push(`/dashboard/chat/${chat._id}`)}
                className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <div className="truncate mr-3">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {chat.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {chat.assistantType}
                    </span>
                    <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
