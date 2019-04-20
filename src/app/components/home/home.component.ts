import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/shared/model/list';
import { Task } from 'src/app/shared/model/task';
import { ListsService } from 'src/app/shared/services/lists.service';
import { TasksService } from '../../shared/services/tasks.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listForm: FormGroup;
  taskForm: FormGroup;
  editTaskForm: FormGroup;
  chosenListForm: FormGroup;
  chosenList: List;
  chosenTask: Task;
  lists: List[];
  tasks: Task[];
  userId: string;
  isArchive: boolean;
  listsShown: boolean = true;
  tasksShown: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private listService: ListsService,
              private taskService: TasksService,
              private route: ActivatedRoute,
              private authService: AuthenticationService,
              private snackBar: SnackbarService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
  }

  ngOnInit() {
    this.subscribeToRouteParams();
    this.userId = this.authService.user.uid;
    this.listForm = this.initListFormGroup();
    this.chosenListForm = this.initListFormGroup();
    this.taskForm = this.initTaskFormGroup();
    this.listService.getLists(this.userId).subscribe(data => this.lists = data);
  }

  hideLists(): void {
    this.listsShown = !this.listsShown;
  }

  hideTasks(): void {
    this.tasksShown = !this.tasksShown;
  }

  loadChosenList(list: List): void {
    this.chosenListForm = this.initListFormGroup();
    this.chosenListForm.patchValue(list);
    this.chosenList = list;
    this.taskService.getTasks(this.userId, list.id).subscribe(data => this.tasks = data);
  }

  createList(form: FormGroup): void {
    this.listForm = this.initListFormGroup();
    if (form.valid) {
      this.listService.createList(this.userId, form.value);
      this.snackBar.show(this.translate.instant('messages.listCreated'));
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '') {
        this.snackBar.show('Nazwa listy nie może być pusta!');
      } else {
        this.snackBar.show('Wprowadzone dane są niepoprawne!');
      }
    }
  }

  updateList(form: FormGroup): void {
    if (form.valid) {
      this.listService.updateList(this.userId, form.value);
      this.snackBar.show('Edycja listy przebiegła pomyślnie!');
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '') {
        this.snackBar.show('Nazwa listy nie może być pusta!');
      } else {
        this.snackBar.show('Wprowadzone dane są niepoprawne!');
      }
    }
  }

  deleteList(form: FormGroup): void {
    this.listService.deleteList(this.userId, form.value.id).then(() => {
      this.lists = this.lists.filter(value => value.id !== form.value.id);
      this.snackBar.show('Wybrana lista została usunięta pomyślnie!');
      if (!isNullOrUndefined(this.lists) && this.lists.length > 0) {
        this.loadChosenList(this.lists[0]);
      } else {
        this.chosenList = null;
      }
    });
  }

  addTask(form: FormGroup): void {
    this.taskForm = this.initTaskFormGroup();
    if (form.valid) {
      this.taskService.createTask(this.userId, this.chosenList.id, form.value);
      this.snackBar.show('Nowe zadanie zostało dodane pomyślnie!');
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '') {
        this.snackBar.show('Nazwa zadania nie może być pusta!');
      } else {
        this.snackBar.show('Wprowadzone dane są niepoprawne!');
      }
    }
  }

  updateTask(task: Task, doneIcon: boolean): void {
    if (doneIcon) {
      task.isDone = !task.isDone;
    } else {
      task.isPartiallyDone = !task.isPartiallyDone;
    }

    this.taskService.updateTask(this.userId, this.chosenList.id, task);

    if (task.isDone) {
      this.snackBar.show('Zadanie zostało oznaczone jako wykonane i przeniesione do archiwum!');
    } else if (task.isPartiallyDone) {
      this.snackBar.show('Zadanie zostało oznaczone jako częściowo wykonane!');
    } else if (!task.isPartiallyDone) {
      this.snackBar.show('Cofnięto częściowe wykonanie zadania!');
    }
  }

  editTask(form: FormGroup): void {
    const task = this.chosenTask;
    task.name = form.value.name;

    if (form.valid) {
      this.taskService.updateTask(this.userId, this.chosenList.id, task);
      this.snackBar.show('Nazwa zadania została pomyślnie zaktualizowana!');
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '') {
        this.snackBar.show('Nazwa zadania nie może być pusta!');
      } else {
        this.snackBar.show('Wprowadzone dane są niepoprawne!');
      }
    }
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.userId, this.chosenList.id, this.chosenTask.id);
    this.snackBar.show('Zadanie zostało usunięte z listy!');
    this.chosenTask = null;
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

  initTaskEdition(task: Task): void {
    this.chosenTask = task;
    this.editTaskForm = this.initSimpleTaskFormGroup(task);
  }

  private subscribeToRouteParams(): void {
    this.route.params.subscribe(({isArchive}) => {
      this.isArchive = JSON.parse(isArchive);
    });
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

  initSimpleTaskFormGroup(task: Task): FormGroup {
    return this.formBuilder.group({
      id: [task.id],
      name: [task.name, Validators.required]
    });
  }

}
