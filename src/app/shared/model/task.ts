export class Task {
    name?: string;
    isPartiallyDone?: boolean;
    isDone?: boolean;

    constructor(names: string, isPartiallyDones: boolean, isDones: boolean) {
        this.name = names;
        this.isPartiallyDone = isPartiallyDones;
        this.isDone = isDones;
    }
}