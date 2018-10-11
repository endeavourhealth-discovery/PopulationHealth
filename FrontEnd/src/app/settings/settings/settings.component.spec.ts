import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import {CommonModule} from '@angular/common';
import {DialogsModule} from 'eds-angular4';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {By} from '@angular/platform-browser';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DialogsModule,
        NgbModule.forRoot()
      ],
      declarations: [ SettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 users', () => {
    expect(component.tableData.length).toBe(4);
  });

  it('should have enabled "Show dialog" button', () => {
    const btn: any = fixture.debugElement.query(By.css('#showDialog')).nativeElement;
    expect(btn.disabled).toBe(false);
  });
});
