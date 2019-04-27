export class Task {
  id?: string;
  name?: string;
  isPartiallyDone?: boolean;
  isDone?: boolean;

  constructor(id: string, name: string, isPartiallyDone: boolean, isDone: boolean) {
    this.id = id;
    this.name = name;
    this.isPartiallyDone = isPartiallyDone;
    this.isDone = isDone;
  }
}
