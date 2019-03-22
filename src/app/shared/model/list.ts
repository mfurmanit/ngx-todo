import { Task } from './task';

export class List {
    name?: string;
    tasks?: Task[];

    constructor(names: string, taskss: Task[]) {
        this.name = names;
        this.tasks = taskss;
    }
}