import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryPickerComponent } from './query-picker.component';

describe('QueryPickerComponent', () => {
  let component: QueryPickerComponent;
  let fixture: ComponentFixture<QueryPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
