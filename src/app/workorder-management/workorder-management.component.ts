import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MomentModule, FromUnixPipe, DateFormatPipe, SubtractPipe, AddPipe, ParsePipe } from 'angular2-moment';
import { AppService } from '../app.service';

import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { JSONParser } from '@amcharts/amcharts4/core';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddUserModalComponent } from '../user-management/add-user-modal/add-user-modal.component';

declare var mxUtils: any;
declare var mxCodec: any;
declare var mxGraph: any;
declare var mxHierarchicalLayout: any;
declare var mxClient: any;
declare var mxEventObject: any;
declare var mxEvent: any;
declare var SelectGraphCell: any;


@Component({
  selector: 'app-workorder-management',
  templateUrl: './workorder-management.component.html',
  styleUrls: ['./workorder-management.component.scss']
})
export class WorkorderManagementComponent implements OnInit {

  @ViewChild('graphContainer') graphContainer: ElementRef;
  currentDate = new Date();

  private viewAlarmModalRef;

  rows = [];
  rows_critical = [];
  rows_noncritical = [];
  rules = [];
  stringifiedData1 = [];
  myusername: string = "";


  loadingIndicator = true;
  columnWidths = [
    { column: "id", width: 50 },
    { column: "controller", width: 100 },
    { column: "timestamp", width: 150 }
  ]


  constructor(private modalService: NgbModal, private appService: AppService, private restService: RestService, private authService: AuthService) {
    this.appService.pageTitle = 'Workorder Dashboard';
  }


  openAddUserModal() {
    this.modalService.open(AddUserModalComponent);
  }

  ngOnInit() {

    
    this.loadingIndicator = true;

    // Get Active Rules
    this.restService.postData("getRules", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rules = data["data"].rows;
          // Get Active Alarms
          this.restService.postData("getMxCellAlarms", this.authService.getToken())
            .subscribe(data => {
              // Success
              if (data["status"] != 200) {
                //this.rows = data["data"].rows;
                let graph = new mxGraph(this.graphContainer.nativeElement);

                // var row1_mxcell_id = '"' + JSON.stringify(this.rows[0].mxcell_id) + '"';
                // var row1_mxcell_value = JSON.stringify(this.rows[0].mxcell_value);
                // var data_test = row1_mxcell_value.replace('"', "").replace('1"', "1");
                // var row1_mxcell_vertex = JSON.stringify(this.rows[0].Id);
                // var row1_mxcell_parent = JSON.stringify(this.rows[0].Id);
                // var row1_mxcell_xml_edit = JSON.stringify(this.rows[0].mxcell_xml).replace(/\\/g, "").replace('""<mxCell', "'<mxCell").replace('</mxCell>""', "</mxCell>'")



                const xml2 = '<mxGraphModel dx="1004" dy="713" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0"> <root> <mxCell id="0" /> <mxCell id="1" parent="0" /> <mxCell id="gjS3GzlNmGb7YU0pNode-1" value="FCU 1" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="160" y="80" width="150" height="40" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-2" value="SET POINT : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="160" y="150" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-3" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="310" y="150" width="50" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-4" value="ZONE TEMP : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="160" y="120" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-5" value="FAN SPEED : LOW" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="160" y="180" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-6" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="310" y="180" width="50" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-7" value="FCU 3" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="530" y="80" width="150" height="40" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-8" value="SET POINT : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="530" y="150" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-9" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="680" y="150" width="50" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-10" value="ZONE TEMP : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="530" y="120" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-11" value="FAN SPEED : LOW" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="530" y="180" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-12" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="680" y="180" width="50" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-13" value="FCU 2" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="360" y="320" width="150" height="40" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-14" value="SET POINT : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="360" y="390" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-15" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="510" y="390" width="50" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-16" value="ZONE TEMP : 25C" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="360" y="360" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-17" value="FAN SPEED : LOW" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1"> <mxGeometry x="360" y="420" width="150" height="30" as="geometry" /> </mxCell> <mxCell id="gjS3GzlNmGb7YU0pNode-18" value="EDIT" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f8cecc;fontStyle=1;strokeColor=#b85450;" parent="1" vertex="1"> <mxGeometry x="510" y="420" width="50" height="30" as="geometry" /> </mxCell> </root> </mxGraphModel>';
              let doc = mxUtils.parseXml(xml2);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, graph.getModel()) 
                //var elt = doc.documentElement.firstChild;
                //console.log(elt);

                /*
                var xml = this.rows[0].mxcell_xml
                var doc = mxUtils.parseXml(xml);
                var codec = new mxCodec(doc);
                var elt = doc.documentElement.firstChild;
                var cells = [];

                while (elt != null) {
                  cells.push(codec.decodeCell(elt));
                  elt = elt.nextSibling;
                }


                graph.addCells(cells);
                */


                // mxGraph.prototype.dblClick = function (sender, event) {

                //   console.log("double click");
                //   var cell = graph.getSelectionCell();
                //   console.log(cell);
                //   console.log("double click" + selectedCell);
                // }


                // FIX: Store main context in variable 'mainContext'
                var mainContext = this;
                graph.dblClick = function (evt, cell) { // Replaced mxGraph.prototype with graph (not necessary)
                  console.log("evt:" + evt);

                  var cell = graph.getSelectionCell(cell);

                  var CircularJSON = require('circular-json');
                  console.log(CircularJSON.stringify(cell.id));
                  console.log(this);

                  // here am trying to call component but when i try to call getting not a function and 
                  // out the this function working fine

                  // FIX: 'this' context refers to mxGraph within callback function, use stored 'mainContext' variable to access parent 
                  // this.modalService.open(AddUserModalComponent);
                  mainContext.modalService.open(AddUserModalComponent);

                }
                this.loadingIndicator = false;
              }
            });
        }
      });
  }





  blurEvent(event: any) {

    // var row1_mxcell_xml_edit = JSON.stringify(this.rows[1].mxcell_xml).replace(/\\/g, "").replace('""<mxCell', "'<mxCell").replace('</mxCell>""', "</mxCell>'")

    // // graph.model.setValue(cell, value);

    // let graph = new mxGraph(this.graphContainer.nativeElement);


    console.log("graphContainer_test:");
    this.myusername = event.target.value;
    console.log("this.myusername:" + this.myusername);

  }

}

