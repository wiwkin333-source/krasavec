import Link from "next/link";

export const metadata = {
  title: "Доставка и оплата — ГРАВИКОТ",
  description: "Доставка светящейся гравировки по России: Почта, СДЭК, Озон, Яндекс. Способы оплаты: СБП, Сбербанк, Т-банк, наличные. Самовывоз в Самаре.",
  alternates: {
    canonical: "https://gravikot.ru/delivery",
  },
};

export default function DeliveryPage() {
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
          Доставка и оплата
        </h1>
        <div className="h-px w-24 mt-4 mb-10" style={{ background: "linear-gradient(90deg, #29e3ff, transparent)" }} />

        <article className="space-y-8 text-sky-100/90 leading-relaxed">
          {/* Сроки */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Сроки отправки</h2>
            <p>
              Отправка заказов осуществляется в течение 1–7 дней после получения оплаты. Точный срок зависит от сложности изделия и загруженности мастерской. Как только заказ будет готов, мы свяжемся с вами и согласуем удобный способ доставки.
            </p>
          </section>

          {/* Оплата */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Способы оплаты</h2>
            <p>Работаем строго по предоплате. Оплатить заказ можно любым удобным для вас способом:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { label: "Перевод по СБП", desc: "Быстро и без комиссии" },
                { label: "Карта Сбербанка", desc: "Перевод по номеру телефона" },
                { label: "Т-банк (Тинькофф)", desc: "Перевод по номеру телефона или карте" },
                { label: "Наличные при встрече", desc: "Только при самовывозе в Самаре" },
              ].map((m) => (
                <div key={m.label} className="glass rounded-xl p-4 border border-white/10">
                  <div className="font-display font-bold text-foreground text-sm">{m.label}</div>
                  <div className="text-sky-100/50 text-xs mt-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Возврат */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Возврат и обмен</h2>
            <div className="glass rounded-2xl p-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="text-red-400 shrink-0 text-lg leading-none">&times;</span>
                <div>
                  <div className="font-display font-bold text-foreground">Возврат невозможен</div>
                  <div className="text-sky-100/70 mt-1">
                    Если изделие изготовлено строго по утверждённому вами макету — возврат невозможен. Персонализированный товар с вашей фотографией или надписью не подлежит обмену и возврату в соответствии с законодательством РФ.
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-400 shrink-0 text-lg leading-none">&#10003;</span>
                <div>
                  <div className="font-display font-bold text-foreground">Переделаем за свой счёт</div>
                  <div className="text-sky-100/70 mt-1">
                    Если ошиблись мы — неправильно подобрали цвет, нарушили расположение элементов или допустили производственный брак — мы переделаем изделие за свой счёт. Качество для нас в приоритете.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Доставка */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Способы доставки</h2>
            <p>
              Отправляем заказы по России. Стоимость доставки оплачивается покупателем и не входит в цену изделия. Выберите удобную службу при оформлении заказа:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { name: "Почта России", icon: "✉" },
                { name: "СДЭК", icon: "📦" },
                { name: "Озон", icon: "🏪" },
                { name: "Яндекс", icon: "🚚" },
              ].map((s) => (
                <div key={s.name} className="glass rounded-xl p-3 text-center border border-white/10">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-tech text-xs text-foreground">{s.name}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-sky-100/60">
              Стоимость и сроки доставки зависят от выбранной службы и региона. Точную сумму рассчитаем при оформлении.
            </p>
          </section>

          {/* Самовывоз */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Самовывоз</h2>
            <p>
              Возможен самовывоз в городе Самаре. Удобно, если вы находитесь в городе или планируете быть проездом — сэкономите на доставке и получите изделие лично в руки. Место и время встречи согласовываем индивидуально.
            </p>
          </section>

          {/* Повреждение */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Повреждение при доставке</h2>
            <p>
              К сожалению, транспортные компании не всегда бережно обращаются с посылками. Если изделие повреждено при доставке — не расстраивайтесь. Мы составим акт о повреждении и поможем вам оформить претензию к перевозчику. В большинстве случаев транспортная компания возмещает стоимость повреждённого товара.
            </p>
            <p className="mt-3">
              Обязательно снимайте видео распаковки — это значительно упростит процесс рассмотрения претензии и ускорит возмещение.
            </p>
          </section>

          {/* Контакты */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Остались вопросы?</h2>
            <p>
              Свяжитесь с нами любым удобным способом — мы на связи ежедневно с 9:00 до 23:00 по московскому времени и ответим на все вопросы по доставке, оплате и оформлению заказа.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a href="tel:+79258343045" className="glass rounded-xl px-4 py-2 text-sm text-sky-300 hover:text-white transition border border-white/10">
                +7 (925) 834-30-45
              </a>
              <a href="mailto:kyriptor@yandex.ru" className="glass rounded-xl px-4 py-2 text-sm text-sky-300 hover:text-white transition border border-white/10">
                kyriptor@yandex.ru
              </a>
            </div>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech"
          >
            О компании &rarr;
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
