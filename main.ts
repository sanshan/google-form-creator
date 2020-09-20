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
        .forEach(({pn, fullName, subjects}) => {
            const formTitle = `тестовый Опрос ${pn}_${fullName}`
            const form = FormApp.create(formTitle);

            const emailControl = form.addTextItem().setTitle('Адрес электронной почты');
            const emailValidation = FormApp.createTextValidation()
                .setHelpText('Вы ввели неправильный Email')
                .requireTextIsEmail()
                .build();

            emailControl
                .setRequired(true)
                .setHelpText('Это обязательный вопрос.')
                .setValidation(emailValidation);

            Object.keys(questions).map<Question>((key) => questions[key])
                .forEach((question) => {
                    form.addGridItem()
                        .setRequired(true)
                        .setTitle(question.text)
                        .setRows(subjects.map<string>(({fullName}) => fullName))
                        .setColumns(['1', '2', '3', '4', '5']);
                })

        })

}
