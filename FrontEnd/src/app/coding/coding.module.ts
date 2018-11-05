import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermPickerComponent } from './term-picker/term-picker.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ControlsModule} from 'eds-angular4/dist/controls';
import {TreeModule} from 'angular-tree-component';
import {TermService} from './term.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ControlsModule,
    TreeModule
  ],
  declarations: [TermPickerComponent],
  entryComponents: [TermPickerComponent],
  providers: [TermService]
})
export class CodingModule { }
