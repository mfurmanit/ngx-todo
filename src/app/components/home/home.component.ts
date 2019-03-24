import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { List } from 'src/app/shared/model/list';
import { Task } from 'src/app/shared/model/task';
import { ListsService } from 'src/app/shared/services/lists.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form: FormGroup;
  chosenListForm: FormGroup;
  lists: Observable<List[]>;

  constructor(private formBuilder: FormBuilder, private listService: ListsService) { }

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

  getFormArray(): any {
    const array = this.chosenListForm.get('tasks') as FormArray;
    return array.controls;
  }

  ngOnInit() {
    this.form = this.initForm();
    this.chosenListForm = this.initForm();
    this.lists = this.listService.getLists();
  }

  initForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
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
