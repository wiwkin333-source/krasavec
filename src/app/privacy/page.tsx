import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности — ГРАВИКОТ",
  description: "Политика конфиденциальности мастерской ГРАВИКОТ. Как мы собираем, используем и защищаем ваши персональные данные.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sky-300 hover:text-white transition text-sm font-tech mb-8"
        >
          ← На главную
        </Link>

        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-2">
          Политика конфиденциальности
        </h1>
        <p className="text-sky-300/60 text-sm font-tech mb-10">
          Последнее обновление: 1 января 2026 г.
        </p>

        <article className="prose-sm space-y-8 text-sky-100/90 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта&nbsp;ГРАВИКОТ (далее&nbsp;— «Сайт», «Мы», «Оператор»). Используя Сайт, вы подтверждаете своё согласие с условиями данной Политики. Если вы не согласны с условиями, пожалуйста, прекратите использование Сайта.
            </p>
            <p>
              Мы серьёзно относимся к защите ваших персональных данных и принимаем все необходимые организационные и технические меры для их защиты от неправомерного доступа, изменения, раскрытия или уничтожения.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">2. Какие данные мы собираем</h2>
            <p>В процессе взаимодействия с Сайтом мы можем собирать следующие категории данных:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Данные, предоставленные вами:</strong> имя, номер телефона, адрес электронной почты, адрес доставки, текст сообщений и комментарии, которые вы направляете через формы на Сайте или мессенджеры.</li>
              <li><strong>Данные, собираемые автоматически:</strong> IP-адрес, тип и версия браузера, операционная система, страница перехода (реферер), страницы просмотра, время и дата визита, файлы cookie и аналоговые технологии.</li>
              <li><strong>Данные об订单ах:</strong> информация о заказах, включая состав, стоимость, способ оплаты и статус выполнения.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">3. Цели обработки данных</h2>
            <p>Персональные данные обрабатываются в следующих целях:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Обработка и выполнение заказов, включая доставку.</li>
              <li>Обратная связь и консультирование по вопросам продукции и услуг.</li>
              <li>Улучшение качества Сайта, его содержания и структуры.</li>
              <li>Информирование о статусе заказа, акциях и новых предложениях (с вашего согласия).</li>
              <li>Обеспечение безопасности и предотвращение мошенничества.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">4. Правовые основания</h2>
            <p>
              Обработка персональных данных осуществляется на основании вашего согласия (ст.&nbsp;6&nbsp;ФЗ&nbsp;«О персональных данных»), а также в случаях, предусмотренных действующим законодательством Российской Федерации, включая исполнение договора, стороной которого вы являетесь.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">5. Передача данных третьим лицам</h2>
            <p>
              Мы не передаём ваши персональные данные третьим лицам, за исключением следующих случаев:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Службы доставки — для исполнения заказа (имя, телефон, адрес).</li>
              <li>Платёжные системы — для обработки оплаты (в объёме, необходимом для транзакции).</li>
              <li>По требованию закона или компетентных органов.</li>
              <li>С вашего явного согласия.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">6. Хранение данных</h2>
            <p>
              Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, но не более 3&nbsp;лет с момента последнего взаимодействия, если иное не предусмотрено законодательством. По истечении указанного срока данные удаляются или обезличиваются.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">7. Файлы cookie</h2>
            <p>
              Сайт использует файлы cookie для обеспечения корректной работы, анализа посещаемости и персонализации пользовательского опыта. Вы можете отключить cookie в настройках браузера, однако это может ограничить функциональность Сайта.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">8. Ваши права</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Запросить доступ к своим персональным данным.</li>
              <li>Потребовать исправления неточных данных.</li>
              <li>Потребовать удаления персональных данных.</li>
              <li>Отозвать согласие на обработку данных.</li>
              <li>Обратиться с жалобой в уполномоченный орган по защите персональных данных.</li>
            </ul>
            <p>
              Для реализации прав свяжитесь с нами: <a href="mailto:gravikotik@yandex.ru" className="text-sky-300 hover:text-white transition">gravikotik@yandex.ru</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">9. Безопасность</h2>
            <p>
              Мы применяем технические (шифрование, защита сети) и организационные (ограничение доступа, обучение персонала) меры для защиты ваших данных. Несмотря на принимаемые меры, ни одна система передачи данных через Интернет не является полностью безопасной. Мы не можем гарантировать абсолютную безопасность, но стремимся минимизировать риски.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">10. Изменения политики</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда доступна на данной странице. Рекомендуем периодически проверять содержание Политики. Продолжение использования Сайта после внесения изменений означает ваше согласие с обновлёнными условиями.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">11. Контактная информация</h2>
            <p>
              Оператор: ИП Гравикот<br />
              Email: <a href="mailto:gravikotik@yandex.ru" className="text-sky-300 hover:text-white transition">gravikotik@yandex.ru</a><br />
              Телефон: <a href="tel:+79258343045" className="text-sky-300 hover:text-white transition">+7&nbsp;(925)&nbsp;834-30-45</a>
            </p>
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
