import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {QuerySelection} from '../models/QuerySelection';
import {FolderNode} from 'eds-angular4/dist/folder/models/FolderNode';
import {ItemSummaryList} from 'eds-angular4/dist/library/models/ItemSummaryList';
import {FolderItem} from 'eds-angular4/dist/folder/models/FolderItem';
import {FolderService} from 'eds-angular4/dist/folder/folder.service';
import {LibraryService} from 'eds-angular4/dist/library';
import {FolderType} from 'eds-angular4/dist/folder/models/FolderType';
import {ItemType} from 'eds-angular4/dist/folder/models/ItemType';

@Component({
  selector: 'app-query-picker',
  templateUrl: './query-picker.component.html',
  styleUrls: ['./query-picker.component.css']
})
export class QueryPickerComponent implements OnInit {
  public static open(modalService: NgbModal, querySelection: QuerySelection) {
    const modalRef = modalService.open(QueryPickerComponent, {backdrop: "static", size: "lg"});
    modalRef.componentInstance.resultData = querySelection;

    return modalRef;
  }

  @Input() resultData;
  treeData: FolderNode[];
  selectedNode: FolderNode;
  itemSummaryList: ItemSummaryList;
  selection: FolderItem;
  sortField: any;
  sortReverse: any;

  constructor(
    protected folderService: FolderService,
    protected libraryService: LibraryService,
    protected activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.getRootFolders(FolderType.Library);
  }

  getRootFolders(folderType: FolderType) {
    let vm = this;
    vm.folderService.getFolders(folderType, null)
      .subscribe(
        (data) => {
          vm.treeData = data.folders;

          if (vm.treeData && vm.treeData.length > 0) {
            // Set folder type (not retrieved by API)
            vm.treeData.forEach((item) => {
              item.folderType = folderType;
            });
            // Expand top level by default
            vm.toggleExpansion(vm.treeData[0]);
          }
        });
  }

  toggleExpansion(node: FolderNode) {
    if (!node.hasChildren) {
      return;
    }

    node.isExpanded = !node.isExpanded;

    if (node.isExpanded && (node.nodes == null || node.nodes.length === 0)) {
      let vm = this;
      let folderId = node.uuid;
      node.loading = true;
      this.folderService.getFolders(1, folderId)
        .subscribe(
          (data) => {
            node.nodes = data.folders;
            // Set parent folder (not retrieved by API)
            node.nodes.forEach((item) => {
              item.parentFolderUuid = node.uuid;
            });
            node.loading = false;
          });
    }
  }

  folderChanged($event) {
    this.selectNode($event.selectedFolder);
  }

  selectNode(node: FolderNode) {
    if (node === this.selectedNode) {
      return;
    }
    let vm = this;

    vm.selectedNode = node;
    node.loading = true;

    vm.libraryService.getFolderContents(node.uuid)
      .subscribe(
        (data) => {
          console.log(data);
          vm.itemSummaryList = data;
          node.loading = false;
        });
  }

  select(item: FolderItem) {
    let vm = this;
    switch (item.type) {
      case ItemType.Query:
      case ItemType.CodeSet:
        this.selection = item;
        let querySelection: QuerySelection = {
          id: item.uuid,
          name: item.name,
          description: item.description
        };
        vm.resultData = querySelection;
        break;
      default:
        this.selection = null;
    }
  }

  getItemSummaryListContents() {
    // TODO : Reintroduce sort and filter
    if (this.itemSummaryList)
      return this.itemSummaryList.contents;
    else
      return null;
  }

  ok() {
    if (this.selection) {
      this.activeModal.close(this.resultData);
      console.log('OK Pressed');
    }
  }

  cancel() {
    this.activeModal.dismiss('cancel');
    console.log('Cancel Pressed');
  }
}
