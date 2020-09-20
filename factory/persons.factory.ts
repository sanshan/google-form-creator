import {ExpertPerson, IBasePerson, IExpertPerson, SubjectPerson} from "../model/person";

interface PersonsSheetRow {
    fullName: string;
    email: string;
    position: string;
    pn: string;
    subdivision: string;
    manager: string;
    managerEmail: string;
    expert: string;
    expertEmail: string;
    isExternal: boolean;
    expertPosition: string;
    expertPN: string;
    expertSubdivision: string;
    expertManager: string;
    expertManagerEmail: string;
    group: string;
    isComplete: boolean;
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
        const [, , , , ...rows] = sheet.getDataRange().getValues().map(
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
        rows.map<IBasePerson & IExpertPerson>(({expert, expertEmail, expertPosition, expertPN, expertSubdivision, expertManager, isExternal}) => {
            const [surname, name, patronymic] = expert.split(' ');
            return {
                surname, name, patronymic,
                email: expertEmail,
                position: expertPosition,
                pn: expertPN,
                subdivision: expertSubdivision,
                manager: expertManager,
                isExternal
            }
        }).forEach((expertModel) => {

            if (!experts[expertModel.email]) experts[expertModel.email] = new ExpertPerson(expertModel);

            // Create Subjects
            rows.filter((row) => row.expert.trim() === experts[expertModel.email].fullName)
                .map(({fullName, email, position, pn, subdivision, manager, isComplete, group}) => {
                    const [surname, name, patronymic] = fullName.split(' ');
                    return {
                        surname, name, patronymic, email, position, pn, subdivision, manager, isComplete, group
                    }
                }).forEach((subjectModel) => {
                const {group, ...model} = subjectModel;
                if (!subjects[subjectModel.email]) subjects[subjectModel.email] = new SubjectPerson(model);
                subjects[subjectModel.email].addGroup(group);
                experts[expertModel.email].addSubject(subjects[subjectModel.email]);
            })

        })

        return {
            experts, subjects
        }

    }
}
