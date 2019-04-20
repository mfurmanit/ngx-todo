import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private firestore: AngularFirestore) {
  }

  getTasks(userId: string, listId: string) {
    return this.firestore.doc(`users/${userId}/lists/${listId}`).collection('tasks').snapshotChanges().pipe(map(tasks => {
      return tasks.map(task => {
        return {
          id: task.payload.doc.id,
          ...task.payload.doc.data()
        } as Task;
      });
    }));
  }

  createTask(userId: string, listId: string, task: Task) {
    delete task.id;
    return this.firestore.doc(`users/${userId}/lists/${listId}`).collection('tasks').add(task);
  }

  updateTask(userId: string, listId: string, task: Task): any {
    const taskId = task.id;
    delete task.id;
    this.firestore.doc(`users/${userId}/lists/${listId}/tasks/${taskId}`).update(task);
  }

  deleteTask(userId: string, listId: string, taskId: string) {
    this.firestore.doc(`users/${userId}/lists/${listId}/tasks/${taskId}`).delete();
  }
}
