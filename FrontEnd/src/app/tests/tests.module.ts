import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestEditorComponent } from './test-editor/test-editor.component';
import {FormsModule} from '@angular/forms';
import {CodingModule} from '../coding/coding.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CodingModule
  ],
  declarations: [TestEditorComponent],
  entryComponents: [TestEditorComponent]
})
export class TestsModule { }
