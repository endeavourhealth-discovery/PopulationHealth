import { Component } from '@angular/core';
import {Location} from '@angular/common';
import {StartingRules} from '../models/StartingRules';
import {Query} from '../models/Query';
import {LoggerService, MessageBoxDialog} from 'eds-angular4';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LibraryService} from 'eds-angular4/dist/library';
import {ActivatedRoute} from '@angular/router';
import {flowchart} from '../../flowchart/flowchart/flowchart.viewmodel';
import {QuerySelection} from '../models/QuerySelection';
import {QueryPickerComponent} from '../query-picker/query-picker.component';
import {TestEditorComponent} from '../../tests/test-editor/test-editor.component';
import {ValueTo} from '../../tests/models/ValueTo';
import {Filter} from '../../tests/models/Filter';
import {Test} from '../../tests/models/Test';
import {ValueFrom} from '../../tests/models/ValueFrom';
import {EnterpriseLibraryItem} from '../../enterprise-library/models/EnterpriseLibraryItem';

declare var $: any; // jQuery

@Component({
  selector: 'app-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.css']
})
export class QueryEditorComponent {
  queryName: string;
  queryDescription: string;
  disableRuleProps: boolean;
  zoomPercent: string;
  private zoomNumber: number;
  private ruleId: number;
  private nextRuleID: number;
  chartViewModel: any;
  results: any;
  private startingRules: StartingRules;
  private query: Query;
  private libraryItem: EnterpriseLibraryItem;
  rulePassAction: string;
  ruleFailAction: string;
  ruleDescription: string;

