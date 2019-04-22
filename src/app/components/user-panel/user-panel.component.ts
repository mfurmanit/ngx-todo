import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit, OnDestroy {

  form: FormGroup;
  userId: string;

  readonly subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              private snackBar: SnackbarService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
  }

  ngOnInit() {
    this.initFormGroup();
    this.userId = this.authService.user.uid;
    this.subscriptions.add(this.authService.getUserInfo(this.userId)
      .subscribe(user => user.exists ? this.form.patchValue(user.data()) : this.snackBar.show('messages.userNotFound')));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveData(form: FormGroup): void {
    if (form.valid) {
      this.subscriptions.add(this.authService.saveUserInfo(this.userId, form.value));
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '' ||
        isNullOrUndefined(form.value.surname) || form.value.surname === '' ||
        isNullOrUndefined(form.value.email) || form.value.email === '') {
        this.snackBar.show(`messages.userDataEmpty`);
      } else {
        this.snackBar.show(`messages.userNotUpdated`);
      }
    }
  }

  private initFormGroup(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, Validators.required]
    });
  }

}
