import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from './spinner.service';

export interface Credentials {
  email: string;
  password: string;
}

export interface UserInfo extends Credentials {
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly authState$: Observable<User | null> = this.fireAuth.authState;

  constructor(private fireAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router,
              private snackBar: SnackbarService,
              private spinner: SpinnerService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }

  getUserInfo(userId: string): any {
    return this.firestore.collection('users').doc(userId).get();
  }

  saveUserInfo(userId: string, userInfo: UserInfo) {
    this.user.updateEmail(userInfo.email)
      .then(() => this.firestore.collection('users').doc(userId).update(userInfo)
        .then(() => this.snackBar.show('messages.userUpdated')))
      .catch(() => this.snackBar.show('messages.userNotUpdated'))
      .finally(() => this.spinner.hide())
      .catch(() => this.snackBar.show('messages.userNotUpdated'))
      .finally(() => this.spinner.hide());
  }

  login(credentials: Credentials) {
    this.fireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return this.fireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() =>
        this.router.navigate(['dashboard', {isArchive: false}]))
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            this.snackBar.show('messages.wrongEmail');
          } else if (error.code === 'auth/wrong-password') {
            this.snackBar.show('messages.wrongPassword');
          } else if (error.code === 'auth/too-many-requests') {
            this.snackBar.show('messages.tooManyRequests');
          } else if (error.code === 'auth/user-not-found') {
            this.snackBar.show('messages.userNotFound');
          } else {
            this.snackBar.show('messages.loginError');
          }
        }).finally(() => this.spinner.hide());
    });
  }

  register(userInfo: UserInfo) {
    this.fireAuth.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password).then(data => {
      delete userInfo.password;
      return this.firestore.collection('users').doc(data.user.uid).set(userInfo)
        .then(() => {
          this.router.navigate(['login']);
          this.snackBar.show('messages.userCreated');
        })
        .catch(() => this.snackBar.show('messages.userNotCreated'))
        .finally(() => this.spinner.hide());
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        this.snackBar.show('messages.emailInUse');
      } else if (error.code === 'auth/weak-password') {
        this.snackBar.show('messages.weakPassword');
      } else {
        this.snackBar.show('messages.userNotCreated');
      }
    }).finally(() => this.spinner.hide());
  }

  logout(): any {
    return this.fireAuth.auth.signOut().then(() => this.router.navigate(['login']));
  }


}
