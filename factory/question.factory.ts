import {Question, RowType, Element} from "../model/question";

export default class QuestionsFactory {
    static fromSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): {
        questions: {
            [key: number]: Question
        }
    } {
        if (!sheet) return;

        const flag = '.';
        const [, ...valuesWithoutTitle] = sheet.getDataRange().getValues();
        valuesWithoutTitle.pop();

        let elements: {
            [key: number]: Element
        } = {};

        let questions: {
            [key: number]: Question
        } = {};

        function getPart(str: string, idx: number, part: 'number'): number | null;
        function getPart(str: string, idx: number, part: 'text'): string | null;

        function getPart(str: string, idx: number, part: any): any | null {
            if (idx === -1) return null;
            const [number, ...text] = str.split(flag);
            if (part === 'text') return text.join(' ').trim();
            return parseInt(number);
        }

        let category: Element;
        let section: Element;

        valuesWithoutTitle.forEach((row, index, values) => {
            const str = row[0].trim();
            const idx = str.indexOf(flag);

            if (idx === -1) {
                const type: RowType = (!!values[index + 1] && !!values[index + 1][0] && values[index + 1][0].indexOf(flag) === -1) ?
                    "category" : "section";
                elements = {
                    ...elements,
                    [index]: new Element(index.toString(), row[0], type)
                }
            } else {
                category = (!!elements[index - 2] && !!elements[index - 1]) ? elements[index - 2] : category;
                section = !!elements[index - 1] ? elements[index - 1] : section;

                questions = {
                    ...questions,
                    [index]: new Question(
                        index.toString(),
                        getPart(str, idx, "number"),
                        getPart(str, idx, "text"),
                        category,
                        section
                    )
                }
            }

        })

        return {questions};
    }
}
