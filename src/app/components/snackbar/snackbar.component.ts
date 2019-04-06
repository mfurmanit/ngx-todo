import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})

export class SnackbarComponent implements OnInit, OnDestroy {

  private show = false;
  private message = 'Wystąpił błąd przy wyświetleniu wiadomości, skontaktuj się z administratorem!';
  private type = 'success';
  private snackbarSubscription: Subscription;

  constructor(private snackbarService: SnackbarService) {
  }

  ngOnInit() {
    this.snackbarSubscription = this.snackbarService.snackbarState
      .subscribe(
        (state) => {
          if (state.type) {
            this.type = state.type;
          } else {
            this.type = 'success';
          }
          this.message = state.message;
          this.show = state.show;
          setTimeout(() => {
            this.show = false;
          }, 3000);
        });
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }

}
