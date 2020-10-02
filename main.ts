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
            const formTitle = `тестовый Опрос ${pn}_${fullName}`
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
                        .setColumns(['1', '2', '3', '4', '5', 'Затрудняюсь ответить']);
                })

            const publishedUrl = form.getPublishedUrl();
            const htmlBody = `
                <div>
                    <h1>Для Вас создан опрос!</h1>
                    <p>Сссылка: <b>${publishedUrl}</b></p>
                </div>
            `;

            GmailApp.sendEmail(email, 'Для Вас создан опрос!', '', {htmlBody})

        })

}
