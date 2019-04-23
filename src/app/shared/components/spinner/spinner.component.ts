import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  show: boolean = false;
  private spinnerSubscription: Subscription;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerSubscription = this.spinnerService.spinnerState
      .subscribe((state) => {
          if (!isNullOrUndefined(state)) {
            this.show = state.show;
          }
        });
  }

  ngOnDestroy() {
    this.spinnerSubscription.unsubscribe();
  }

}
