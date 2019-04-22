import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { isNullOrUndefined } from 'util';
import { SnackbarService } from '../../services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isArchive: boolean = false;
  buttonsShown: boolean = true;

  @Output() hideLists = new EventEmitter();
  @Output() hideTasks = new EventEmitter();

  constructor(private router: Router,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private snackBar: SnackbarService,
              private translate: TranslateService) {
    this.translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.buttonsShown = this.router.url !== '/user-panel';

    this.route.params.subscribe(({isArchive}) => {
      if (!isNullOrUndefined(isArchive)) {
        this.isArchive = JSON.parse(isArchive);
      }
    });
  }

  logout(): void {
    this.authService.logout()
      .then(() => this.snackBar.show('messages.logoutSuccess'))
      .catch(() => this.snackBar.show('messages.logoutError'));
  }

}
