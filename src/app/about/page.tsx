import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "О компании — ГРАВИКОТ",
  description: "ГРАВИКОТ — лазерное ателье светящейся гравировки. Самозанятый Курипта Дмитрий Викторович. ИНН 501721586348. Самара.",
  alternates: {
    canonical: "https://gravikot.ru/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech mb-8"
        >
          &larr; На главную
        </Link>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 break-words">
          О компании
        </h1>
        <div className="h-px w-24 mt-4 mb-10" style={{ background: "linear-gradient(90deg, #29e3ff, transparent)" }} />

        <article className="space-y-8 text-sky-100/90 leading-relaxed">
          {/* Кто мы */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">ГРАВИКОТ — лазерное ателье светящейся гравировки</h2>
            <p>
              ГРАВИКОТ — это авторская мастерская, которая создаёт уникальные сувениры и подарки со светящейся гравировкой и не только. Каждое изделие дорабатывается вручную с применением лазерных технологий, что обеспечивает высочайшую точность переноса изображения.
            </p>
            <p className="mt-3">
              Мы работаем с фотографиями, логотипами, надписями и любыми изображениями, которые вы хотите видеть на кружке, бокале или другом изделии. Результат — индивидуальный подарок, который светится в темноте и оставляет незабываемое впечатление.
            </p>
          </section>

          {/* Реквизиты */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Реквизиты</h2>
            <div className="glass rounded-2xl p-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-sky-100/60">Статус:</span>
                <span className="text-foreground font-semibold">Самозанятый</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-100/60">ФИО:</span>
                <span className="text-foreground font-semibold">Курипта Дмитрий Викторович</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-100/60">ИНН:</span>
                <span className="text-foreground font-semibold font-mono">501721586348</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-100/60">Город:</span>
                <span className="text-foreground font-semibold">Самара</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-100/60">В нише с:</span>
                <span className="text-foreground font-semibold">2026 года</span>
              </div>
            </div>
          </section>

          {/* Официальная витрина */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Официальная витрина</h2>
            <p>
              Сайт gravikot.ru является официальной витриной товаров и услуг лазерного ателье ГРАВИКОТ. Все представленные на сайте изделия изготавливаются нами лично — от приёмки макета до отправки готового заказа. Мы не являемся посредниками и не перепродаём чужую продукцию.
            </p>
            <p className="mt-3">
              Работаем официально: чеки отправляются в электронном виде. По вопросам, связанным с заказами и качеством изделий, вы всегда можете связаться с нами напрямую через любой из указанных на сайте мессенджеров.
            </p>
          </section>

          {/* Плачу налоги */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Налоговая прозрачность</h2>
            <p className="text-sky-100/70 text-sm mb-4">Выписка из ФНС — подтверждение статуса самозанятого</p>
            <div className="glass rounded-2xl p-4 border border-white/10">
              <Image
                src="/images/fns-extract.png"
                alt="Выписка из ФНС — подтверждение статуса самозанятого Курипта Д.В."
                width={1200}
                height={1706}
                className="w-full h-auto rounded-xl"
                sizes="(max-width: 768px) 100vw, 680px"
              />
            </div>
            <p className="text-sky-100/50 text-xs mt-3">Работаю официально, чеки отправляю в электронном виде</p>
          </section>

          {/* Контакты */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Контакты</h2>
            <div className="glass rounded-2xl p-5 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-sky-100/60 w-20 shrink-0">Телефон:</span>
                <a href="tel:+79258343045" className="text-sky-300 hover:text-white transition">+7 (925) 834-30-45</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sky-100/60 w-20 shrink-0">Email:</span>
                <a href="mailto:kyriptor@yandex.ru" className="text-sky-300 hover:text-white transition">kyriptor@yandex.ru</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sky-100/60 w-20 shrink-0">Город:</span>
                <span className="text-foreground">Самара</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sky-100/60 w-20 shrink-0">Режим:</span>
                <span className="text-foreground">Ежедневно с 9:00 до 23:00 по Мск</span>
              </div>
            </div>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech"
          >
            Доставка и оплата &rarr;
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech"
          >
            &larr; На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
