import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { QueryPickerComponent } from './query-picker/query-picker.component';
import {FlowchartModule} from '../flowchart/flowchart.module';
import {FormsModule} from '@angular/forms';
import {LibraryModule} from 'eds-angular4/dist/library';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FolderModule} from 'eds-angular4/dist/folder';
import {TestsModule} from '../tests/tests.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    NgbModule,

    FlowchartModule,
    LibraryModule,
    FolderModule,
    TestsModule
  ],
  declarations: [QueryEditorComponent, QueryPickerComponent],
  entryComponents: [QueryPickerComponent]
})
export class QueryModule { }
