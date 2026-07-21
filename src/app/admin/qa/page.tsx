"use client";

import { useCallback, useEffect, useState } from "react";

interface QAEntry {
  q: string;
  a?: string;
  date: string;
  email?: string;
}

interface QAData {
  [slug: string]: QAEntry[];
}

const PRODUCT_NAMES: Record<string, string> = {
  gramine: "Грамине",
  maag: "МААГ",
  kollinz: "Коллинз",
  glass: "Гласс",
  flyute: "ФЛЮТЕ",
  drezden: "ДРЕЗДЕН",
};

export default function AdminQAPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<QAData>({});
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ask?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const d = await res.json();
        setData(d);
      } else {
        setMsg("Ошибка загрузки — проверьте токен");
      }
    } catch {
      setMsg("Сетевая ошибка");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim().length > 0) setAuthed(true);
  };

  const handleAnswer = async (slug: string, index: number) => {
    const key = `${slug}-${index}`;
    const answer = answerText[key];
    if (!answer?.trim()) return;
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      const res = await fetch("/api/ask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug, index, answer, token }),
      });
      if (res.ok) {
        setMsg("Ответ сохранён и опубликован");
        setAnswerText((a) => ({ ...a, [key]: "" }));
        await fetchAll();
      } else {
        const d = await res.json();
        setMsg(d.error || "Ошибка");
      }
    } catch {
      setMsg("Сетевая ошибка");
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  const handleDelete = async (slug: string, index: number) => {
    const key = `${slug}-${index}`;
    if (!confirm("Удалить этот вопрос?")) return;
    setDeleting((d) => ({ ...d, [key]: true }));
    try {
      const res = await fetch("/api/ask", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug, index, token }),
      });
      if (res.ok) {
        setMsg("Вопрос удалён");
        await fetchAll();
      } else {
        const d = await res.json();
        setMsg(d.error || "Ошибка");
      }
    } catch {
      setMsg("Сетевая ошибка");
    } finally {
      setDeleting((d) => ({ ...d, [key]: false }));
    }
  };

  // Login screen
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
          <h1 className="font-display font-bold text-xl text-white mb-4">Админ — Вопросы</h1>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Введите токен"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-sky-400/40 mb-4"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-display font-semibold text-sm text-white/90 transition"
            style={{
              background: "linear-gradient(135deg, rgba(41,227,255,0.15), rgba(255,43,214,0.15))",
              border: "1px solid rgba(41,227,255,0.2)",
            }}
          >
            Войти
          </button>
        </form>
      </main>
    );
  }

  // Count unanswered
  const unanswered = Object.entries(data).reduce(
    (sum, [, entries]) => sum + entries.filter((e) => !e.a).length,
    0
  );

  return (
    <main className="min-h-screen bg-[#050510] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl">Вопросы — ответы</h1>
            <p className="text-sky-100/50 text-sm font-tech mt-1">
              {unanswered > 0 ? `${unanswered} без ответа` : "Все вопросы отвечены"}
            </p>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-tech bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Загрузка…" : "Обновить"}
          </button>
        </div>

        {msg && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-sky-300">
            {msg}
            <button onClick={() => setMsg("")} className="ml-3 text-white/30 hover:text-white">✕</button>
          </div>
        )}

        {/* Questions by product */}
        {Object.entries(data).map(([slug, entries]) => {
          if (entries.length === 0) return null;
          const unansweredInProduct = entries.filter((e) => !e.a).length;
          return (
            <div key={slug} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-display font-bold text-lg">
                  {PRODUCT_NAMES[slug] || slug}
                </h2>
                {unansweredInProduct > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold">
                    {unansweredInProduct} новых
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {entries.map((entry, i) => {
                  const key = `${slug}-${i}`;
                  const isAnswered = !!entry.a;
                  return (
                    <div
                      key={i}
                      className={`glass rounded-2xl p-4 border ${
                        isAnswered ? "border-emerald-500/10" : "border-amber-500/20"
                      }`}
                    >
                      {/* Question */}
                      <div className="flex items-start gap-2">
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                          isAnswered ? "bg-sky-500/10 text-sky-400" : "bg-amber-500/10 text-amber-400"
                        }`}>Q</span>
                        <div className="flex-1">
                          <p className="text-sky-100/90 text-sm">{entry.q}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-white/20 text-[10px] font-tech">{entry.date}</span>
                            {entry.email && (
                              <a href={`mailto:${entry.email}`} className="text-sky-400/50 text-[10px] font-tech hover:text-sky-300">
                                {entry.email}
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(slug, i)}
                          disabled={deleting[key]}
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition text-xs"
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Existing answer */}
                      {entry.a && (
                        <div className="flex items-start gap-2 mt-3">
                          <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-0.5">A</span>
                          <p className="text-white/90 text-sm">{entry.a}</p>
                        </div>
                      )}

                      {/* Answer form */}
                      {!isAnswered && (
                        <div className="mt-3 ml-7">
                          <textarea
                            value={answerText[key] || ""}
                            onChange={(e) => setAnswerText((a) => ({ ...a, [key]: e.target.value }))}
                            placeholder="Ваш ответ…"
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-sky-400/40 resize-none"
                          />
                          <button
                            onClick={() => handleAnswer(slug, i)}
                            disabled={saving[key] || !answerText[key]?.trim()}
                            className="mt-2 px-4 py-1.5 rounded-xl text-sm font-display font-semibold transition disabled:opacity-30"
                            style={{
                              background: "linear-gradient(135deg, rgba(41,227,255,0.15), rgba(255,43,214,0.15))",
                              border: "1px solid rgba(41,227,255,0.2)",
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            {saving[key] ? "Сохранение…" : "Ответить и опубликовать"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.keys(data).length === 0 && !loading && (
          <p className="text-sky-100/30 text-center py-12">Вопросов пока нет</p>
        )}
      </div>
    </main>
  );
}
