import { Task } from './task';

export class List {
  id?: string;
  name?: string;
  tasks?: Task[];

  constructor(id: string, names: string, tasks: Task[]) {
    this.id = id;
    this.name = names;
    this.tasks = tasks;
  }
}
