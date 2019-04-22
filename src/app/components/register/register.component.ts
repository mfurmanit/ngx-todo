import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { isNullOrUndefined } from 'util';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;

  readonly subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private snackBar: SnackbarService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      name: [null, Validators.required],
      surname: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  register(form: FormGroup) {
    if (form.valid) {
      this.subscriptions.add(this.authenticationService.register(form.value));
    } else {
      if (isNullOrUndefined(form.value.name) || form.value.name === '' ||
        isNullOrUndefined(form.value.surname) || form.value.surname === '' ||
        isNullOrUndefined(form.value.email) || form.value.email === '' ||
        isNullOrUndefined(form.value.password) || form.value.password === '') {
        this.snackBar.show(`messages.userDataEmpty`);
      } else {
        this.snackBar.show(`messages.userNotUpdated`);
      }
    }
  }

}
