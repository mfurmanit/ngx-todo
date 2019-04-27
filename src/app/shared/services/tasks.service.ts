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

  getTasks(userId: string, listId: string): any {
    return this.firestore.doc(this.getListUrl(userId, listId)).collection('tasks').snapshotChanges().pipe(map(tasks => {
      return tasks.map(task => {
        return {
          id: task.payload.doc.id,
          ...task.payload.doc.data()
        } as Task;
      });
    }));
  }

  createTask(userId: string, listId: string, task: Task): any {
    delete task.id;
    return this.firestore.doc(this.getListUrl(userId, listId)).collection('tasks').add(task);
  }

  updateTask(userId: string, listId: string, task: Task): any {
    const taskId = task.id;
    delete task.id;
    return this.firestore.doc(this.getTaskUrl(userId, listId, taskId)).update(task);
  }

  deleteTask(userId: string, listId: string, taskId: string): any {
    return this.firestore.doc(this.getTaskUrl(userId, listId, taskId)).delete();
  }

  private getListUrl(userId: string, listId: string) {
    return `users/${userId}/lists/${listId}`;
  }

  private getTaskUrl(userId: string, listId: string, taskId: string) {
    return `users/${userId}/lists/${listId}/tasks/${taskId}`;
  }

}
