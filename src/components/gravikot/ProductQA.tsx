"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface QAItem {
  q: string;
  a: string;
  date: string;
}

interface ProductQAProps {
  productSlug: string;
  productName: string;
}

export function ProductQA({ productSlug, productName }: ProductQAProps) {
  const [open, setOpen] = useState(false);
  const [qa, setQA] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch answered Q&As
  const fetchQA = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ask?product=${encodeURIComponent(productSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setQA(Array.isArray(data) ? data : []);
      }
    } catch {
      // Silently fail — Q&A is non-critical
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    if (open) fetchQA();
  }, [open, fetchQA]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      // Don't override if gallery already locked it
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Submit question
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 3) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          question: question.trim(),
          email: email.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSent(true);
        setQuestion("");
        setEmail("");
        setTimeout(() => setSent(false), 4000);
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка отправки");
      }
    } catch {
      setError("Не удалось отправить вопрос");
    } finally {
      setSending(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <>
      {/* Floating Q&A trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-20 right-3 md:right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.5)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
        aria-label="Вопросы и ответы"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {/* Overlay + Slide-up panel */}
      {open && (
        <div
          className="absolute inset-0 z-40 flex flex-col justify-end"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Panel */}
          <div
            ref={panelRef}
            className="relative w-full max-h-[80vh] rounded-t-3xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(8, 8, 24, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 -8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 shrink-0">
              <div>
                <h2 className="font-display font-bold text-lg text-white">Вопрос — ответ</h2>
                <p className="text-sky-100/50 text-xs font-tech mt-0.5">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition text-sm"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/10 to-transparent shrink-0" />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">

              {/* Existing Q&As */}
              {loading && qa.length === 0 && (
                <p className="text-sky-100/40 text-sm text-center py-4">Загрузка…</p>
              )}

              {qa.length > 0 && (
                <div className="space-y-3">
                  {qa.map((item, i) => (
                    <div
                      key={i}
                      className="glass rounded-2xl p-4 border border-white/5"
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-sky-500/10 text-sky-400 text-[10px] font-bold mt-0.5">Q</span>
                        <p className="text-sky-100/90 text-sm leading-relaxed">{item.q}</p>
                      </div>
                      <div className="flex items-start gap-2 mt-3">
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-0.5">A</span>
                        <p className="text-white/90 text-sm leading-relaxed">{item.a}</p>
                      </div>
                      <p className="text-white/20 text-[10px] mt-2 text-right font-tech">{item.date}</p>
                    </div>
                  ))}
                </div>
              )}

              {!loading && qa.length === 0 && (
                <p className="text-sky-100/30 text-sm text-center py-2">
                  Пока нет вопросов — задайте первый
                </p>
              )}

              {/* Ask form */}
              <div className="glass rounded-2xl p-4 border border-white/5">
                <h3 className="font-display font-semibold text-sm text-white/80 mb-3">Задать вопрос</h3>

                {sent ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 mx-auto mb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-emerald-300 text-sm font-medium">Вопрос отправлен</p>
                    <p className="text-sky-100/40 text-xs mt-1">Ответим и опубликуем на этой странице</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                      ref={inputRef}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ваш вопрос о товаре…"
                      rows={3}
                      maxLength={500}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/20 resize-none transition"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email (необязательно — для ответа)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/20 transition"
                    />
                    {error && (
                      <p className="text-red-400 text-xs">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={sending || question.trim().length < 3}
                      className="w-full py-2.5 rounded-xl font-display font-semibold text-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, rgba(41,227,255,0.15), rgba(255,43,214,0.15))",
                        border: "1px solid rgba(41,227,255,0.2)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {sending ? "Отправка…" : "Отправить вопрос"}
                    </button>
                    <p className="text-white/15 text-[10px] text-center font-tech">
                      Вопрос уйдёт на почту, ответ появится здесь
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
