import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-data-point-multiple-tab',
  templateUrl: './data-point-multiple-tab.component.html',
  styleUrls: ['./data-point-multiple-tab.component.scss']
})
export class DataPointMultipleTabComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor() { }


  @Input() rows:[];
  resultColumns: any[] = [];
  resultRows: any[] = [];




  deletedRow: any;
  updatedRow: any;


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
          minWidth: 100
      });
  });
  console.log(this.resultColumns);
  
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  generateRows(dataRow: any) {
    dataRow.shift();

    const keys = this.resultColumns.map(col => col.header);
    for(var i=0; i<dataRow.length; i++){
      var obj = {};
      for(var j=0; j<dataRow[i].length; j++){
           obj[keys[j]] = dataRow[i][j];  
        }
      this.resultRows.push(obj);
      console.log(this.resultRows);
      
  }
  }

  // deleteRow() {
  //   console.log(this.deletedRow);
    

  // }

  updateRow() {
    console.log(this.deletedRow);
    

  }




  onActivate(event) {
    console.log(event);
    if (event.type === 'click') {
      this.deletedRow = event.row;
      this.updatedRow = event.row;
    }

    (event.type === 'click') && event.cellElement.blur();
  }
}
