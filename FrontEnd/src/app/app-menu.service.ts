import {Injectable} from '@angular/core';
import {AbstractMenuProvider} from 'eds-angular4';
import {MenuOption} from 'eds-angular4/dist/layout/models/MenuOption';
import {SettingsComponent} from './settings/settings/settings.component';
import {Routes} from '@angular/router';

@Injectable()
export class AppMenuService implements  AbstractMenuProvider {
  static getRoutes(): Routes {
    return [
      { path: '', redirectTo : 'skeleton', pathMatch: 'full' }, // Default route
      {path: 'skeleton', component: SettingsComponent}
    ];
  }
  getApplicationTitle(): string {
    return 'Skeleton tool';             // TODO: Tool title
  }

  getClientId(): string {
    return 'eds-user-manager';          // TODO: Client id
  }

  useUserManagerForRoles(): boolean {
    return false;
  }

  getMenuOptions(): MenuOption[] {
    return [
      {caption: 'Skeleton module', state: 'skeleton', icon: 'fa fa-user', role: 'eds-user-manager:user-manager'},
      {caption: 'Configuration', state: 'config', icon: 'fa fa-cogs', role: 'eds-user-manager:user-manager'},
      {caption: 'Delegation', state: 'config', icon: 'fa fa-group', role: 'eds-user-manager:user-manager'},
      {caption: 'Audit', state: 'config', icon: 'fa fa-list', role: 'eds-user-manager:user-manager'}
    ];
  }
}