  constructor(private logger: LoggerService,
              private $modal: NgbModal,
              private location: Location,
              private libraryService: LibraryService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.initialize(params['itemAction'], params['itemUuid']))
  }

  initialize(itemAction, itemUuid) {
    this.queryName = "";
    this.queryDescription = "";
    this.disableRuleProps = false;
    this.zoomPercent = "100%";
    this.zoomNumber = 100;
    this.nextRuleID = 1;
    this.results = [
      {value: 'GOTO_RULES', displayName: 'Go to rule'},
      {value: 'INCLUDE', displayName: 'Include patient in final result'},
      {value: 'NO_ACTION', displayName: 'No further action'}
    ];

    this.startingRules = {
      ruleId: []
    };

    this.query = {
      parentQueryUuid: null,
      startingRules: this.startingRules,
      rule: []
    };

    this.libraryItem = {
      uuid: null,
      name: null,
      description: null,
      folderUuid: itemUuid,
      query: this.query,
    } as EnterpriseLibraryItem;

    this.createModel(this.libraryItem);

    this.performAction(itemAction, itemUuid);
  }

  private createModel(libraryItem: EnterpriseLibraryItem) {
    this.chartViewModel = new flowchart.ChartViewModel(libraryItem);
  }

  private performAction(itemAction: string, itemUuid: string) {
    switch (itemAction) {
      case "view":
      case "edit":
        this.load(itemUuid);
        break;
      default:
    }
  }

  load(itemUuid : string) {
    let vm = this;
    vm.libraryService.getLibraryItem<EnterpriseLibraryItem>(itemUuid)
      .subscribe(
        (libraryItem) => vm.processLibraryItem(libraryItem),
        (error) => vm.logger.error('Error loading cohort', error, 'Error')
      );
  }

  processLibraryItem(libraryItem : EnterpriseLibraryItem) {
    let vm = this;
    vm.createModel(libraryItem);

    vm.queryName = libraryItem.name;
    vm.queryDescription = libraryItem.description;


    let newStartRuleDataModel = {
      description: "START",
      id: 0,
      layout: {
        x: -162,
        y: 25
      },
      onPass: {
        action: "",
        ruleId: <any>[]
      },
      onFail: {
        action: "",
        ruleId: <any>[]
      }
    };

    vm.chartViewModel.addRule(newStartRuleDataModel);

    let highestId = 1;
    for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
      let id = vm.chartViewModel.data.query.rule[i].id;
      if (parseInt(id) > highestId) {
        highestId = parseInt(id);
      }
    }
    vm.nextRuleID = highestId + 1;
  }

  queryNameChange() {
    this.chartViewModel.data.name = this.queryName;
  };

  queryDescriptionChange() {
    this.chartViewModel.data.description = this.queryDescription;
  };

  ruleDescriptionChange() {
    let selectedRule = this.chartViewModel.getSelectedRule();
    selectedRule.data.description = this.ruleDescription;
  };

  rulePassActionChange() {
    let selectedRule = this.chartViewModel.getSelectedRule();
    selectedRule.data.onPass.action = this.rulePassAction;
    if (this.rulePassAction !== "GOTO_RULES") {
      selectedRule.data.onPass.ruleId = <any>[];
    }
  };

  ruleFailActionChange() {
    let selectedRule = this.chartViewModel.getSelectedRule();
    selectedRule.data.onFail.action = this.ruleFailAction;
    if (this.ruleFailAction !== "GOTO_RULES") {
      selectedRule.data.onFail.ruleId = <any>[];
    }
  };

  clearQuery() {
    let vm = this;
    MessageBoxDialog.open(vm.$modal, 'Clear Rules', 'Are you sure you want to clear the rules in this cohort (changes will not be saved)?', 'Yes', 'No')
      .result.then(function () {
      vm.chartViewModel.clearQuery();
      vm.ruleDescription = "";
      vm.rulePassAction = "";
      vm.ruleFailAction = "";
      vm.nextRuleID = 1;
    });
  }

  cancelChanges() {
    let vm = this;
    MessageBoxDialog.open(vm.$modal, 'Cancel Changes', 'Are you sure you want to cancel the editing of this cohort (changes will not be saved) ?', 'Yes', 'No')
      .result.then(function () {
      vm.logger.error('Cohort not saved');
      vm.location.back();
    });
  }

  zoomIn() {
    this.zoomNumber = this.zoomNumber + 10;
    if (this.zoomNumber > 100)
      this.zoomNumber = 100;
    this.zoomPercent = this.zoomNumber.toString() + "%";
  };

  zoomOut() {
    this.zoomNumber = this.zoomNumber - 10;
    if (this.zoomNumber < 50)
      this.zoomNumber = 50;
    this.zoomPercent = this.zoomNumber.toString() + "%";
  };

  //
  // Add a new rule to the chart.
  //
  addNewRule(type: any) {
    //
    // Template for a new rule.
    //

    if (this.nextRuleID === 1) { // Add to new Cohort

      if (type == 1 || type == 3) { // Feature or Test

        this.createStartRule(-162, 25);

        this.createNewRule(194, 5, type);
      }
      else if (type == 2) { // Cohort as a Feature
        let querySelection: QuerySelection;
        let vm = this;
        QueryPickerComponent.open(this.$modal, querySelection)
          .result.then(function (resultData: QuerySelection) {
          vm.createStartRule(-162, 25);
          vm.createNewQueryRule(194, 5, resultData);
        });
      }

      this.chartViewModel.addStartingRule(1);
    }
    else { // Add to existing Cohort

      switch (type) {
        case "1": // Feature
        case "3": // Test
          this.createNewRule(566, 7, type);
          break;
        case "2": // Cohort as a Feature
          let querySelection: QuerySelection;
          let vm = this;
          QueryPickerComponent.open(this.$modal, querySelection)
            .result.then(function (resultData: QuerySelection) {
            vm.createNewQueryRule(566, 7, resultData);
          });
          break;
        case "4": // Expression/Function
          this.createNewExpression(566, 7);
          break;
      }
    }
  };

  createStartRule(x: any, y: any) {
    let newStartRuleDataModel = {
      description: "START",
      id: 0,
      layout: {
        x: x,
        y: y
      },
      onPass: {
        action: "",
        ruleId: <any>[]
      },
      onFail: {
        action: "",
        ruleId: <any>[]
      }
    };

    this.chartViewModel.addRule(newStartRuleDataModel);
  }

  createNewRule(x: any, y: any, type: any) {

    var label = "";
    if (type=="1") {
      label = "Feature Description"
    } else
    if (type=="3") {
      label = "Test Description"
    }

    let newRuleDataModel = {
      description: label,
      id: this.nextRuleID++,
      type: type,
      layout: {
        x: x,
        y: y
      },
      onPass: {
        action: "INCLUDE",
        ruleId: <any>[]
      },
      onFail: {
        action: "NO_ACTION",
        ruleId: <any>[]
      }
    };
    this.chartViewModel.addRule(newRuleDataModel);
  }

  createNewExpression(x: any, y: any) {
    let newExpressionRuleDataModel = {
      description: "Function Description",
      id: this.nextRuleID++,
      type: '4',
      layout: {
        x: x,
        y: y
      },
      onPass: {
        action: "INCLUDE",
        ruleId: <any>[]
      },
      onFail: {
        action: "NO_ACTION",
        ruleId: <any>[]
      },
      expression: {
        expressionText: "",
        variable: <any>[]
      }
    };
    this.chartViewModel.addRule(newExpressionRuleDataModel);
  }

  createNewQueryRule(x: any, y: any, resultData: any) {
    let newQueryRuleDataModel = {
      description: resultData.name + "~" + resultData.description,
      id: this.nextRuleID++,
      type: "2",
      layout: {
        x: x,
        y: y
      },
      onPass: {
        action: "INCLUDE",
        ruleId: <any>[]
      },
      onFail: {
        action: "NO_ACTION",
        ruleId: <any>[]
      },
      queryLibraryItemUUID: resultData.id
    };

    this.chartViewModel.addRule(newQueryRuleDataModel);
  }

  //
  // Delete selected rule and connections.
  //
  deleteSelected() {
    this.chartViewModel.deleteSelected();
  };

  save(close: boolean) {
    let vm = this;
    if (vm.queryName === "") {
      vm.logger.error('Please enter a name for the cohort');
      return;
    }

    if (vm.chartViewModel.data.query.rule.length === 0) {
      vm.logger.error('Please create a rule in this cohort');
      return;
    }

    for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
      let rule = vm.chartViewModel.data.query.rule[i];
      if (!rule.test && !rule.expression && !rule.queryLibraryItemUUID && rule.description !== "START") {
        vm.logger.error('Rule "' + rule.description + '" does not have any criteria');
        return;
      }
    }

    for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
      let rule = vm.chartViewModel.data.query.rule[i];
      if (!rule.test && (rule.expression && rule.expression.variable.length === 0) && rule.description !== "START") {
        vm.logger.error('Function "' + rule.description + '" does not have any variables');
        return;
      }
    }

    for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
      let rule = vm.chartViewModel.data.query.rule[i];
      if (rule.description !== "START") {
        if (rule.onPass.action === "") {
          vm.logger.error('Rule "' + rule.description + '" does not have a PASS action');
          return;
        }
        if (rule.onFail.action === "") {
          vm.logger.error('Rule "' + rule.description + '" does not have a FAIL action');
          return;
        }
      }
    }

    for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
      if (vm.chartViewModel.data.query.rule[i].description === "START") {
        vm.chartViewModel.data.query.rule.splice(i, 1);
        vm.chartViewModel.rule.splice(i, 1);
      }

    }

    let libraryItem = vm.chartViewModel.data;

    vm.libraryService.saveLibraryItem(libraryItem)
      .subscribe(
        (libraryItem) => {
          vm.chartViewModel.data.uuid = libraryItem.uuid;

          vm.createModel(vm.chartViewModel.data);

          let newStartRuleDataModel = {
            description: "START",
            id: 0,
            layout: {
              x: -162,
              y: 25
            },
            onPass: {
              action: "",
              ruleId: <any>[]
            },
            onFail: {
              action: "",
              ruleId: <any>[]
            }
          };

          vm.chartViewModel.addRule(newStartRuleDataModel);

          vm.logger.success('Cohort saved successfully', libraryItem, 'Saved');

          if (close) {

            vm.location.back();
          }
        },
        (error) => vm.logger.error('Error saving cohort', error, 'Error')
      );
  }

  onRuleDescription($event) {
    let description = $event.description;
    if (description === "START") {
      this.disableRuleProps = true;
    }
    else {
      this.disableRuleProps = false;
    }
    this.ruleDescription = description;
  }

  onRulePassAction($event) {
    this.rulePassAction = $event.action;
  }

  onRuleFailAction($event) {
    this.ruleFailAction = $event.action;
  }

  onEditTest($event) {
    let ruleId = $event.ruleId;
    let vm = this;
    if (ruleId !== "0") {
      vm.ruleId = ruleId;

      let selectedRule = vm.chartViewModel.getSelectedRule();
      let restrictions = <any>[];

      for (let i = 0; i < vm.chartViewModel.data.query.rule.length; ++i) {
        if (vm.chartViewModel.data.query.rule[i].description !== "START"
          && vm.chartViewModel.data.query.rule[i].type!='2'
          && !vm.chartViewModel.data.query.rule[i].expression
          && vm.chartViewModel.data.query.rule[i].id!=vm.ruleId
          && vm.chartViewModel.data.query.rule[i].test!=null
          && vm.chartViewModel.data.query.rule[i].test.restriction!=null) {
          for (let f = 0; f < vm.chartViewModel.data.query.rule[i].test.restriction.field.length; ++f) {

            var valueFrom : ValueFrom = {
              constant: null,
              absoluteUnit: null,
              relativeUnit: null,
              operator: "GREATER_THAN_OR_EQUAL_TO",
              testField: ""
            }

            var valueTo : ValueTo = {
              constant: null,
              absoluteUnit: null,
              relativeUnit: null,
              operator: "LESS_THAN_OR_EQUAL_TO",
              testField: ""
            }

            var filter: Filter = {
              field: "",
              valueFrom: valueFrom,
              valueTo: valueTo,
              codeSet: null,
              valueSet: null,
              codeSetLibraryItemUuid: null,
              negate: false
            };

            let restriction = {
              field : vm.chartViewModel.data.query.rule[i].test.restriction.prefix+"-"+
                vm.chartViewModel.data.query.rule[i].test.restriction.field[f],
              filter : filter
            }
            restrictions.push(restriction);
          }
        }
      }

      if (selectedRule.data.expression) {
/*
        let expression: ExpressionType = selectedRule.data.expression;

        ExpressionEditDialog.open(vm.$modal, expression, restrictions)
          .result.then(function (resultData: ExpressionType) {

          selectedRule.data.expression = resultData;
        });
*/
      }
      else if (!selectedRule.data.queryLibraryItemUUID) {
        let test: Test = selectedRule.data.test;
        let originalResultData = $.extend(true, {}, test);

        TestEditorComponent.open(vm.$modal, originalResultData, selectedRule.data.type, restrictions)
          .result.then(function (resultData: Test) {

          selectedRule.data.test = resultData;

          if (vm.ruleDescription=="Feature Description") {
            vm.ruleDescription = selectedRule.data.test.filter[0].codeSet.codeSetValue[0].term;
            vm.ruleDescriptionChange();
          }
        });
      }
    }
  }
}
