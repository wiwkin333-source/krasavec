import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

// Resolve data directory: env var → project root data/ → fallback to /tmp
function dataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  // In standalone mode process.cwd() is the standalone server dir.
  // Try project root (one level up from .next/standalone) first:
  const cwd = process.cwd();
  if (cwd.includes(".next/standalone") || cwd.includes(".next\\standalone")) {
    // Go up 2 levels: standalone → .next → project root
    return path.resolve(cwd, "..", "..", "data");
  }
  return path.join(cwd, "data");
}

const qaFile = () => path.join(dataDir(), "product-qa.json");

interface QAEntry {
  q: string;
  a?: string;
  date: string;
  email?: string;
}

interface QAData {
  [productSlug: string]: QAEntry[];
}

async function ensureDir(): Promise<void> {
  try {
    await mkdir(dataDir(), { recursive: true });
  } catch {
    // Directory already exists — ignore
  }
}

async function readQA(): Promise<QAData> {
  try {
    const raw = await readFile(qaFile(), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeQA(data: QAData): Promise<void> {
  await ensureDir();
  await writeFile(qaFile(), JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, question, email } = body;

    if (!productSlug || !question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    if (question.length > 500) {
      return NextResponse.json({ error: "Вопрос слишком длинный (макс. 500 символов)" }, { status: 400 });
    }

    const data = await readQA();

    if (!data[productSlug]) {
      data[productSlug] = [];
    }

    const entry: QAEntry = {
      q: question.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    if (email && typeof email === "string" && email.includes("@")) {
      entry.email = email.trim();
    }

    data[productSlug].push(entry);
    await writeQA(data);

    // Attempt to send email notification if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = process.env.NOTIFY_EMAIL || "kyriptor@yandex.ru";

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"ГРАВИКОТ" <${smtpUser}>`,
          to: notifyEmail,
          subject: `Новый вопрос о товаре: ${productSlug}`,
          text: `Продукт: ${productSlug}\nВопрос: ${question.trim()}\n${email ? `Email клиента: ${email.trim()}` : "Email не указан"}\nДата: ${entry.date}`,
        });
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
        // Don't fail the request — question is saved
      }
    }

    return NextResponse.json({ ok: true, savedTo: qaFile() });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json({ error: "Ошибка сервера", detail: String(err) }, { status: 500 });
  }
}

/** Return only answered questions for a product (public data) */
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("product");
    if (!slug) {
      return NextResponse.json({ error: "Missing product slug" }, { status: 400 });
    }

    const data = await readQA();
    const entries = data[slug] || [];

    // Only return questions that have an answer (public)
    const publicQA = entries
      .filter((e) => e.a && e.a.trim().length > 0)
      .map(({ q, a, date }) => ({ q, a: a!, date }));

    return NextResponse.json(publicQA);
  } catch (err) {
    console.error("Ask API GET error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
