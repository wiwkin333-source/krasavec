import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности — ГРАВИКОТ",
  description: "Политика конфиденциальности мастерской ГРАВИКОТ. Порядок обработки и защиты персональных данных.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://gravikot.ru/privacy",
  },
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

        <article className="space-y-8 text-sky-100/90 leading-relaxed mt-10">
          {/* 1 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности (далее&nbsp;— «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта gravikot.ru (далее&nbsp;— «Сайт»).
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">2. Пользовательское соглашение</h2>
            <p>
              Настоящее Пользовательское соглашение регулирует отношения между Администрацией сайта и Пользователем. Использование Сайта означает ваше согласие с условиями настоящей Политики.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">3. Сбор и обработка персональных данных</h2>
            <p>
              Для выполнения заказов на гравировку мы обрабатываем персональные данные, которые вы нам предоставляете:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Контактная информация:</strong> имя, номер телефона, адрес электронной почты, адрес доставки.</li>
              <li><strong>Медиафайлы:</strong> фотографии, изображения или логотипы, которые вы присылаете для нанесения на изделие.</li>
            </ul>
            <p className="mt-3">
              Мы собираем эти данные исключительно в целях исполнения договора купли-продажи/оказания услуг по изготовлению персонализированного товара.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">4. Цели использования ваших данных</h2>
            <p>Ваши данные используются нами только для следующих целей:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Связь с вами для подтверждения заказа и уточнения деталей.</li>
              <li>Передача файлов дизайнеру и мастеру для создания макета и непосредственного изготовления изделия.</li>
              <li>Организация доставки готового заказа.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">5. Конфиденциальность и безопасность</h2>
            <p><strong>Доступ к данным:</strong> Доступ к вашим фотографиям имеют только авторизованные сотрудники: дизайнер и мастер-исполнитель. Данные не передаются третьим лицам за исключением случаев, необходимых для оказания услуги (например, службам доставки).</p>
            <p className="mt-3"><strong>Публичность:</strong> Мы гарантируем полную приватность. Ваши личные фото и контактные данные не публикуются на Сайте, не выкладываются в портфолио без вашего отдельного письменного согласия и не показываются другим клиентам.</p>
            <p className="mt-3"><strong>Хранение данных:</strong> Присланные файлы изображений хранятся на наших защищенных серверах строго ограниченный срок. Все материалы удаляются автоматически через 3&nbsp;дня после сдачи работы и передачи готового изделия заказчику.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">6. Права пользователя</h2>
            <p>
              Вы имеете право запросить информацию об обработке своих данных, а также потребовать их удаления до истечения срока хранения, обратившись к нам через контактные данные, указанные на Сайте.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">7. Точность информации</h2>
            <p>
              Администрация стремится поддерживать актуальность информации, однако не гарантирует абсолютную точность и полноту всех материалов.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">8. Оформление заявки</h2>
            <p>
              Отправка заявки не является автоматическим заключением договора и не гарантирует выполнение заказа. Итоговые условия выполнения заказа и сроки согласовываются индивидуально.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">9. Интеллектуальная собственность</h2>
            <p>
              Все тексты, изображения, элементы дизайна, логотипы и иные материалы Сайта являются объектами интеллектуальной собственности. Копирование, распространение и использование материалов Сайта без письменного разрешения правообладателя запрещены.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">10. Ограничение ответственности</h2>
            <p>
              Администрация не несет ответственности за возможные убытки, возникшие в результате использования либо невозможности использования Сайта. Администрация не гарантирует бесперебойную работу Сайта и отсутствие технических ошибок.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">11. Изменения в политике</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда будет доступна на данной странице.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="font-display font-bold text-xl text-foreground mb-3">12. Контакты</h2>
            <p>
              По вопросам, касающимся персональных данных, обращайтесь к администрации ГРАВИКОТ через контакты, указанные в футере на Сайте.
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
