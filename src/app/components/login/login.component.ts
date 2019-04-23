import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;

  readonly subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private snackBar: SnackbarService,
              private translate: TranslateService,
              private spinner: SpinnerService) {
    this.translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });

    this.subscriptions.add(this.authenticationService.logout());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  login(form: FormGroup) {
    this.spinner.show();
    if (form.valid) {
      this.subscriptions.add(this.authenticationService.login(form.value));
    } else {
      if (isNullOrUndefined(form.value.email) || form.value.email === '' ||
        isNullOrUndefined(form.value.password) || form.value.password === '') {
        this.snackBar.show(`messages.userDataEmpty`);
      } else {
        this.snackBar.show(`messages.userNotUpdated`);
      }
      this.spinner.hide();
    }
  }

}
