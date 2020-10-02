import {ExpertPerson, SubjectPerson} from "../model/person";

interface PersonsSheetRow {
    fullName?: string;
    email?: string;
    position?: string;
    pn?: string;
    subdivision?: string;
    manager?: string;
    managerEmail?: string;
    expert?: string;
    expertEmail?: string;
    isExternal?: boolean;
    expertPosition?: string;
    expertPN?: string;
    expertSubdivision?: string;
    expertManager?: string;
    expertManagerEmail?: string;
    group?: string;
    isComplete?: boolean;
}

export default class PersonsFactory {
    static fromSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): {
        experts: {
            [key: string]: ExpertPerson
        },
        subjects: {
            [key: string]: SubjectPerson
        }
    } {
        const [, , , ...rows] = sheet.getDataRange().getValues().map(
            ([fullName, email, position, pn, subdivision, manager, managerEmail, expert, expertEmail, isExternal,
                 expertPosition, expertPN, expertSubdivision, expertManager, expertManagerEmail, group, isComplete]) => ({
                fullName, email, position, pn, subdivision, manager, managerEmail, expert, expertEmail, isExternal,
                expertPosition, expertPN, expertSubdivision, expertManager, expertManagerEmail, group,
                isComplete: isComplete !== 'нет'
            })
        ) as PersonsSheetRow[];

        let experts: {
            [key: string]: ExpertPerson
        } = {}

        let subjects: {
            [key: string]: SubjectPerson
        } = {}

        // Create Experts
        rows.forEach(({expert, expertEmail, expertPosition, expertPN, expertSubdivision, expertManager, isExternal}) => {

            if (!experts[expertEmail]) {
                const [surname, name, patronymic] = expert.split(' ');
                experts[expertEmail] = new ExpertPerson({
                    surname, name, patronymic,
                    email: expertEmail,
                    position: expertPosition,
                    pn: expertPN,
                    subdivision: expertSubdivision,
                    manager: expertManager,
                    isExternal
                })

                // Create Subjects
                rows.forEach(({fullName, email, position, pn, subdivision, manager, isComplete, group}) => {

                    if (!subjects[email]) {
                        const [surname, name, patronymic] = fullName.split(' ');
                        subjects[email] = new SubjectPerson({
                            surname,
                            name,
                            patronymic,
                            email,
                            position,
                            pn,
                            subdivision,
                            manager,
                            isComplete
                        });
                    }

                    subjects[email].addGroup(group);
                    experts[expertEmail].addSubject(subjects[email]);

                })
            }
        });

        return {
            experts, subjects
        }

    }
}
