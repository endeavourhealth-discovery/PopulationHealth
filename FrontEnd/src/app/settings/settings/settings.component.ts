import { Component, OnInit } from '@angular/core';
import {LoggerService, MessageBoxDialog} from 'eds-angular4';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SettingsService} from './settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-record-viewer',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  tableData: any[] = [
    {id: 1, name: 'John Smith', description: 'Senior consultant'},
    {id: 2, name: 'Jane Doe', description: 'General practitioner'},
    {id: 3, name: 'Dave Jones', description: 'Hospital porter'},
    {id: 4, name: 'Doris Jackson', description: 'Surgery receptionist'}
  ];

  selection: any = this.tableData[2];
  message: string;

  constructor(private modal: NgbModal,
              private router: Router,
              private service: SettingsService,
              private log: LoggerService) { }

  ngOnInit() {
  }

  getMessage() {
    this.log.info('Getting message');
    this.service.getMessage('Fred')
      .subscribe(
        (result) => this.message = result,
        (error) => this.log.error(error)
      )
  }

  conceptSelector() {
//    ConceptSelectorComponent.open(this.modal);
  }

  showDialog() {
    MessageBoxDialog.open(this.modal, 'Delete user', 'Are you sure that you want to delete this user?', 'Delete user', 'Cancel');
  }

  showQueryEditor() {
    this.router.navigate(['query', 'add', ''])
  }
}
