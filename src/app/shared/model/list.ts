import { Task } from './task';

export class List {
  id?: string;
  name?: string;
  tasks?: Task[];

  constructor(names: string, tasks: Task[]) {
    this.id = null;
    this.name = names;
    this.tasks = tasks;
  }
}
