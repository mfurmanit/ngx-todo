import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) {
  }

  getUserInfo(userId: string) {
    return this.firestore.collection('users').doc(userId).get();
  }

  saveUserInfo(userId: string, objectToSave: any) {
    return this.firestore.collection('users').doc(userId).update(objectToSave);
  }
}
