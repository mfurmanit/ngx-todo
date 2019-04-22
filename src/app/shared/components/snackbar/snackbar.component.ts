import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({ bottom: '-100px', transform: 'translate(-50%, 0%) scale(0.3)' }),
        animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({
          transform: 'translate(-50%, 0%) scale(1)',
          opacity: 1,
          bottom: '50px'
        })),
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 1, 1)', style({
          transform: 'translate(-50%, 0%) scale(0.3)',
          opacity: 0,
          bottom: '-100px'
        }))
      ])
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy {

  private show = false;
  private message = 'Wystąpił błąd przy wyświetleniu wiadomości, skontaktuj się z administratorem!';
  private type = 'success';
  private snackbarSubscription: Subscription;
  private timer;

  constructor(private snackbarService: SnackbarService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
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
          this.message = this.translate.instant(state.message);
          if (this.show && state.show) {
            this.show = false;
            setTimeout(() => {
              this.show = true;
            }, 50);
            clearTimeout(this.timer);
          } else {
            this.show = state.show;
          }
          this.timer = setTimeout(() => {
            this.show = false;
          }, 3000);
        });
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }

}
