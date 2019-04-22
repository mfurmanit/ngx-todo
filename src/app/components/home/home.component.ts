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
import { Subscription } from 'rxjs';

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
  isArchive: boolean = false;
  listsShown: boolean = true;
  tasksShown: boolean = true;

  readonly subscriptions = new Subscription();

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
    this.subscriptions.add(this.listService.getLists(this.userId).subscribe(data => this.lists = data));
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
    this.subscriptions.add(this.taskService.getTasks(this.userId, list.id).subscribe(data => this.tasks = data));
  }

  refreshList(): void {
    if (!isNullOrUndefined(this.lists) && this.lists.length > 0) {
      this.loadChosenList(this.lists[0]);
    } else {
      this.chosenList = null;
    }
  }

  createList(form: FormGroup): void {
    this.listForm = this.initListFormGroup();
    if (form.valid) {
      this.subscriptions.add(this.listService.createList(this.userId, form.value)
        .then(() => this.snackBar.show('messages.listCreated'))
        .catch(() => this.snackBar.show('messages.listNotCreated')));
    } else {
      this.showError(form, 'list', 'Created');
    }
  }

  updateList(form: FormGroup): void {
    if (form.valid) {
      this.subscriptions.add(this.listService.updateList(this.userId, form.value)
        .then(() => this.snackBar.show('messages.listEdited'))
        .catch(() => this.snackBar.show('messages.listNotEdited')));
    } else {
      this.showError(form, 'list', 'Edited');
    }
  }

  deleteList(form: FormGroup): void {
    this.subscriptions.add(this.listService.deleteList(this.userId, form.value.id)
      .then(() => {
        this.lists = this.lists.filter(value => value.id !== form.value.id);
        this.refreshList();
        this.snackBar.show('messages.listDeleted');
      }).catch(() => this.snackBar.show('messages.listNotDeleted')));
  }

  private showError(form: FormGroup, prefix: string, suffix: string): void {
    if (isNullOrUndefined(form.value.name) || form.value.name === '') {
      this.snackBar.show(`messages.${prefix}NameEmpty`);
    } else {
      this.snackBar.show(`messages.${prefix}Not${suffix}`);
    }
  }

  addTask(form: FormGroup): void {
    this.taskForm = this.initTaskFormGroup();
    if (form.valid) {
      this.subscriptions.add(this.taskService.createTask(this.userId, this.chosenList.id, form.value)
        .then(() => this.snackBar.show('messages.taskCreated'))
        .catch(() => this.snackBar.show('messages.taskNotCreated')));
    } else {
      this.showError(form, 'task', 'Created');
    }
  }

  updateTask(task: Task, doneIcon: boolean): void {
    if (doneIcon) {
      task.isDone = !task.isDone;
    } else {
      task.isPartiallyDone = !task.isPartiallyDone;
    }

    this.subscriptions.add(this.taskService.updateTask(this.userId, this.chosenList.id, task).then(() => {
      if (task.isDone) {
        this.snackBar.show('messages.taskDone');
      } else if (task.isPartiallyDone) {
        this.snackBar.show('messages.taskPartiallyDone');
      } else if (!task.isPartiallyDone) {
        this.snackBar.show('messages.taskUndone');
      }
    }).catch(() => this.snackBar.show('messages.taskNotMarked')));
  }

  editTask(form: FormGroup): void {
    const task = this.chosenTask;
    task.name = form.value.name;

    if (form.valid) {
      this.subscriptions.add(this.taskService.updateTask(this.userId, this.chosenList.id, task)
        .then(() => this.snackBar.show('messages.taskEdited'))
        .catch(() => this.snackBar.show('messages.taskNotEdited')));
    } else {
      this.showError(form, 'task', 'Edited');
    }
  }

  deleteTask(): void {
    this.subscriptions.add(this.taskService.deleteTask(this.userId, this.chosenList.id, this.chosenTask.id)
      .then(() => {
        this.chosenTask = null;
        this.snackBar.show('messages.taskDeleted');
      }).catch(() => this.snackBar.show('messages.taskNotDeleted')));
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

  private initSimpleTaskFormGroup(task: Task): FormGroup {
    return this.formBuilder.group({
      id: [task.id],
      name: [task.name, Validators.required]
    });
  }

}
