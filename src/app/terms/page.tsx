import Link from "next/link";

export const metadata = {
  title: "Пользовательское соглашение — ГРАВИКОТ",
  description: "Пользовательское соглашение ГРАВИКОТ. Условия использования сайта и заказа услуг.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://gravikot.ru/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech mb-8"
        >
          ← На главную
        </Link>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 break-words">
          Пользовательское соглашение
        </h1>
        <p className="text-sky-300/60 text-sm font-tech mb-10">
          Настоящее Пользовательское соглашение (далее — «Соглашение») является публичной офертой и регламентирует отношения между вами («Пользователь», «Заказчик») и LASER ATELIER / ГРАВИКОТ (далее — «Исполнитель», «Мы»), осуществляющей деятельность через сайт gravikot.ru
        </p>

        <article className="space-y-10 text-sky-100/90 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">1. Общие положения</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">1.1.</p>
                <p>
                  Используя Сайт для просмотра каталога или оформления заказа, вы подтверждаете свое полное и безоговорочное согласие с условиями настоящего Соглашения. Если вы не согласны с какими-либо из условий, пожалуйста, прекратите использование Сайта.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">1.2.</p>
                <p>
                  Исполнитель оставляет за собой право в любое время изменять условия данного Соглашения. Продолжение использования Сайта после внесения изменений означает ваше согласие с обновленной версией.
                </p>
              </div>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">2. Порядок оформления заказа</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">2.1.</p>
                <p>
                  Заказ оформляется путем выбора изделия из каталога и предоставления исходного изображения (фото, логотипа) для гравировки.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">2.2.</p>
                <p>
                  После получения вашего изображения наш дизайнер проводит оценку его пригодности для технологии гравировки и предоставляет бесплатный макет на нашем стандартном шаблоне.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">2.3.</p>
                <p>
                  Обсуждение идеи, формата, размера и других деталей заказа происходит на этапе брифа. Вы несете ответственность за предоставленные материалы и утвержденный макет.
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">3. Условия оплаты и возврата денежных средств</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">3.1.</p>
                <p>
                  Работа над заказом начинается только после поступления предоплаты.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">3.2.</p>
                <p>
                  Возврат денежных средств невозможен, если изделие изготовлено строго по утвержденному вами макету.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">3.3.</p>
                <p>
                  В случае выявления брака, ошибки со стороны Исполнителя (неверный цвет, расположение, дефект изделия), мы обязуемся переделать работу за свой счет.
                </p>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">4. Сроки изготовления</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">4.1.</p>
                <p>
                  Стандартный срок изготовления заказа составляет от 2 до 4 рабочих дней.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">4.2.</p>
                <p>
                  Срок выполнения сложных и нестандартных заказов может быть увеличен. Все изменения сроков согласовываются индивидуально.
                </p>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">5. Доставка и самовывоз</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">5.1.</p>
                <p>
                  Готовый заказ отправляется по территории России почтовыми службами или через 5post. Стоимость доставки оплачивается Заказчиком.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">5.2.</p>
                <p>
                  Возможен самовывоз заказа в г. Самаре по предварительной договоренности.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">5.3.</p>
                <p>
                  При получении посылки рекомендуется проверять целостность упаковки. В случае повреждения товара транспортной компанией необходимо составить акт о повреждении. Мы окажем содействие в составлении претензии к перевозчику.
                </p>
              </div>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">6. Ответственность сторон</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">6.1.</p>
                <p>
                  Исполнитель несет ответственность за качество материалов и точность исполнения согласно утвержденному макету.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">6.2.</p>
                <p>
                  Заказчик гарантирует, что обладает всеми необходимыми правами на передаваемые для обработки изображения и они не нарушают авторские права третьих лиц.
                </p>
              </div>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">7. Заключительные положения</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground/90 mb-1">7.1.</p>
                <p>
                  Настоящее Соглашение регулируется законодательством Российской Федерации.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground/90 mb-1">7.2.</p>
                <p>
                  Все споры и разногласия решаются путем переговоров. В случае невозможности достижения согласия, спор подлежит рассмотрению в суде по месту нахождения Исполнителя.
                </p>
              </div>
            </div>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
