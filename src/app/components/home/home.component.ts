import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/shared/model/list';
import { Task } from 'src/app/shared/model/task';
import { ListsService } from 'src/app/shared/services/lists.service';
import { Observable } from 'rxjs/internal/Observable';
import { TasksService } from '../../shared/services/tasks.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listForm: FormGroup;
  taskForm: FormGroup;
  chosenListForm: FormGroup;
  chosenList: List;
  lists: Observable<List[]>;
  tasks: Observable<Task[]>;

  constructor(private formBuilder: FormBuilder,
              private listService: ListsService,
              private taskService: TasksService,
              private snackBar: SnackbarService) {
  }

  ngOnInit() {
    this.listForm = this.initListFormGroup();
    this.chosenListForm = this.initListFormGroup();
    this.taskForm = this.initTaskFormGroup();
    this.lists = this.listService.getLists();
  }

  loadChosenList(list: List): void {
    this.chosenListForm = this.initListFormGroup();
    this.chosenListForm.patchValue(list);
    this.chosenList = list;
    this.tasks = this.taskService.getTasks(list.id);
  }

  get f(): any {
    return this.listForm.controls;
  }

  createList(form: FormGroup): void {
    this.listForm = this.initListFormGroup();
    this.listService.createList(form.value);
    this.snackBar.show('Nowa lista została utworzona pomyślnie!');
  }

  updateList(form: FormGroup): void {
    this.listService.updateList(form.value);
    this.snackBar.show('Edycja listy przebiegła pomyślnie!');
  }

  deleteList(form: FormGroup): void {
    this.listService.deleteList(form.value.id);
    this.snackBar.show('Wybrana lista została usunięta pomyślnie!');
  }

  addTask(form: FormGroup): void {
    this.taskForm = this.initTaskFormGroup();
    this.taskService.createTask(this.chosenList.id, form.value);
    this.snackBar.show('Nowe zadanie zostało dodane pomyślnie!');
  }

  updateTask(task: Task, doneIcon: boolean): void {
    if (doneIcon) {
      task.isDone = !task.isDone;
    } else {
      task.isPartiallyDone = !task.isPartiallyDone;
    }

    this.taskService.updateTask(this.chosenList.id, task);
    this.snackBar.show('Edycja zadania przebiegła pomyślnie!');
  }

  onMouseEnter(event, task: Task, doneIcon: boolean): void {
    if (doneIcon) {
      event.target.className = 'tick-full';
    } else {
      event.target.className = 'yellow-tick-full';
    }
  }

  onMouseLeave(event, task: Task, doneIcon: boolean): void {
    if (doneIcon && !task.isDone) {
      event.target.className = 'tick';
    } else if (!doneIcon && !task.isPartiallyDone) {
      event.target.className = 'yellow-tick';
    }
  }

  private initListFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, Validators.required]
    });
  }

  private initTaskFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      isDone: [false],
      isPartiallyDone: [false]
    });
  }

}
