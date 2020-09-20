export type RowType = 'category' | 'section' | 'question';

export class Question {
    private _id: string;
    private _number: number | null;
    private _text: string | null;
    private _category: Element;
    private _section: Element;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get number(): number | null {
        return this._number;
    }

    set number(value: number | null) {
        this._number = value;
    }

    get text(): string | null {
        return this._text;
    }

    set text(value: string | null) {
        this._text = value;
    }

    get category(): Element {
        return this._category;
    }

    set category(value: Element) {
        this._category = value;
    }

    get section(): Element {
        return this._section;
    }

    set section(value: Element) {
        this._section = value;
    }

    constructor(id: string, number: number, text: string, category: Element, section: Element) {
        this._id = id;
        this._number = number;
        this._text = text;
        this._category = category;
        this._section = section;
    }

}

export class Element {
    private _id: string;
    private _name: string;
    private _type: RowType;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    constructor(id: string, name: string, type: RowType) {
        this._id = id;
        this._name = name;
        this._type = type;
    }

}

