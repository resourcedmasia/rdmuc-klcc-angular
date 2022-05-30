import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ModifyDataPointComponentComponent } from "../modify-data-point-component/modify-data-point-component.component";

@Component({
  selector: "app-data-point-multiple-tab",
  templateUrl: "./data-point-multiple-tab.component.html",
  styleUrls: ["./data-point-multiple-tab.component.scss"],
})
export class DataPointMultipleTabComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private modalService: NgbModal) {}

  @Input() rows: [];
  resultColumns: any[] = [];
  resultRows: any[] = [];
  selectedRow: any;
  disabledEditButton = false;

  ngOnInit() {
    this.generateColumns(this.rows);
    this.generateRows(this.rows);
  }

  generateColumns(data) {
    data[0].forEach((item) => {
      this.resultColumns.push({
        name: item,
        header: this.camelize(item),
        flexGrow: 1.0,
        minWidth: 100,
      });
    });
  }

  camelize(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

  generateRows(dataRow: any) {
    dataRow.shift();
    const keys = this.resultColumns.map((col) => col.header);
    for (var i = 0; i < dataRow.length; i++) {
      var obj = {};
      for (var j = 0; j < dataRow[i].length; j++) {
        obj[keys[j]] = dataRow[i][j];
        obj['index'] = i;
      }
      this.resultRows.push(obj);
    }
  }

  updateRow() {
    let modalRef = this.modalService.open(ModifyDataPointComponentComponent);
    modalRef.componentInstance.data = this.selectedRow;
  }

  onActivate(event) {
    console.log(event);
    
    if (event.type === "click") {
      this.selectedRow = event.row;
      this.disabledEditButton = true;
    }
    event.type === "click" && event.cellElement.blur();
  }
}
