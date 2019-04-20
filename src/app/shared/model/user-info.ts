import { List } from './list';

export class UserInfo {
  id?: string;
  name?: string;
  surname?: string;
  email?: string;
  lists?: List[];

  constructor(id: string, name: string, surname: string, email: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}
