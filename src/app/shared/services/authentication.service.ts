import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Credentials {
  email: string;
  password: string;
}

export interface UserInfo {
  email: string;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly authState$: Observable<User | null> = this.fireAuth.authState;

  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) {
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  getUserInfo(userId: string) {
    return this.firestore.collection('users').doc(userId).get();
  }

  saveUserInfo(userId: string, userInfo: UserInfo) {
    return this.user.updateEmail(userInfo.email).then(() => {
      this.firestore.collection('users').doc(userId).update(userInfo);
      console.log("it works!");
    });
  }

  login({email, password}: Credentials) {
    return this.fireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
    });
  }

  register({email, password}: Credentials, name?: string, surname?: string): any {
    return this.fireAuth.auth.createUserWithEmailAndPassword(email, password).then(data => {
      const userobject = {
        name,
        surname,
        email
      };
      console.log(data.user.uid);
      return this.firestore.collection('users').doc(data.user.uid).set(userobject)
        .then(() => console.log('dziala!'))
        .catch(error => console.log('error: ' + error))
        .finally(() => console.log('final'));
    });
  }

  logout() {
    return this.fireAuth.auth.signOut();
  }


}
