import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MxgraphEditComponent } from '../mxgraph-edit/mxgraph-edit.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription, timer } from 'rxjs';
import { deserialize } from 'chartist';

declare var mxUtils: any;
declare var mxCodec: any;
declare var mxGraph: any;
declare var cellName: any;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})

export class VisualizationComponent implements OnInit, OnDestroy {

  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('DatatableComponent') table: DatatableComponent;


  rows = [];
  rows1 = [];
  selected = [];

  temp = [];
  loadingIndicator = true;
  description = [];
  items = [];

  writeSlaveType = [];
  readSlaveType = [];

  childGraph = true;
  mainGraph = true;
  updateGraph = true;
  tableGraph = true;

  readTableData = [];
  writeTableData = [];

  cell_data_value = [];
  currentDate = new Date();

  selectedReportType = [];
  selectedType = [];
  mxcellID = [];
  cellName = [];

  writeName;
  writeValue;
  writeUnits;
  writeCellID;
  readName;
  readValue;
  readUnits;
  readCellID;




  mxgrapgForm = new FormGroup({
    mxgraph_value: new FormControl(''),
    mxgraph_code: new FormControl('')
  });

  cellForm = new FormGroup({
    cellName: new FormControl('',),
    cellID: new FormControl('',),
  });

  constructor(private modalService: NgbModal, private appService: AppService, private restService: RestService, private authService: AuthService) {
    this.appService.pageTitle = 'Workorder Dashboard';
    modalService = this.modalService;

  }

  subscription: Subscription;

