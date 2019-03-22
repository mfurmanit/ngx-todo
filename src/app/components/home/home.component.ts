import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { List } from 'src/app/shared/model/list';
import { Task } from 'src/app/shared/model/task';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  chosenList: List;
  lists: List[] = [];
  tasks: Task[] = [];
  tasks2: Task[] = [];

  constructor(private formBuilder: FormBuilder) { }

  loadChosenList(name: string): void {
    this.chosenList = this.lists.find(list => list.name === name);
  }

  ngOnInit() {
    this.initForm();
    const task = new Task("Zadanie testowe", false, false);
    const task2 = new Task("Zadanie testowe 2", true, false);
    const task3 = new Task("Zadanie testowe 3", false, true);
    this.tasks.push(task);
    this.tasks.push(task2);
    this.tasks.push(task3);
    this.tasks2.push(task3);
    const list = new List("Nazwa listy 1", this.tasks);
    const list2 = new List("Nazwa listy 2", this.tasks2);
    this.lists.push(list);
    this.lists.push(list2);
    this.chosenList = list;
    console.log(this.chosenList);
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      tasks: this.formBuilder.array([])
    });
  }

  initTaskFormGroup(name: string): FormGroup {
    return this.formBuilder.group({
      name: [name],
      isDone: [false],
      isPartiallyDone: [false]
    });
  }

}
