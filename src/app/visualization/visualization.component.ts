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
declare var mxEvent: any;
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
  // Selected mxGraph dropdown
  selectedGraph;
  selectedMxGraph = [];
  graph;

  // Selected mxGraph cell ID (ngModel binding)
  selectedCellId;
  selectedCellValue;

  temp = [];
  loadingIndicator = true;
  description = [];
  items = [];

  writeSlaveType = [];
  readSlaveType = [];

  readTableData = [];
  writeTableData = [];

  cell_data_value = [];
  currentDate = new Date();

  readConfig = [];
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


  // Add / Edit Graph Configuration Form
  mxGraphForm = new FormGroup({
    mxgraph_value: new FormControl(''),
    mxgraph_code: new FormControl('')
  });

  cellForm = new FormGroup({
    cell_code: new FormControl('')
  });


  constructor(private modalService: NgbModal, private appService: AppService, private restService: RestService, private authService: AuthService) {
    this.appService.pageTitle = 'Visualization Dashboard';
    modalService = this.modalService;

  }

  subscription: Subscription;

  ngOnInit() {

    let CircularJSON = require('circular-json');

    // Retrieve stored mxGraphs from database and populate dropdown selection
    this.getMxGraphList();

    this.subscription = timer(0, 10000).pipe().subscribe(() => {
      console.log("every 5 sec");
      //this.getUsers();

      // Retrieve stored mxGraphs from database and populate dropdown selection
      //this.getMxGraphList();
    });

    //this.getUsers();
    //this.getWriteSlaveList();
    this.getReadSlaveList();

    // Prepare initial graph
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    let xml = ' <root> <mxCell id="0" /> <mxCell id="1" parent="0" /> <mxCell id="5cqd6Tq56_ArgYoLdoSi-1" value="No mxGraph selected." style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"> <mxGeometry x="40" y="40" width="760" height="40" as="geometry" /> </mxCell> </root>';

    let doc = mxUtils.parseXml(xml);
    let codec = new mxCodec(doc);
    let elt = doc.documentElement.firstChild;
    let cells = [];

    while (elt != null) {
      cells.push(codec.decodeCell(elt));
      elt = elt.nextSibling;
    }


    this.graph.addCells(cells);

    // Disable mxGraph editing
    this.graph.setEnabled(false);

    // Enable HTML markup on labels (https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.htmlLabels)
    this.graph.htmlLabels = true;

    // Store current context (this) in variable (thisContext)
    let thisContext = this;


    let model = this.graph.getModel();
    // On Click event ...
    this.graph.addListener(mxEvent.CLICK, function (sender, evt) {
      // Get event 'cell' property, 'id' subproperty (cell ID)
      let cellId = evt.getProperty("cell").id;
      let cellValued = evt.getProperty("cell").value;


      // Update ngModel binding with selected cell ID
      thisContext.selectedCellId = cellId;
      thisContext.selectedCellValue = cellValued;

      localStorage.setItem('selectedCellId', JSON.stringify(thisContext.selectedCellId));
      localStorage.setItem('selectedCellValue', JSON.stringify(thisContext.selectedCellValue));

      model.beginUpdate();
      try {

        model.setValue(evt.getProperty("cell").value, "test");

      }
      finally {
        model.endUpdate();
      }

    });

    // Disable loading indicator on table
    this.loadingIndicator = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  /*  Function: Retrieve stored mxGraph data from MySQL database (id, mxgraph_name, mxgraph_code), populate 'this.selected' dropdown list */
  getMxGraphList() {
    this.restService.postData("getMxGraphList", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.selectedMxGraph = data["data"].rows;
        }
      });
  }

  /* Function: Event triggered when mxGraph is selected from UI dropdown */
  onSelectGraph(event) {
    // Clear the existing graph
    this.graph.getModel().clear();

    // Retrieve graph XML by ID
    this.restService.postData("getMxGraphCodeByID", this.authService.getToken(), {
      id: event.Id
    }).subscribe(data => {
      // Success
      if (data["status"] == 200) {
        let mxgraphData = data["data"].rows[0];

        let doc = mxUtils.parseXml(mxgraphData["mxgraph_code"]);
        let codec = new mxCodec(doc);
        let elt = doc.documentElement.firstChild;
        let cells = [];


        while (elt != null) {
          cells.push(codec.decodeCell(elt));
          elt = elt.nextSibling;
        }

        this.graph.addCells(cells);

        // Disable mxGraph editing
        this.graph.setEnabled(false);


        this.mxGraphForm.patchValue({
          mxgraph_value: event.mxgraph_name
        });
      }
    });

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
          // this.mxGraphForm.reset();
          // this.mxGraphForm.emit("getRulesEvent");
        }
      })
  }

  valueChanged(event) {
    localStorage.setItem('readValue', event);
    this.readConfig = event;
    localStorage.setItem('cell_name', JSON.stringify(this.readConfig['Name']));
    localStorage.setItem('cell_value', JSON.stringify(this.readConfig['Value']));
    localStorage.setItem('cell_units', JSON.stringify(this.readConfig['Units']));
  }

  readInsert() {
    console.log("readValue");

    var controller = localStorage.getItem('controller');
    var name = localStorage.getItem('cell_name');
    var valued = localStorage.getItem('cell_value');
    var units = localStorage.getItem('cell_units');

    var cellID = localStorage.getItem('selectedCellId');
    var cellV = localStorage.getItem('selectedCellValue');

    console.log("name:" + cellV);



    this.restService.postData("setSlave", this.authService.getToken(), {
      controller: controller, name: name, value: valued, cellID: cellID
    })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("graph success");
          // this.mxGraphForm.reset();
          // this.mxGraphForm.emit("getRulesEvent");
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
          // this.mxGraphForm.reset();
          // this.mxGraphForm.emit("getRulesEvent");
        }
      })

  }

  /*
    Function: Event triggered when mxGraph Save Configuration button is selected 
    Inserts mxGraph name & code into backend database
  */
  mxGraphInsert() {
    this.restService.postData("mxGraphUpdate", this.authService.getToken(), { mxgraph_name: this.mxGraphForm.value.mxgraph_value, mxgraph_code: this.mxGraphForm.value.mxgraph_code })
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          // Reset Add / Edit form data
          this.mxGraphForm.reset();

          // Refresh mxGraph selection list
          this.restService.postData("getMxGraphList", this.authService.getToken())
            .subscribe(data => {
              // Success
              if (data["status"] == 200) {
                // Update selected mxGraph dropdown list
                this.selectedMxGraph = data["data"].rows;
                // Select first row in selected mxGraph dropdown list
                this.selectedGraph = this.selectedMxGraph[0]["mxgraph_name"];
                this.onSelectGraph({ Id: this.selectedMxGraph[0]["Id"], mxgraph_name: this.selectedMxGraph[0]["mxgraph_name"] });
              }
            });
        }
      })

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

    localStorage.setItem('controller', event);
    var code_test = localStorage.getItem('code');

    this.restService.postData("getSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {

        this.readName = true;
        this.readTableData = data["data"]["rows"];
        this.readTableData = this.readTableData['Items'];
        this.loadingIndicator = false;
      }
    });
  }


  readModel(event) {


    var CircularJSON = require('circular-json');

    console.log(" :" + CircularJSON.stringify(event.Name));

    // localStorage.setItem('cell_name', JSON.stringify(this.selectedReportType['Name']));
    // localStorage.setItem('cell_value', JSON.stringify(this.selectedReportType['Value']));
    // localStorage.setItem('cell_units', JSON.stringify(this.selectedReportType['Units']));


    this.restService.postData("setSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {

        this.loadingIndicator = false;
      }
    });



  }
}


