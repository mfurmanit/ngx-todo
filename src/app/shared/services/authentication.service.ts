import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

    login(username: string, password: string): void {
      const user = {
        username: username,
        password: password
      }

      localStorage.setItem('loggedUser', JSON.stringify(user));
    }

    logout(): void {
        localStorage.removeItem('loggedUser');
    }
}
