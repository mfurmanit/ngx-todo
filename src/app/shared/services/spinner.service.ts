import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSubject = new Subject<any>();
  public spinnerState = this.spinnerSubject.asObservable();

  constructor() {
  }

  show() {
    this.spinnerSubject.next({
      show: true
    });
  }

  hide() {
    this.spinnerSubject.next({
      show: false
    });
  }

}
