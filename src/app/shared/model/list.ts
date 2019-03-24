import { Task } from './task';

export class List {
    id?: string;
    name?: string;
    tasks?: Task[];

    constructor(names: string, taskss: Task[]) {
        this.id = null;
        this.name = names;
        this.tasks = taskss;
    }
}