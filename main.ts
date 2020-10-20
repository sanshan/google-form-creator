import QuestionsFactory from "./factory/question.factory";
import PersonsFactory from "./factory/persons.factory";
import {Question} from "./model/question";

function main() {
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

    const sheetWithQuestions = sheets[0] || null;
    const sheetWithPersons = sheets[1] || null;

    const {questions} = QuestionsFactory.fromSheet(sheetWithQuestions);
    const {experts} = PersonsFactory.fromSheet(sheetWithPersons);


    Object.keys(experts).map((key) => experts[key])
        .forEach(({pn, fullName, subjects, email}) => {
            const formTitle = `Опрос ${fullName}`
            const form = FormApp.create(formTitle);

            const emailValidation = FormApp.createTextValidation()
                .setHelpText('Вы ввели неправильный Email')
                .requireTextIsEmail()
                .build();

            form.addTextItem()
                .setTitle('Адрес электронной почты')
                .setRequired(true)
                .setHelpText('Это обязательный вопрос.')
                .setValidation(emailValidation);

            Object.keys(questions).map<Question>((key) => questions[key])
                .forEach((question) => {
                    form.addGridItem()
                        .setRequired(true)
                        .setTitle(question.text)
                        .setRows(subjects.map<string>(({fullName}) => fullName) || [])
                        .setColumns(['1', '2', '3', '4', '5', 'Не могу оценить']);
                })

            const publishedUrl = form.getPublishedUrl();

            const htmlBody = `
            <div>
                <p>
                    Уважаемый коллега!<br>
                    Вы получили это письмо, потому что являетесь экспертом по системе оценки 360 градусов.<br>
                    Сегодня мы приступаем к <strong>этапу непосредственной оценки себя и сотрудников</strong>.<br>
                    Этап предоставления обратной связи продлится до 01 ноября.<br>
                    Для ответа на вопросы пройдите по ссылке ниже:<br>
                    ${publishedUrl}
                </p>
                <p>
                    <span style="font-size: 1.7rem">Внимательно ознакомьтесь с инструкцией перед заполнением:</span>
                </p>
                <p>
                    Открываем ссылку в браузере <strong>Google Chrome</strong>
                </p>
                <p>
                    Выделите на опрос необходимое количество времени (из расчета примерно 5 минут на одного сотрудника), чтобы вас никто не отвлекал, была тихая и спокойная обстановка, стабильный Интернет.<br>
                    Если Вам необходимо прерваться, НЕ ЗАКРЫВАЙТЕ(!) вкладку браузера с опросом, иначе все ответы пропадут.<br>
                </p>
                <p>
                    При обновлении страницы через кнопку "Обновить страницу" данные так же обнулятся.<br>
                    Пожалуйста, будьте максимально честны и открыты, не завышайте, но и не занижайте свои ответы.<br>
                    Пропустить вопрос нельзя! Нужно проставить в каждом вопросе оценку всем оцениваемым сотрудникам.<br>
                </p>
                
                <p> 
                    По завершению опроса нажмите кнопку отправить
                </p>                
                <p> 
                    Для оценки Вы можете выбрать баллы от 1 до 5 или вариант "не могу оценить", где:
                </p>
                <ul>
                    <li><strong>«Не могу оценить»</strong> – когда вы не имели достаточного опыта взаимодействия с сотрудником для оценки этой компетенции;</li>
                    <li><strong>«1»</strong> – очень редко демонстрирует;</li>
                    <li><strong>«2»</strong> – иногда демонстрирует;</li>
                    <li><strong>«3»</strong> – часто демонстрирует;</li>
                    <li><strong>«4»</strong> – практически всегда демонстрирует;</li>
                    <li><strong>«5»</strong> – является ролевой моделью.</li>
                </ul>

                <p>
                    <strong>Заранее благодарим вас за время, которое вы посвятите предоставлению обратной связи – это очень ценно для ваших коллег!</strong><br>
                    На связи всегда наша команда поддержки:<br>
                    Ольга Нилова (Скандинавия/Ава-Петер) +7 (921)918 95 66<br>
                    Эльвира Бойко (Севергрупп Медицина) +7 (921) 448 92 29
                </p>
                
            </div>
            `;

            GmailApp.sendEmail(email, 'Обратная связь 360', '', {htmlBody})

        })

}
