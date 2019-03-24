export class Task {
    id?: string;
    name?: string;
    isPartiallyDone?: boolean;
    isDone?: boolean;

    constructor(names: string, isPartiallyDones: boolean, isDones: boolean) {
        this.id = null;
        this.name = names;
        this.isPartiallyDone = isPartiallyDones;
        this.isDone = isDones;
    }
}