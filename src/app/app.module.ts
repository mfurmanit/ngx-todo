import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { HomeComponent } from './components/home/home.component';
import { environment } from 'src/environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { ListsService } from './shared/services/lists.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { SnackbarService } from './shared/services/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SnackbarComponent,
    NavbarComponent,
    UserPanelComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [UserService, AngularFirestore, ListsService, SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
