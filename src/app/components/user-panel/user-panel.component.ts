import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';

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
              private snackBar: SnackbarService) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.userId = this.authService.user.uid;
    this.subscriptions.add(this.authService.getUserInfo(this.userId).subscribe(user => {
      if (user.exists) {
        this.form.patchValue(user.data());
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  saveData(form: FormGroup): void {
    this.authService.saveUserInfo(this.userId, form.value);
    this.snackBar.show('Edycja usera przebiegła pomyślnie!');
  }

  private initFormGroup(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null],
      email: [null]
    });
  }

}
