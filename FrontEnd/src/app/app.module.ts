import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng2-toastr';
import {KeycloakService} from 'eds-angular4/dist/keycloak/keycloak.service';
import {keycloakHttpFactory} from 'eds-angular4/dist/keycloak/keycloak.http';
import {Http, HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import {LayoutComponent} from 'eds-angular4/dist/layout/layout.component';
import {LayoutModule, AbstractMenuProvider, UserManagerNotificationService, DialogsModule, LoggerModule} from 'eds-angular4';
import {AppMenuService} from './app-menu.service';
import {SettingsModule} from './settings/settings.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModuleStateService} from 'eds-angular4/dist/common';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,

    LayoutModule,
    LoggerModule,
    DialogsModule,

    SettingsModule,

    RouterModule.forRoot(AppMenuService.getRoutes(), {useHash: true}),
    NgbModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    KeycloakService,
    ModuleStateService,
    { provide: AbstractMenuProvider, useClass : AppMenuService },
    { provide: Http, useFactory: keycloakHttpFactory, deps: [XHRBackend, RequestOptions, KeycloakService, AbstractMenuProvider, UserManagerNotificationService] }
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
