import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { List } from '../model/list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private firestore: AngularFirestore) { }

  getLists() {
    return this.firestore.collection('lists').snapshotChanges().pipe(map(lists => {
      return lists.map(list => {
        return {
          id: list.payload.doc.id,
          ...list.payload.doc.data()
        } as List
      });
    }));
  }

  createList(list: List) {
    delete list.id;
    return this.firestore.collection('lists').add(list);
  }

  updateList(list: List) {
    const id = list.id;
    delete list.id;
    this.firestore.doc('lists/' + id).update(list);
  }

  deleteList(listId: string) {
    this.firestore.doc('lists/' + listId).delete();
  }
}
