"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  FileText,
  Calendar,
  MessageSquare,
  ChevronDown,
  Terminal,
  ShieldCheck,
  Zap,
  TrendingUp,
  Search,
  Check,
  Star
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"exam" | "code" | "notes" | "interview">("exam");
  const [examTasks, setExamTasks] = useState([
    { id: 1, text: "Revise Binary Search Trees & AVL Rotations", completed: true, tag: "High Priority" },
    { id: 2, text: "Solve 5 LeetCode medium problems on Dynamic Programming", completed: true, tag: "Practice" },
    { id: 3, text: "Review Operating Systems: Memory Management & Paging", completed: false, tag: "Theory" },
    { id: 4, text: "Take 45-minute timed Mock Quiz on DBMS Normalization", completed: false, tag: "Mock Test" },
  ]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleTask = (id: number) => {
    setExamTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = examTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / examTasks.length) * 100);

  const faqs = [
    {
      q: "How is AI Learning Hub different from standard ChatGPT or Claude?",
      a: "General chatbots lack educational structure. AI Learning Hub provides dedicated, persistent tools: your Exam Coach builds real multi-week timetables with progress tracking; the Notes Explainer searches strictly within your uploaded course PDFs with page citations; and the Coding Tutor calculates exact time/space complexity with bug fixes."
    },
    {
      q: "Is it really free to use?",
      a: "Yes. The Starter Plan is 100% free with daily AI prompts, document uploads, and study planner access. You do not need to enter any credit card or payment information to get started."
    },
    {
      q: "Are my uploaded study notes and code kept private?",
      a: "Yes, absolutely. Your files, chats, and code are saved privately to your personal authenticated account and are never used to train public AI models or shared with anyone else."
    },
    {
      q: "Can I upload lecture slides or textbook PDFs?",
      a: "Yes. You can upload PDFs of lecture slides, syllabus documents, and textbook chapters. The system indexes your documents into embeddings and answers your questions using strict contextual citations."
    },
    {
      q: "Which programming languages does the Coding Tutor support?",
      a: "It supports Python, JavaScript, TypeScript, C++, Java, C, Go, Rust, and SQL, providing bug detection, time/space complexity analysis, and clean refactoring."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col items-center overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Subtle Dot Grid Background in Clean Light Slate */}
      <div className="absolute inset-0 bg-dot-grid-light pointer-events-none opacity-40 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial-glow-light pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <header className="w-full max-w-7xl px-4 sm:px-8 py-4 flex items-center justify-between z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              AI Learning Hub
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                ● Live 2.0
              </span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#showcase" className="hover:text-indigo-600 transition-colors">Interactive Demo</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-1.5 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 sm:px-8 pt-16 pb-12 flex flex-col items-center text-center z-10">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Purpose-built for University Exams, GATE & Tech Interviews</span>
        </div>

        {/* Realistic High-Converting Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-[1.15] text-slate-900">
          The Intelligent Workspace for{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
            Serious Students & Developers
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed font-normal">
          Stop copying notes into generic chatbots. Turn 100-page syllabi into daily revision schedules, debug algorithms with time-complexity analysis, and master your technical interviews.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            Launch Free Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#showcase"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
          >
            Explore Live Demo
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Social Proof Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-3.5 px-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-slate-900 ml-1">4.9/5</span>
            <span className="text-slate-500">by 1,400+ Learners</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero-Hallucination RAG Citations</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>100% Free Starter Plan • No Card</span>
          </div>
        </div>
      </section>

      {/* Interactive Product Showcase (Realistic Desktop Window) */}
      <section id="showcase" className="w-full max-w-6xl px-4 sm:px-8 py-10 z-10">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* macOS Titlebar Header */}
          <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block border border-rose-500/30"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block border border-amber-500/30"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block border border-emerald-500/30"></span>
              <span className="ml-3 text-xs font-mono text-slate-500 hidden sm:inline">
                ai-learning-hub / workspace / {activeTab}-preview.tsx
              </span>
            </div>

            {/* Interactive Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("exam")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "exam"
                    ? "bg-white text-indigo-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Exam Coach
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-white text-indigo-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code Reviewer
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "notes"
                    ? "bg-white text-indigo-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Notes Q&A
              </button>
              <button
                onClick={() => setActiveTab("interview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "interview"
                    ? "bg-white text-indigo-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Mock Interview
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 min-h-[420px] bg-white">
            {/* TAB 1: EXAM COACH PREVIEW */}
            {activeTab === "exam" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        GATE 2026 CS & IT
                      </span>
                      <span className="text-xs text-slate-500">Target Date: Nov 15, 2026</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Week 3: Advanced Data Structures & Memory Paging</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Weekly Progress</div>
                      <div className="text-sm font-bold text-indigo-600">{progressPercent}% Completed</div>
                    </div>
                    <div className="w-28 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Checklist (Click any item to see live progress updating):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {examTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        task.completed
                          ? "bg-emerald-50/60 border-emerald-200 text-slate-500"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-900"
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        task.completed ? "bg-emerald-600 text-white" : "border border-slate-400 bg-white"
                      }`}>
                        {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {task.text}
                        </p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium">
                          {task.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-indigo-950">AI Coach Revision Strategy:</span> Binary Search Trees and Paging account for ~14% of the Technical weightage. We scheduled a 45-min practice block tonight to solve previous year GATE questions.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: CODE REVIEWER PREVIEW */}
            {activeTab === "code" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#0f172a] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
                    <span>binarySearch.cpp</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">C++</span>
                  </div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                    <code>{`int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        // ⚠️ BUG DETECTED: Integer overflow
        int mid = (low + high) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`}</code>
                  </pre>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                    <div className="font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      Bug Found on Line 5
                    </div>
                    <p className="text-rose-700 leading-normal text-[11px]">
                      Potential integer overflow when <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-rose-900">low + high</code> exceeds <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-rose-900">INT_MAX</code>.
                    </p>
                    <div className="mt-2 p-2 rounded bg-white border border-rose-200 font-mono text-[11px] text-emerald-700 font-semibold">
                      Fix: int mid = low + (high - low) / 2;
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="text-slate-600 font-medium">Complexity Breakdown</div>
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold text-[11px]">
                        Time: O(log N)
                      </div>
                      <div className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold text-[11px]">
                        Space: O(1)
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all">
                    Apply Recommended Refactor
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: NOTES & PDF Q&A PREVIEW */}
            {activeTab === "notes" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 pb-2 border-b border-slate-200">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Operating_Systems_Ch4.pdf</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-mono">
                    "...In modern operating systems, virtual memory abstracts physical RAM. Paging divides memory into fixed-size frames, eliminating external fragmentation..."
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Document: 24 Pages Parsed</span>
                    <span className="text-emerald-700 font-medium">● Vector Embeddings Indexed</span>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 text-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
                      <span className="text-[10px] text-indigo-600 font-bold block mb-1">Student Question:</span>
                      How does paging eliminate external fragmentation, and does it cause internal fragmentation?
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-xs leading-relaxed space-y-2">
                      <span className="text-[10px] text-indigo-800 font-bold block flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Answer (Citing Page 12, Section 4.2):
                      </span>
                      <p>
                        Paging eliminates <strong>external fragmentation</strong> because any free physical frame can be allocated to a process, regardless of whether contiguous blocks exist.
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        However, it introduces <strong>internal fragmentation</strong> when a process does not completely fill its last allocated page frame.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
                    <input
                      disabled
                      placeholder="Ask any question about your uploaded lecture notes..."
                      className="bg-transparent text-xs text-slate-600 w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MOCK INTERVIEW PREVIEW */}
            {activeTab === "interview" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                      Technical Mock Session
                    </span>
                    <span className="text-slate-500 text-xs">Role: Full-Stack React & Node Engineer</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs">Score: 8.8 / 10</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                      AI
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-600 mb-0.5">Interviewer Question:</div>
                      <p className="text-slate-900 text-xs leading-relaxed font-medium">
                        "Suppose your Node.js backend experiences high CPU utilization during heavy document parsing. How would you handle this without blocking the event loop?"
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                    <span className="font-bold text-emerald-700 block mb-1">Feedback & Scoring Breakdown:</span>
                    "Candidate correctly identified worker threads and offloading compute tasks to background job queues. Recommended mentioning child processes or streaming for memory optimization."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section id="features" className="w-full max-w-7xl px-4 sm:px-8 py-20 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Designed for Real Academic & Technical Workflows
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every module in AI Learning Hub is tailored around how university students study and how developers prepare for technical rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Exam Coach (Wide) */}
          <div className="md:col-span-2 realistic-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Multi-Week Exam Timetables</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Tell the Exam Coach your syllabus, exam date, and daily available study hours. It automatically breaks the curriculum down into achievable daily goals, active revision slots, and timed mock milestones.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Adaptive revision pacing based on completed tasks
              </span>
              <span className="font-semibold text-indigo-600">Auto-calculated</span>
            </div>
          </div>

          {/* Card 2: Coding Coach */}
          <div className="realistic-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Code Bug & Complexity Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Paste your solutions to inspect time and space complexity instantly. Identifies off-by-one errors, memory leaks, and edge-case risks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-emerald-700 flex items-center gap-2 font-semibold">
              <span>● O(log N) static analysis</span>
            </div>
          </div>

          {/* Card 3: Notes Explainer */}
          <div className="realistic-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-5">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">PDF Document Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload course PDFs, lecture presentations, and research papers. Ask targeted questions with precise page citations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-sky-700 flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Zero hallucinations guaranteed</span>
            </div>
          </div>

          {/* Card 4: Mock Interviewer (Wide) */}
          <div className="md:col-span-2 realistic-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-5">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Adaptive Technical Mock Interviews</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Practice answering system design, database indexing, and frontend architecture questions. The AI acts as a patient interviewer, evaluating each answer for clarity, correctness, and completeness.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Evaluated against real engineering rubrics
              </span>
              <span className="font-semibold text-indigo-600">Immediate Feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section id="workflow" className="w-full max-w-7xl px-4 sm:px-8 py-16 z-10 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Start preparing in less than 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center sm:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900">Choose Your Workspace</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Select between Exam Prep, Code Debugging, PDF Document Chat, or Mock Interview trainer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center sm:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900">Input Your Material or Code</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Paste your source code, upload your syllabus notes, or specify your exam date and key weak topics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center sm:text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900">Track & Master Your Goals</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Follow your daily dynamic tasks, inspect clean code refactors, and achieve peak exam readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Realistic Testimonials */}
      <section id="testimonials" className="w-full max-w-7xl px-4 sm:px-8 py-20 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Trusted by College Students & Engineers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Here is what learners preparing for university exams and tech roles have to say:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="realistic-card p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              "The Exam Coach saved me during final year semester exams. Turning my 80-page DBMS syllabus into daily actionable checkpoints made revision effortless without feeling overwhelmed."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                AS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Aarav Sharma</div>
                <div className="text-[11px] text-slate-500">B.Tech CSE • Final Year</div>
              </div>
            </div>
          </div>

          <div className="realistic-card p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              "Instead of just giving code, the Coding Tutor actually pointed out where my two-pointer approach had an edge-case boundary issue and explained the time complexity cleanly."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white text-xs">
                PN
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Priya Nair</div>
                <div className="text-[11px] text-slate-500">Frontend Intern & LeetCode Learner</div>
              </div>
            </div>
          </div>

          <div className="realistic-card p-6 rounded-2xl flex flex-col justify-between">
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              "Uploading my GATE previous year questions PDF and having the AI test me on specific topics with page references gave me a solid edge in my revision timeline."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                RM
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Rohan Mehta</div>
                <div className="text-[11px] text-slate-500">GATE 2026 Aspirant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="w-full max-w-4xl px-4 sm:px-8 py-16 z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === index ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner in Clean Indigo Theme */}
      <section className="w-full max-w-6xl px-4 sm:px-8 py-16 z-10">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 border border-indigo-600 p-8 sm:p-14 text-center relative overflow-hidden shadow-xl text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Take Control of Your Study & Prep?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join hundreds of motivated students and developers mastering their subjects with dedicated AI engines.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-indigo-700 font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-800/80 hover:bg-indigo-800 border border-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center text-sm"
            >
              Log in to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-4 sm:px-8 py-12 border-t border-slate-200 text-slate-600 text-xs z-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">AI Learning Hub</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
          <a href="#showcase" className="hover:text-indigo-600 transition-colors">Demo</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          <Link href="/login" className="hover:text-indigo-600 transition-colors">Log In</Link>
          <Link href="/signup" className="hover:text-indigo-600 transition-colors">Sign Up</Link>
        </div>

        <div className="text-slate-500">
          © {new Date().getFullYear()} AI Learning Hub. Built for engineering & academic success.
        </div>
      </footer>
    </div>
  );
}
