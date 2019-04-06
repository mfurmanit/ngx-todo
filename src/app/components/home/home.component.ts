import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { List } from 'src/app/shared/model/list';
import { Task } from 'src/app/shared/model/task';
import { ListsService } from 'src/app/shared/services/lists.service';
import { Observable } from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import { TasksService } from '../../shared/services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  taskForm: FormGroup;
  chosenListForm: FormGroup;
  chosenList;
  lists: Observable<List[]>;

  constructor(private formBuilder: FormBuilder, private listService: ListsService, private taskService: TasksService) { }

  loadChosenList(list: List): void {
    this.chosenListForm = this.initForm();
    this.chosenListForm.patchValue(list);
    const tasks = this.chosenListForm.get('tasks') as FormArray;
    list.tasks.forEach(task => {
      tasks.push(new FormControl(task));
    });
  }

  get f(): any {
    return this.form.controls;
  }

  createList(form: FormGroup): void {
    this.listService.createList(form.value);
  }

  updateList(form: FormGroup): void {
    this.listService.updateList(form.value);
  }

  deleteList(form: FormGroup): void {
    this.listService.deleteList(form.value.id);
  }

  addTask(form: FormGroup): void {
    const tasks = this.chosenListForm.get('tasks') as FormArray;
    tasks.push(form);
    this.taskForm = this.initTaskFormGroup();
    this.listService.updateList(this.chosenListForm.value);
  }

  getFormArray(): any {
    const array = this.chosenListForm.get('tasks') as FormArray;
    return array.controls;
  }

  ngOnInit() {
    this.form = this.initForm();
    this.chosenListForm = this.initForm();
    this.taskForm = this.initTaskFormGroup();
    this.lists = this.listService.getLists();
    // this.lists.subscribe(list => this.loadChosenList(list.filter(l => l.name != null)[0]));
    // this.lists.subscribe(list => {
    //   this.chosenList = list.filter(l => l.name != null)[0];
    //   this.loadChosenList(this.chosenList);
    // });
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      tasks: this.formBuilder.array([])
    });
  }

  log(): void {
    // this.taskService.up
    console.log('hi there!');
  }

  mouseEnter(event, task): void {
    event.srcElement.className = 'img-content-tick-full';
    console.log('entered!');
    console.log(event);
    console.log(task);
  }

  mouseLeave(event, task): void {
    if (!task.isDone) {
      event.srcElement.className = 'img-content-tick';
    }
    console.log('leaved!');
    console.log(event);
    console.log(task);
  }

  initTaskFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [null],
      isDone: [false],
      isPartiallyDone: [false]
    });
  }

}
