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

  getTasks(listId: string) {
    return this.firestore.doc('lists/' + listId).collection('tasks').snapshotChanges().pipe(map(tasks => {
      return tasks.map(task => {
        return {
          id: task.payload.doc.id,
          ...task.payload.doc.data()
        } as Task;
      });
    }));
  }

  createTask(listId: string, task: Task) {
    delete task.id;
    return this.firestore.doc('lists/' + listId).collection('tasks').add(task);
  }

  updateTask(listId: string, task: Task): any {
    const id = task.id;
    delete task.id;
    this.firestore.doc('lists/' + listId + '/tasks/' + id).update(task);
  }

  deleteTask(listId: string, taskId: string) {
    this.firestore.doc('lists/' + listId + '/tasks/' + taskId).delete();
  }
}
