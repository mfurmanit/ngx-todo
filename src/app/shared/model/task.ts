export class Task {
  id?: string;
  name?: string;
  isPartiallyDone?: boolean;
  isDone?: boolean;

  constructor(names: string, isPartiallyDone: boolean, isDone: boolean) {
    this.id = null;
    this.name = names;
    this.isPartiallyDone = isPartiallyDone;
    this.isDone = isDone;
  }
}