  ngOnInit() {

    this.childGraph = false;
    this.updateGraph = false;
    this.tableGraph = false;
    var CircularJSON = require('circular-json');

    this.subscription = timer(0, 10000).pipe().subscribe(() => {
      console.log("every 5 sec");
      this.getUsers();
      this.select();
    });

    this.getUsers();
    this.getWriteSlaveList();
    this.getReadSlaveList();

    // Get Active Alarms
    this.restService.postData("getMxCellAlarms", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rows = data["data"].rows;

          let graph = new mxGraph(this.graphContainer.nativeElement);

          // var row1_mxcell_id = '"' + JSON.stringify(this.rows[0].mxcell_id) + '"';
          // var row1_mxcell_value = JSON.stringify(this.rows[0].mxcell_value);
          // var data_test = row1_mxcell_value.replace('"', "").replace('1"', "1");
          // var row1_mxcell_vertex = JSON.stringify(this.rows[0].Id);
          // var row1_mxcell_parent = JSON.stringify(this.rows[0].Id);
          // var row1_mxcell_xml_edit = JSON.stringify(this.rows[0].mxcell_xml).replace(/\\/g, "").replace('""<mxCell', "'<mxCell").replace('</mxCell>""', "</mxCell>'")


          localStorage.setItem('graphID', this.rows[0].Id);

          var xml = this.rows[0].mxgraph_code

          var doc = mxUtils.parseXml(xml);
          var codec = new mxCodec(doc);
          var elt = doc.documentElement.firstChild;
          var cells = [];

          while (elt != null) {
            cells.push(codec.decodeCell(elt));
            elt = elt.nextSibling;

          }


          graph.addCells(cells);

          var mainContext = this;

          graph.dblClick = function (evt, cell) {

            var cell_data = [];
            graph.selectAll();
            cell_data = graph.getSelectionCells(); //here you have all cells

            // console.log("cells 5 :" + cell_data[5].value);

            var model = graph.getModel();
            var parent = graph.getDefaultParent();
            var index = model.getChildCount(parent);
            model.beginUpdate();
            try {

              model.setValue(cell_data[5], "string data ");
              // console.log("model::" + CircularJSON.stringify(model));

            }
            finally {
              model.endUpdate();
            }

            if (cell.id == 'gjS3GzlNmGb7YU0pNode-3') {

              //   console.log("data:" + CircularJSON.stringify(cell.value));

              mainContext.modalService.open(MxgraphEditComponent);



            } else {
              console.log("log error");
            }

          }
          this.loadingIndicator = false;
        }
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  select() {
    this.restService.postData("getMxCellAlarms", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.selected = data["data"].rows;
        }
      });
  }

  onSelectGraph(event) {

    this.childGraph = false;
    this.mainGraph = false;
    this.updateGraph = false;
    this.tableGraph = true;

    let graph = new mxGraph(this.graphContainer.nativeElement);
    graph.getModel().clear();

    localStorage.setItem('graphID', event.Id);

    var doc = mxUtils.parseXml(event.mxgraph_code);
    var codec = new mxCodec(doc);
    var elt = doc.documentElement.firstChild;
    var cells = [];


    while (elt != null) {
      cells.push(codec.decodeCell(elt));
      graph.refresh();
      elt = elt.nextSibling;
    }

    graph.addCells(cells);
  }

  writeInsert() {
    console.log("write");
    var slave = localStorage.getItem('myData');
    var slave_name = JSON.parse(localStorage.getItem('cell_name'));
    var slave_type = JSON.parse(localStorage.getItem('cell_value'));
    var mxgraph_id = localStorage.getItem('graphID');
    var slave_cell_id = localStorage.getItem('mxgraphID');

    this.restService.postData("writeDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id, slave: slave, slave_name: slave_name, slave_type: slave_type, slave_cell_id: slave_cell_id
    })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("graph success");
          // this.mxgrapgForm.reset();
          // this.mxgrapgForm.emit("getRulesEvent");
        }
      })
  }

  readInsert() {
    console.log("read");
    var slave = localStorage.getItem('myData');
    var slave_name = JSON.parse(localStorage.getItem('cell_name'));
    var slave_type = JSON.parse(localStorage.getItem('cell_value'));
    var mxgraph_id = localStorage.getItem('graphID');
    var slave_cell_id = localStorage.getItem('mxgraphID');

    this.restService.postData("readDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id, slave: slave, slave_name: slave_name, slave_type: slave_type, slave_cell_id: slave_cell_id
    })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("graph success");
          // this.mxgrapgForm.reset();
          // this.mxgrapgForm.emit("getRulesEvent");
        }
      })
  }

  linkInsert() {
    var name = JSON.parse(localStorage.getItem('cell_name'));
    var mxgraph_id = localStorage.getItem('graphID');
    var cell_id = localStorage.getItem('mxgraphID');

    console.log("enter");
    // array to string 

    this.restService.postData("linkDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id, name: name, cell_id: cell_id
    })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("graph success");
          // this.mxgrapgForm.reset();
          // this.mxgrapgForm.emit("getRulesEvent");
        }
      })

  }

  mxgraphInsert() {
    this.childGraph = false;
    this.mainGraph = false;
    this.tableGraph = false;
    this.updateGraph = true;


    let graph = new mxGraph(this.graphContainer.nativeElement);

    var xml = this.mxgrapgForm.value.mxgraph_code

    var doc = mxUtils.parseXml(xml);
    var codec = new mxCodec(doc);
    var elt = doc.documentElement.firstChild;
    var cells = [];
    while (elt != null) {
      cells.push(codec.decodeCell(elt));
      graph.refresh();
      elt = elt.nextSibling;
    }

    graph.addCells(cells);

    this.restService.postData("mxgraphUpdate", this.authService.getToken(), { id: this.mxgrapgForm.value.mxgraph_value, site: this.mxgrapgForm.value.mxgraph_code })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("graph success");
          this.mxgrapgForm.reset();
          // this.mxgrapgForm.emit("getRulesEvent");
        }
      })

    this.mxgrapgForm.reset()



  }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  getUsers() {
    this.loadingIndicator = true;

    this.restService.postData("getSlaveAll", this.authService.getToken())
      .subscribe(data => {

        // Success
        if (data["status"] == 200) {

          this.rows1 = data["data"].rows;
          // this.description = this.rows1['Description'];
          // this.items = this.rows1['Items'];
          this.items = this.rows1['Items']['Item']

          this.loadingIndicator = false;


        }
      });
  }


  getWriteSlaveList() {
    this.loadingIndicator = true;

    // Get Assets
    this.restService.postData("getSlaveList", this.authService.getToken())
      .subscribe(data => {

        // Success
        if (data["status"] == 200) {

          this.rows1 = data["data"].rows;
          var test = deserialize(this.rows1['Slave']);

          for (let i = 0; i < this.rows1['Slave'].length; i++) {

            // this.reportType=test[i];
            this.writeSlaveType = [test[0].Name, test[1].Name];

          }

        }
      });
  }


  getReadSlaveList() {
    this.loadingIndicator = true;

    // Get Assets
    this.restService.postData("getSlaveList", this.authService.getToken())
      .subscribe(data => {

        // Success
        if (data["status"] == 200) {

          this.rows1 = data["data"].rows;
          var test = deserialize(this.rows1['Slave']);

          for (let i = 0; i < this.rows1['Slave'].length; i++) {

            // this.reportType=test[i];
            this.readSlaveType = [test[0].Name, test[1].Name];

          }

        }
      });
  }


  writeSlaveChange(event) {

    localStorage.setItem('myData', event);

    this.restService.postData("getSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {
        this.writeName = true;
        this.writeValue = true;;
        this.writeUnits = true;

        this.writeTableData = data["data"]["rows"];
        this.writeTableData = this.writeTableData['Items'];
        this.loadingIndicator = false;
      }
    });

  }


  readSlaveChange(event) {

    localStorage.setItem('myData', event);

    this.restService.postData("getSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {

        this.readName = true;
        this.readValue = true;;
        this.readUnits = true;
        this.readTableData = data["data"]["rows"];
        this.readTableData = this.readTableData['Items'];
        this.loadingIndicator = false;
      }
    });
  }

  writeModel(event) {


    var CircularJSON = require('circular-json');


    this.mainGraph = false;
    this.updateGraph = false;
    this.tableGraph = false;
    this.childGraph = true;


    this.selectedReportType = event;
    var myData = localStorage.getItem('myData');


    this.writeSlaveType = JSON.parse('[' + CircularJSON.stringify(myData) + ']');

    localStorage.setItem('cell_name', JSON.stringify(this.selectedReportType['Name']));
    localStorage.setItem('cell_value', JSON.stringify(this.selectedReportType['Value']));
    localStorage.setItem('cell_units', JSON.stringify(this.selectedReportType['Units']));

    this.restService.postData("getMxCellAlarms", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {


          //this.eodTableData = ["EOD Report", "Fault Analysis Report"];

          this.rows = data["data"].rows;
          let graph = new mxGraph(this.graphContainer.nativeElement);

          localStorage.setItem('graphID', this.rows[0].Id);
          var xml = this.rows[0].mxgraph_code
          var doc = mxUtils.parseXml(xml);
          var codec = new mxCodec(doc);
          var elt = doc.documentElement.firstChild;
          var cells = [];

          while (elt != null) {
            cells.push(codec.decodeCell(elt));
            elt = elt.nextSibling;

          }

          graph.addCells(cells);

          var cell_data = [];

          graph.selectAll();
          cell_data = graph.getSelectionCells(); //here you have all cells

          var model = graph.getModel();
          var parent = graph.getDefaultParent();
          var index = model.getChildCount(parent);
          model.beginUpdate();
          try {

            model.setValue(cell_data[2], event.Class);
            model.setValue(cell_data[3], event.Name);
            model.setValue(cell_data[5], event.Value);
            model.setValue(cell_data[6], event.Class);
            // console.log("model::" + CircularJSON.stringify(model));

          }
          finally {
            model.endUpdate();
          }

          var mainContext = this;
          this.writeCellID = true;
          this.mxcellID = ["gjS3GzlNmGb7YU0pNode-3"]

          let mxgraphID = "gjS3GzlNmGb7YU0pNode-3"

          localStorage.setItem('mxgraphID', mxgraphID);


          //   this.cellName = this.selectedReportType['Name'];

          graph.dblClick = function (evt, cell) {

            var cell_data_test = graph.getSelectionCell()

            this.mxcellID = CircularJSON.stringify(cell_data_test.id)

            this.mxcellID = [JSON.parse(this.mxcellID)];




            // var cell_data = [];
            // graph.selectAll();
            // cell_data = graph.getSelectionCells(); //here you have all cells

            // console.log("cell_data:" + cell_data);
            // localStorage.getItem('cell_data');
            mainContext.modalService.open(MxgraphEditComponent);





          }


          this.loadingIndicator = false;

        }


      });

  }

  readModal(event) {


    var CircularJSON = require('circular-json');


    this.mainGraph = false;
    this.updateGraph = false;
    this.tableGraph = false;
    this.childGraph = true;


    this.selectedReportType = event;
    var myData = localStorage.getItem('myData');


    this.writeSlaveType = JSON.parse('[' + CircularJSON.stringify(myData) + ']');

    localStorage.setItem('cell_name', JSON.stringify(this.selectedReportType['Name']));
    localStorage.setItem('cell_value', JSON.stringify(this.selectedReportType['Value']));
    localStorage.setItem('cell_units', JSON.stringify(this.selectedReportType['Units']));

    this.restService.postData("getMxCellAlarms", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {


          //this.eodTableData = ["EOD Report", "Fault Analysis Report"];

          this.rows = data["data"].rows;
          let graph = new mxGraph(this.graphContainer.nativeElement);

          localStorage.setItem('graphID', this.rows[0].Id);
          var xml = this.rows[0].mxgraph_code
          var doc = mxUtils.parseXml(xml);
          var codec = new mxCodec(doc);
          var elt = doc.documentElement.firstChild;
          var cells = [];

          while (elt != null) {
            cells.push(codec.decodeCell(elt));
            elt = elt.nextSibling;

          }

          graph.addCells(cells);
          var mainContext = this;
          this.readCellID = true;
          this.mxcellID = ["gjS3GzlNmGb7YU0pNode-3"]
          let mxgraphID = "gjS3GzlNmGb7YU0pNode-3"
          localStorage.setItem('mxgraphID', mxgraphID);

          this.cellName = this.selectedReportType['Name'];

          graph.dblClick = function (evt, cell) {

            var cell_data_test = graph.getSelectionCell()
            this.mxcellID = CircularJSON.stringify(cell_data_test.id)
            this.mxcellID = [JSON.parse(this.mxcellID)];
            // var cell_data = [];
            // graph.selectAll();
            // cell_data = graph.getSelectionCells(); //here you have all cells

            // console.log("cell_data:" + cell_data);
            // localStorage.getItem('cell_data');
            mainContext.modalService.open(MxgraphEditComponent);

          }

          this.loadingIndicator = false;
        }
      });
  }
}


