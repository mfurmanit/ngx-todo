import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { List } from '../model/list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private firestore: AngularFirestore) {
  }

  getLists(userId: string) {
    return this.firestore.doc(`users/${userId}`).collection('lists').snapshotChanges().pipe(map(lists => {
      return lists.map(list => {
        return {
          id: list.payload.doc.id,
          ...list.payload.doc.data()
        } as List;
      });
    }));
  }

  createList(userId: string, list: List) {
    delete list.id;
    return this.firestore.doc(`users/${userId}`).collection('lists').add(list);
  }

  updateList(userId: string, list: List) {
    const listId = list.id;
    delete list.id;
    this.firestore.doc(`users/${userId}/lists/${listId}`).update(list);
  }

  deleteList(userId: string, listId: string) {
    this.firestore.doc(`users/${userId}/lists/${listId}`).delete();
  }

}
