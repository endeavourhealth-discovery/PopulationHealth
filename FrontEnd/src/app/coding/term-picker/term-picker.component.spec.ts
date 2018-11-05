import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPickerComponent } from './term-picker.component';

describe('TermPickerComponent', () => {
  let component: TermPickerComponent;
  let fixture: ComponentFixture<TermPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
