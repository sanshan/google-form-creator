export interface IBasePerson {
    name: string;
    patronymic: string;
    surname: string;
    email: string;
    position: string;
    pn: string;
    subdivision: string;
    manager: string;
    groups?: string[];
}

export interface ISubjectPerson {
    isComplete: boolean;
}

export interface IExpertPerson {
    isExternal: boolean;
    subjects?: SubjectPerson[];
}

export class Person implements IBasePerson {
    private _name: string;
    private _patronymic: string;
    private _surname: string;
    private _email: string;
    private _position: string;
    private _pn: string;
    private _subdivision: string;
    private _manager: string;
    private _groups: string[] = [];

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get patronymic(): string {
        return this._patronymic;
    }

    set patronymic(value: string) {
        this._patronymic = value;
    }

    get surname(): string {
        return this._surname;
    }

    set surname(value: string) {
        this._surname = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get position(): string {
        return this._position;
    }

    set position(value: string) {
        this._position = value;
    }

    get pn(): string {
        return this._pn;
    }

    set pn(value: string) {
        this._pn = value;
    }

    get subdivision(): string {
        return this._subdivision;
    }

    set subdivision(value: string) {
        this._subdivision = value;
    }

    get manager(): string {
        return this._manager;
    }

    set manager(value: string) {
        this._manager = value;
    }

    get groups(): string[] {
        return this._groups;
    }

    set groups(value: string[]) {
        this._groups = value;
    }

    get fullName(): string {
        return this._surname + ' ' + this._name + ' ' + this._patronymic;
    }

    constructor(person: IBasePerson) {
        this._name = person.name;
        this._patronymic = person.patronymic;
        this._surname = person.surname;
        this._email = person.email;
        this._position = person.position;
        this._pn = person.pn;
        this._subdivision = person.subdivision;
        this._manager = person.manager;
    }

    addGroup(groupName: string): Person {
        if (this._groups.indexOf(groupName) === -1)
            this._groups = [...this._groups, groupName];

        return this;
    }

}

export class SubjectPerson extends Person implements ISubjectPerson {
    private _isComplete: boolean;
    get isComplete(): boolean {
        return this._isComplete;
    }

    set isComplete(value: boolean) {
        this._isComplete = value;
    }

    constructor({isComplete, ...args}: IBasePerson & ISubjectPerson) {
        super(args);
        this._isComplete = isComplete;
    }
}

export class ExpertPerson extends Person implements IExpertPerson {
    private _isExternal: boolean;
    private _subjects: SubjectPerson[] = [];

    get isExternal(): boolean {
        return this._isExternal;
    }

    set isExternal(value: boolean) {
        this._isExternal = value;
    }

    get subjects(): SubjectPerson[] {
        return this._subjects;
    }

    set subjects(value: SubjectPerson[]) {
        this._subjects = value;
    }

    constructor({isExternal, ...args}: IBasePerson & IExpertPerson) {
        super(args);
        this._isExternal = isExternal;
    }

    addSubject(subject: SubjectPerson): ExpertPerson {
        if (!this._subjects.filter((s) => s.email === subject.email).length)
            this._subjects = [...this._subjects, subject];

        return this;
    }

}

