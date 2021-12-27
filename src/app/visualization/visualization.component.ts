import { HostListener,Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Config } from '../../config/config';
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutService } from '../layout/layout.service';



import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MxgraphEditComponent } from '../mxgraph-edit/mxgraph-edit.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription, timer } from 'rxjs';
import { deserialize } from 'chartist';
import { ToastrService } from 'ngx-toastr';
import { WriteVisualizationModalComponent } from './write-visualization-modal/write-visualization-modal.component';
import { VerifyUserModalComponent } from './verify-user-modal/verify-user-modal.component';
import { DeleteGraphModalComponent } from './delete-graph-modal/delete-graph-modal.component';
import { VerifyDeleteGraphModalComponent } from './verify-delete-graph-modal/verify-delete-graph-modal.component';


declare var mxUtils: any;
declare var mxCodec: any;
declare var mxGraph: any;
declare var mxEvent: any;
declare var mxCellHighlight: any;
declare var mxGraphView: any;
declare var cellName: any;
declare var mxConstants: any;
declare var mxGraphHandler: any;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})

export class VisualizationComponent implements OnInit, OnDestroy {

  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('DatatableComponent') table: DatatableComponent;
  @ViewChild('tabs')
  private tabs: NgbTabset;


  rows = [];
  rows1 = [];
  // Selected mxGraph dropdown
  selectedGraph;
  selectedMxGraph = [];
  graph;
  mxgraphData = [];

  // Selected mxGraph cell ID (ngModel binding)
  selectedCellId;
  selectedWriteCellId;
  selectedCellValue;
  cellValue: any;
  storedCellId: any;
  tempNavAttributeCellId: any;
  selectRow: any;

  temp = [];
  loadingIndicator = true;
  description = [];
  items = [];
  cells = [];

  writeSlaveType = [];
  readSlaveType = [];
  linkMappingReadConfig = [];
  navigationLink = [];
  navigationArray = [];
  slaveArray = [];
  getAllSlaveArray = [];
  getSlaveValue = [];
  mxGraphFloors = [];
  tempLinkMap = {};
  tempNavLinkMap = {};

  readTableData = [];
  writeTableData = [];

  cell_data_value = [];
  currentDate = new Date();

  readConfig = [];
  writeConfig = [];
  mxcellID = [];
  cellName = [];
  cellID = [];


  writeName;
  writeCode;
  readName;
  readCode;
  readOnly: any;
  hideAddRow: any;
  graphClickable: boolean;
  hideEditGraph: boolean;
  cardExpand: boolean;
  editGraphName: boolean;
  unsavedStatus: boolean;
  isAddError: boolean;
  isAddNavError: boolean;
  activeTab: any;
  selectedTab: any;

  readConfigClass: any;
  readCellID;
  disablebutton;
  selectedName: any;
  tempState: any;
  previousStyle: any;
  temp_mxgraph_name: any;
  tempFieldArray: any;
  isMouseHover: any;
  


  // Add / Edit Graph Configuration Form
  mxGraphForm = new FormGroup({
    mxgraph_value: new FormControl('', Validators.required),
    mxgraph_code: new FormControl('', Validators.required)
  });

  editGraphForm = new FormGroup({
    mxgraph_name: new FormControl('', Validators.required),
    mxgraph_id: new FormControl('')
  });

  cellForm = new FormGroup({
    cell_code: new FormControl('')
  });
  tempHoverField: any;
  tempNavCellId: any;
 

  constructor(
              private config: Config, 
              private toastr: ToastrService, 
              private modalService: NgbModal, 
              private appService: AppService, 
              private restService: RestService, 
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private layoutService: LayoutService,
              private _cdRef: ChangeDetectorRef
              ) {
    
    this.appService.pageTitle = 'Visualization Dashboard';
    // modalService = this.modalService;

  }

  subscription: Subscription;


  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  private newNavAttribute: any = {};
  field: any;
  
  // Re-size graph when detect window size change
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event) {
      this.centerGraph();
    }
  }

 
  async ngOnInit() {

    // Collapse the sidebar
    this.layoutService.setCollapsed(true, true);
    let CircularJSON = require('circular-json');
    this.readOnly = -1;
    this.hideAddRow = true;
    this.tempState = "";
    this.graphClickable = false;
    this.cardExpand = false;
    this.hideEditGraph = true;
    this.editGraphName = false;
    this.storedCellId = "";
    this.unsavedStatus = false;
    this.toastr.clear();
    this.isMouseHover = false;
    this.isAddError = false;
    this.isAddNavError = false;

    

    // Retrieve stored mxGraphs from database and populate dropdown selection
    this.getMxGraphList();
    this.getMxGraphFloor();

    //this.getUsers();
    this.getWriteSlaveList();
    await this.getReadSlaveList();

    
    // Prepare initial graph
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    
    this.graph.view.rendering = false;
    this.graph.setTooltips(true);
    
    // Default no graph from config.ts 
    let xml = this.config.XMLnograph;
    
    let doc = mxUtils.parseXml(xml);
    let codec = new mxCodec(doc);
    let elt = doc.documentElement.firstChild;
    let cells = [];

    while (elt != null) {
      cells.push(codec.decodeCell(elt));
      this.graph.refresh();
      elt = elt.nextSibling;
    }

    this.graph.addCells(cells);

    // Disable mxGraph editing
    this.graph.setEnabled(false);

    // Enable HTML markup on labels (https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.htmlLabels)
    this.graph.htmlLabels = true;
    // Add click event
    this.addClickListener();
    // Center and Re-scale graph
    this.centerGraph();
    // Disable loading indicator on table
    this.spinner.hide();
   
  }

  ngAfterViewInit() {
    this.tabs.select("tab1");
    this.activeTab = "tab2";
    this._cdRef.detectChanges();
  }

  centerGraph() {
   
    this.graph.view.rendering = true;

    // Center the graph
    var margin = 2;
    var max = 3;
    
    var bounds = this.graph.getGraphBounds();
    var cw = this.graph.container.clientWidth - margin;
    var ch = this.graph.container.clientHeight - margin;
    var w = bounds.width / this.graph.view.scale;
    var h = bounds.height / this.graph.view.scale;
    var s = Math.min(max, Math.min(cw / w, ch / h));
    
    this.graph.view.scaleAndTranslate(s,
      (margin + cw - w * s) / (2 * s) - bounds.x / this.graph.view.scale,
      (margin + ch - h * s) / (2 * s) - bounds.y / this.graph.view.scale);

    // Re-scale the graph to fit the container
    this.graph.fit();
    // Re-render the graph
    this.graph.refresh();


  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.toastr.clear();
  }

  addFieldValue() {
    // If attribute is empty, no new rows will be added
    if (Object.keys(this.newAttribute).length === 0){
      console.log("Attribute is empty");
    } else {
        var attributeArray;;
        if(Object.keys(this.newAttribute).length > 1) {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            slave: this.newAttribute.controller,
            slave_cell_id: this.newAttribute.mxgraphid,
            slave_name: this.newAttribute.name.Name,
            slave_type: this.newAttribute.name.Class
          }
        }
        else {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            slave: "",
            slave_cell_id: "",
            slave_name: "",
            slave_type: ""
          }
        }  

        this.newAttribute = {};
        this.readTableData = [];
        // Make sure the fields are not empty when adding new row
        if (attributeArray.slave && attributeArray.slave_cell_id && attributeArray.slave_name && attributeArray.slave_type) {
          this.fieldArray.push(attributeArray)
          this.linkMappingReadConfig.push(attributeArray)
          this.readConfigClass = "";
          this.graphClickable = false;
          this.removeClickListener();
          // Show toastr for unsaved changes.
          this.unsavedToast();
          this.isAddError = false;
        }
        else {
          this.isAddError = true;
        }
        
    }
    
  }

  addNavFieldValue() {
    // If attribute is empty, no new rows will be added
    if (Object.keys(this.newNavAttribute).length === 0){
      console.log("Attribute is empty");
    } else {
        var attributeArray;;
        if(Object.keys(this.newNavAttribute).length > 1) {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            cell_id: this.newNavAttribute.cell_id,
            mxgraph_name: this.newNavAttribute.mxgraph_name.mxgraph_name,
            target_mxgraph_id: this.newNavAttribute.target_mxgraph_id
          }
          console.log(attributeArray)
        }
        else {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            cell_id: "",
            mxgraph_name: "",
            target_mxgraph_id: "",
          }
        }  

        this.newNavAttribute = {};
        // Make sure the fields are not empty when adding new row
        if (attributeArray.mxgraph_id && attributeArray.cell_id && attributeArray.mxgraph_name && attributeArray.target_mxgraph_id) {
          this.navigationLink.push(attributeArray)
          this.graphClickable = false;
          this.removeClickListener();
          // Show toastr for unsaved changes.
          this.unsavedToast();
          this.isAddNavError = false;
        }
        else {
          this.isAddNavError = true;
        }
        
    }
    
  }

  deleteFieldValue(event) {
    for(let i = 0; i < this.fieldArray.length; ++i){
      if (this.fieldArray[i].slave_cell_id === event.target.id) {
        // Splice array in Read Config
        this.fieldArray.splice(i,1);
        // Splice in Link Mapping, so that the API don't need to call for this value
        this.linkMappingReadConfig.splice(i,1);
        this.unsavedToast();
      }
    }
    

    // Change value cell value to "" after delete
    this.resetCells(this.cells, event.target.id);
    this.graph.refresh();
    this.unhighlightRow();
  
  }

  deleteNavFieldValue(event) {
    console.log(event.target.id)
    for(let i = 0; i < this.navigationLink.length; ++i){
      if (this.navigationLink[i].cell_id === event.target.id) {
        // Splice array in navigation link
        this.navigationLink.splice(i,1);
        // this.navigationArray.splice(i,1);
        this.unsavedToast();
      }
    }
   this.graph.refresh();
   this.unhighlightRow();
  }

 
  /* Function: Edits row */
  async onSelect(i: number, event, e) {
    this.removeClickListener();
    this.graphClickable = true;
    // this.addClickListener();
    this.tempLinkMap = {
      mxgraph_id: event.mxgraph_id,
      slave: event.slave,
      slave_cell_id: event.slave_cell_id,
      slave_name: event.slave_name,
      slave_type: event.slave_type
    }
    this.readTableData = [];
    let tableIndex = e.target.id;

    for(let i = 0; i < this.fieldArray.length; i++){
      if(this.fieldArray[i]==this.fieldArray[tableIndex]){
         this.tempFieldArray = this.fieldArray[tableIndex].slave_cell_id;
          // Clear the fields when on edit
          this.fieldArray[tableIndex].slave = "";
          this.fieldArray[tableIndex].slave_name = "";
          this.fieldArray[tableIndex].slave_type = "";
      }
    }

    let tempFieldArray = this.tempFieldArray;
    this.storedCellId = tempFieldArray;
   
    // Call API if the selected slave is not in getAllSlaveArray to get the slave value
    if (this.getAllSlaveArray[event.slave] === "" || this.getAllSlaveArray[event.slave] == false) {
      await this.restService.postData("getSlave", this.authService.getToken(), { type: event.slave }).toPromise().then(async data => {
        // Success
        if (data["status"] == 200 && data["data"]["rows"] !== false) {    
           this.getAllSlaveArray[event.slave] = data["data"]["rows"];
           console.log("getAllSlaveArray:", this.getAllSlaveArray);
           for (let i = 0; i < this.getAllSlaveArray[event.slave].Items.Item.length; i++) {
            if (this.getAllSlaveArray[event.slave].Items.Item[i].Name == event.slave_name) {
              let cell_value = this.getAllSlaveArray[event.slave].Items.Item[i].Value
              await this.config.asyncLocalStorage.setItem('cell_value', cell_value)
            }
          }
        }
        else {
          console.log("Can't get data for Slave")
        }
      });
    } 

    this.readOnly = i
    this.hideAddRow = true;
    this.graphClickable = true;
    this.addClickListener();
  }

   
  /* Function: Edits row */
   async onEditNav(i: number, event, e) {
    this.removeClickListener();
    this.graphClickable = true;
    // this.addClickListener();
    
    console.log("edit Graphclickable",this.graphClickable)
    this.tempNavLinkMap = {
      Id: event.Id,
      mxgraph_id: event.mxgraph_id,
      cell_id: event.cell_id,
      mxgraph_name: event.mxgraph_name,
      target_mxgraph_id: event.target_mxgraph_id
    }

    console.log(this.tempNavLinkMap)

    let tableIndex = e.target.id;

    for(let i = 0; i < this.navigationLink.length; i++){
      if(this.navigationLink[i]==this.navigationLink[tableIndex]){
         this.tempNavCellId = this.navigationLink[tableIndex].Id;
          // Clear the fields when on edit
          this.navigationLink[tableIndex].mxgraph_name = "";
      }
    }

    this.readOnly = i
    this.hideAddRow = true;
    this.addClickListener();
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

  getMxGraphFloor() {
      this.restService.postData("getMxGraphList", this.authService.getToken())
        .subscribe(data => {
          // Success
          if (data["status"] == 200) {
            this.mxGraphFloors = data["data"].rows;
          }
        });
  }

  /* Function: Event triggered when mxGraph is selected from UI dropdown */
  async onSelectGraph(event) {
    
    // Starts loading spinner in Table
    this.spinner.show();
    this.graphClickable = false;
    this.hideEditGraph = false;
    this.editGraphName = false;
    this.editGraphForm.reset();
    this.readConfigClass = "";
    this.readOnly = -1;
    this.hideAddRow = false;
    this.storedCellId = "";
    this.unsavedStatus = false;
    this.isAddError = false;
    this.isAddNavError = false;
    this.toastr.clear();
    this.activeTab = "tab2";
    this.tabs.select("tab1");
    this._cdRef.detectChanges();
    console.log(this.activeTab)

    localStorage.removeItem('cell_value');
    this.newAttribute = {};
    this.newNavAttribute = {};
    // Clear fieldArray
    this.fieldArray = [];
    // Clear linkMappingReadConfig Array
    this.linkMappingReadConfig = [];
    this.navigationLink = [];

    // Remove click events
    this.removeClickListener();

    this.editGraphForm.patchValue({
      mxgraph_name: event.mxgraph_name,
      mxgraph_id: event.Id
    });

    this.temp_mxgraph_name = event.mxgraph_name;
    

    // Retrieve Link Mapping by Graph ID
    await this.restService.postData("readLinkMapping", this.authService.getToken(), {
      id: event.Id
    }).toPromise().then(data => {
      if (data["status"] == 200) {
    
          let linkMapping = data["data"].rows;
          
          // Push Link Mapping to populate Read Configuration fields
          for (let i = 0; i < linkMapping.length; i++) {
            this.linkMappingReadConfig=[...this.linkMappingReadConfig,linkMapping[i]];
          }
      }
    });

    // Retrieve Navigation Link by Graph ID
    await this.restService.postData("getNavLink", this.authService.getToken(), {
      mxgraph_id: event.Id
    }).toPromise().then(async data => {
      if (data["status"] == 200) {
          let result= data["data"].rows;
          
          for (let i = 0; i < result.length; i++) {
              this.navigationLink=[...this.navigationLink,result[i]];
              console.log(result)
              await this.restService.postData("getMxGraphCodeByID", this.authService.getToken(), {
                id: result[i].target_mxgraph_id
              }).toPromise().then(async data => {
                // Success
                if (data["status"] == 200) {
                  let mxgraphData = data["data"].rows[0];
                  let targetMxGraphName = {
                    mxgraph_name: mxgraphData["mxgraph_name"],
                  }
                  this.navigationLink[i] = Object.assign(this.navigationLink[i],targetMxGraphName)
                }
              }); 
      }
     }
    });
    

    // Clear the existing graph
    this.graph.getModel().clear();

    // Retrieve graph XML by ID
    await this.restService.postData("getMxGraphCodeByID", this.authService.getToken(), {
      id: event.Id
    }).toPromise().then(async data => {
      // Success
      if (data["status"] == 200) {
        let mxgraphData = data["data"].rows[0];
        this.mxgraphData = data["data"].rows[0];

        let doc = mxUtils.parseXml(mxgraphData["mxgraph_code"]);
        let codec = new mxCodec(doc);
        let elt = doc.documentElement.firstChild;
        let cells = [];


        while (elt != null) {
          cells.push(codec.decodeCell(elt));
          elt = elt.nextSibling;
        }

        
        
        this.cells = cells;
     
        // Iterate read config field and change value of cells
        await this.generateCells(cells) 
        // Stops loading indicator  
        this.loadingIndicator = false;    

        this.graph.refresh();

        // Start 5 seconds interval subscription
        if (this.subscription) {
          // If already subscribed, unsubbed to the previous sub
          this.subscription.unsubscribe();
          this.sub(cells);
        } else {
          this.sub(cells);
        }

        console.log(this.fieldArray);
        

        this.graph.addCells(cells);

        // Disable mxGraph editing
        this.graph.setEnabled(false);

        this.config.asyncLocalStorage.setItem('mxgraph_id', event.Id);
        this.addClickListener();

        this.centerGraph();

      }
    });
    // Stops loading spinner in Table
    this.spinner.hide();
  }

  /* Function: Makes the cells on the graph clickable */
  async addClickListener() {
    
    let model = this.graph.getModel();
    let thisContext = this;
    let linkMap = this.linkMappingReadConfig;
    let tempFieldArray = this.fieldArray;
    let tempNavArray = this.navigationLink;
    let storedCellId = this.storedCellId;
    let storedNavCellId = this.tempNavCellId;
         
    
    this.graph.addMouseListener(
      {
          
          currentState: null,
          previousStyle: null,
       
          mouseMove: function(sender, me)
          {

              if (this.currentState != null && me.getState() == this.currentState)
              {
                  return;
              }

              var tmp = thisContext.graph.view.getState(me.getCell());

              // Ignores everything but vertices
              if ((tmp != null && !
                thisContext.graph.getModel().isVertex(tmp.cell)))
              {
                  tmp = null;
              }

              if (tmp != this.currentState)
              {
                  if (this.currentState != null)
                  {
                      this.dragLeave(me.getEvent(), this.currentState);
                      thisContext.graph.getTooltipForCell = function(tmp)
                        {
                          return "";
                        }  
                  }

                  this.currentState = tmp;

                  if (this.currentState != null)
                  {
                    for(let i = 0; i < tempNavArray.length; i++) {
                      if (tempNavArray[i].cell_id == tmp.cell.id) {
                        this.dragEnter(me.getEvent(), this.currentState, "Link", tmp, null, null);
                        console.log(tempNavArray[i])
                      }
                    }
                    for (let i = 0; i < linkMap.length; i++) {
                      if (linkMap[i].slave_cell_id == tmp.cell.id && linkMap[i].slave_type == "Parameter") {
                        this.dragEnter(me.getEvent(), this.currentState, "Parameter", tmp, linkMap[i].slave, linkMap[i].slave_name);
                      }
                      else if(linkMap[i].slave_cell_id == tmp.cell.id && linkMap[i].slave_type !== "Parameter") {
                        this.dragEnter(me.getEvent(), this.currentState, "Non-Parameter", tmp, linkMap[i].slave, linkMap[i].slave_name);
                      }                       
                    }
                  }
              }
          },
          mouseUp: function(sender, me) { },
          mouseDown: function(sender, me){},
          dragEnter: function(evt, state, parameter, cell, slave, slave_name)
          {
            if(parameter == "Parameter") {
              this.currentState.setCursor('pointer');
              if(slave && slave_name){
                thisContext.graph.getTooltipForCell = function(cell)
                {
                  return slave + " - " + slave_name;
                }  
              }
            }
            else if(parameter == "Non-Parameter"){
              if(slave && slave_name){
                thisContext.graph.getTooltipForCell = function(cell)
                {
                  return slave + " - " + slave_name;
                }  
              }
            }
            else{
              this.currentState.setCursor('pointer');
            }
          },
          dragLeave: function(evt, state)
          {
           
          }
      });



    // On Click event ...
    if (this.graphClickable) {
    this.graph.addListener(mxEvent.CLICK, function (sender, evt) {
      let valued = null
  
      if (evt.properties.cell) {
        if(thisContext.activeTab == "tab2") {
          console.log("Enter Here IF")
          // Get event 'cell' property, 'id' subproperty (cell ID)
          let cellId = evt.getProperty("cell").id;    
          valued = localStorage.getItem('cell_value');
          // Update ngModel binding with selected cell ID
          thisContext.newAttribute.mxgraphid = cellId;
          model.beginUpdate();
          try {
            // Get cell from model by cell ID string (https://jgraph.github.io/mxgraph/docs/js-api/files/model/mxGraphModel-js.html#mxGraphModel.getCell)
            let cell = model.getCell(evt.getProperty("cell").id);
            // Set value in cell when clicked
            if (valued) {
              model.setValue(cell, valued);
              for (let i = 0; i < tempFieldArray.length; i++) {
                if (tempFieldArray[i].slave_cell_id == storedCellId) {
                  tempFieldArray[i].slave_cell_id = cellId;
                }
              }
            
            } 
          }
          finally {
            model.endUpdate();
          }
        }
        else {
          console.log("Enter Here ELSE")
          let cellId = evt.getProperty("cell").id;
          thisContext.newNavAttribute.cell_id = cellId;
          console.log(cellId)
          console.log("CELL INDEX", storedCellId)
          // let tempCellId = cellId.split("-");
          // thisContext.tempNavAttributeCellId = tempCellId[1];
              for (let i = 0; i < tempNavArray.length; i++) {
                if (tempNavArray[i].Id == storedNavCellId) {
                  tempNavArray[i].cell_id = cellId;
                }
              }     
        }
     }
    });
   }
   else {
    //On-click event if the vertex has type Parameter
    let modalService = this.modalService
    let getAllSlaveArray = this.getAllSlaveArray
    let refreshPage = this.refreshPage
    let toastr = this.toastr;

    let graphData = {
      Id: "",
      mxgraph_name: ""
    }

    this.graph.addListener(mxEvent.CLICK, function (sender, evt) {
      if (evt.properties.cell) {

        let cellId = evt.properties.cell.id
       
        for (let i = 0; i < linkMap.length; i++) {
          if (linkMap[i].slave_cell_id == cellId && linkMap[i].slave_type == "Parameter") {
            let row = {
              slave_name: linkMap[i].slave_name,
              slave_type: linkMap[i].slave_type,
              slave_cell_id: linkMap[i].slave_cell_id,
              slave: linkMap[i].slave,
              mxgraph_id: linkMap[i].mxgraph_id
            }

            for (let j = 0; j < getAllSlaveArray[linkMap[i].slave].Items.Item.length; j++) {
                if (linkMap[i].slave_name == getAllSlaveArray[linkMap[i].slave].Items.Item[j].Name) {
                  let rowArray = {slave_value: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Value, slave_detail: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Detail, ...row};
                  console.log("rowArray",rowArray)
                  // Open Modal if slave_type is a Parameter
                  const modalRef = modalService.open(WriteVisualizationModalComponent);
                  modalRef.componentInstance.row = rowArray;
                  modalRef.result.then((result) => {
                    if (result !== 'fail') {
                        refreshPage;
                        toastr.success("Parameter has been successfuly set.","", {
                          tapToDismiss: true,
                          disableTimeOut: false,
                          timeOut: 2000,
                          positionClass: 'toast-bottom-right'
                        });
                    }
                    else {
                      refreshPage;
                      toastr.error("Setting parameter failed.","", {
                        tapToDismiss: true,
                        disableTimeOut: false,
                        timeOut: 2000,
                        positionClass: 'toast-bottom-right'
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                    modalService.dismissAll();
                  });
                }
            }
          }
        }

        // If the vertex is linked with Navigation Link
        for(let i = 0; i < tempNavArray.length; i++) {
          if (tempNavArray[i].cell_id == cellId) {
            
            graphData.mxgraph_name = tempNavArray[i].mxgraph_name;
            graphData.Id = tempNavArray[i].target_mxgraph_id;
            // Go to the targeted floor based on graph id
            thisContext.onSelectGraph(graphData);
            thisContext.selectedGraph = graphData.mxgraph_name;
          }
        }
   
      }
    });
   }
  }

  /* Function: Refresh component */
  refreshPage() {
    this.router.navigate([this.router.url]);
  }

  /* Function: Reload the entire window page */
  async reloadPage() {
    window.location.reload();
  }

  /* Function: Removes event listener for click */
  removeClickListener() {
    if (this.graph.eventListeners) {
      this.graph.eventListeners = (this.graph.eventListeners).splice(this.graph.eventListeners.length, 2)
      this.graph.mouseListeners = (this.graph.mouseListeners).splice(this.graph.mouseListeners, 2)
    }
  }

  /* Function: Makes API calls every 5 seconds */
  sub(cells) {
    // Normalize the object array through Slave
    const names = this.linkMappingReadConfig.map(o => o.slave);
    const filtered = this.linkMappingReadConfig.filter(({slave}, index) => !names.includes(slave, index + 1))
    // Set time out for 5 seconds
    this.subscription = timer(0, 8000).pipe().subscribe( async () => {
      for(let i = 0; i < filtered.length; i++) {
        if (this.getAllSlaveArray[filtered[i].slave] === "" || !this.getAllSlaveArray[filtered[i].slave]) {
          // Skip if empty
        }
        else {
          this.restService.postData("getSlave", this.authService.getToken(), { type: filtered[i].slave }).toPromise().then(async data => {
                // Success
                if (data["status"] == 200 && data["data"]["rows"] !== false) {    
                    // Re-assign the new data values to controller object
                    this.getAllSlaveArray[filtered[i].slave] = data["data"]["rows"];
                    // Re-add the cells with new value
                    this.refreshCells(cells);
                }
                else {
                  console.log("Can't get Slave data.");
                }
              });
          }
        }
      });
  }

  /* Function: Adding the value to the linked cells on the graph */
  async generateCells(cells) {
        // Populate number of rows in Read Config
        for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
          if (this.linkMappingReadConfig.length === 0) {
            console.log("Attribute is empty");
          } else {
            this.fieldArray.push(this.linkMappingReadConfig[i]);
              // Check if controller object is empty
              if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] === "" || this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] == false) {
                await this.restService.postData("getSlave", this.authService.getToken(), { type: this.linkMappingReadConfig[i].slave }).toPromise().then(data => {
                  // Success
                  if (data["status"] == 200 && data["data"]["rows"] !== false) {    
                     this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] = data["data"]["rows"];
                  }
                  else {
                    console.log("Can't get data for Slave")
                  }
                });
              } 
              // Iterate cells to find the matched controller name
              if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave]) {
                  for (let j = 0; j < (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item).length; j++){
                    if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Name == this.linkMappingReadConfig[i].slave_name) {
                    for (let k = 0; k < (cells.length); k++) {
                      if (cells[k] == null) {
                        // Skip cell if null
                      }
                      else if (cells[k].id == this.linkMappingReadConfig[i].slave_cell_id){
                        // Sets the cell value using the mapped ID
                        cells[k].value = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                      
                      }
                      else {
                        // Skip cell
                      }
                    }
                    }    
                  }   
              } else {
                console.log("Can't get data")
              }
             
          }
        }
  }

  /* Function: Change the value of the cells after getting value from function "sub" */
  async refreshCells(cells) {
    
    for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
      if (this.linkMappingReadConfig.length === 0) {
        console.log("Attribute is empty");
      } else {
          if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] && this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item.length !== 0) {
              // Iterate cells to find the matched controller name
              for (let j = 0; j < this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item.length; j++){
                if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Name == this.linkMappingReadConfig[i].slave_name) {
                for (let k = 0; k < (cells.length); k++) {
                  if (cells[k] == null) {
                    // Skip cell if null
                  }
                  else if (cells[k].id == this.linkMappingReadConfig[i].slave_cell_id){
                    // Sets the cell value using the mapped ID
                    cells[k].value = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                    this.graph.refresh();
                    if (this.isMouseHover == true) {
                      this.highlightRow(this.tempHoverField);
                    }
                    else {
                      this.unhighlightRow();
                    }
                  }
                  else {
                    // Skip cell
                  }
                }
                }    
              }
         } 
        }
    }
  }

  /* Function: Removes the value from a cell after delete */
  async resetCells(cells, id) {

    let getAllSlaveArray = this.getAllSlaveArray;
    for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
      let linkSlave = this.linkMappingReadConfig[i].slave;
      let linkSlaveName = this.linkMappingReadConfig[i].slave_name;
      if (this.linkMappingReadConfig.length === 0) {
        console.log("Attribute is empty");
      } else {   
          if (getAllSlaveArray[linkSlave]) {
            // Iterate cells to find the matched controller name
            for (let j = 0; j < getAllSlaveArray[linkSlave].Items.Item.length; j++){
              if (getAllSlaveArray[linkSlave].Items.Item[j].Name == linkSlaveName) {
                for (let k = 0; k < (cells.length); k++) {
                  if (cells[k] == null) {
                    // Skip cell if null
                  }
                  else if (cells[k].id == id){
                    // Sets the cell value to empty
                    cells[k].value = "";
                    this.graph.refresh();
                  }
                  else {
                    // Skip cell
                  }
                }
              }
              else {
                // Skip cell
              }    
            }
         }    
        }
    }
  }

  /* Function: Re-draw graph */
  async refreshGraph() {

        let doc = mxUtils.parseXml(this.mxgraphData["mxgraph_code"]);
        let codec = new mxCodec(doc);
        let elt = doc.documentElement.firstChild;
        let cells = [];


        while (elt != null) {
          cells.push(codec.decodeCell(elt));
          elt = elt.nextSibling;
        }

        // await this.refreshCells(cells)
        for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
          if (this.linkMappingReadConfig.length === 0) {
            console.log("Attribute is empty");
          } else {
              // Check if controller object is empty
              if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] === "") {
                await this.restService.postData("getSlave", this.authService.getToken(), { type: this.linkMappingReadConfig[i].slave }).toPromise().then(data => {
                  // Success
                  if (data["status"] == 200) {    
                     this.getAllSlaveArray[this.linkMappingReadConfig[i].slave] = data["data"]["rows"];
                     console.log("GetAllSlaveArray",this.getAllSlaveArray);
                  }
                });
              } 
    
              // Iterate cells to find the matched controller name
              for (let j = 0; j < this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item.length; j++){
                if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Name == this.linkMappingReadConfig[i].slave_name) {
                 for (let k = 0; k < (cells.length); k++) {
                  if (cells[k] == null) {
                    // Skip cell if null
                  }
                  else if (cells[k].id == this.linkMappingReadConfig[i].slave_cell_id){
                    // Sets the cell value using the mapped ID
                    cells[k].value = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                    this.graph.refresh();
                  }
                  else {
                    // Skip cell
                  }
                 }
                }    
              }
                 
            }
        }

        this.graph.addCells(cells);

        // Disable mxGraph editing
        this.graph.setEnabled(false);
        // this.centerGraph();

  }


  readChanged(event, isAdd, j) {
   
    console.log("j",j)
    this.readConfig = event;
    
    this.readConfigClass = this.readConfig['Class'];

    this.config.asyncLocalStorage.setItem('cell_value', this.readConfig['Value']);
    
    if(j !== undefined && j !== null){
      this.fieldArray[j].slave_type = this.readConfig['Class'];
    }
    
    if(isAdd == true) {
      console.log(isAdd)
      this.graphClickable = true;
      this.addClickListener();
    }
  }

  
  readTargetFloorChange(event, isAdd) {
    this.newNavAttribute.target_mxgraph_id = event.Id;
    this.isAddNavError = false;
  
    if(isAdd == true) {
      this.graphClickable = true;
      this.addClickListener();
    }
  }

  writeChanged(event) {

    // this.writeConfig = event;
    // localStorage.setItem('write_cell_name', this.writeConfig['Name']);
    // localStorage.setItem('write_cell_value', this.writeConfig['Value']);
    // localStorage.setItem('write_cell_units', this.writeConfig['Units']);
  }

  readConfigSave() {

    // var slave = localStorage.getItem('controller');
    // var slave_name = localStorage.getItem('cell_name');
    var mxgraph_id = this.config.asyncLocalStorage.getItem('mxgraph_id');
    // var slave_cell_id = localStorage.getItem('selectedCellId');

    this.restService.postData("readDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id
    })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {

          console.log("graph success:" + JSON.stringify(data["data"]));

        }
      })
  }

  writeConfigSave() {
    console.log("write");
    var slave = localStorage.getItem('readController');
    var slave_name = localStorage.getItem('write_cell_name');
    var mxgraph_id = localStorage.getItem('mxgraph_id');
    var slave_cell_id = localStorage.getItem('selectedCellId');
    var selectedCellValue = localStorage.getItem('selectedCellValue');

    this.restService.postData("writeDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id, slave: slave, slave_name: slave_name, slave_cell_id: slave_cell_id
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

  /* Function: Saves the array of linked cells into DB */
  async linkMapping() {
    var mxgraph_id = this.mxgraphData["Id"];
    // Destroy all the rows in DB where graph id = mxgraph_id for Navigation Link
    await this.restService.postData("deleteNavLink", this.authService.getToken(), {
      mxgraph_id: mxgraph_id
    })
      .toPromise().then(async data => {
        // Successful
        if (data["status"] == 200) {
          for (let i = 0; i < this.navigationLink.length; i++) {
            let mxgraph_id = this.navigationLink[i].mxgraph_id;
            let cell_id = this.navigationLink[i].cell_id;
            let target_mxgraph_id = this.navigationLink[i].target_mxgraph_id;
            // Add all the new rows in the DB
            await this.restService.postData("addNavLink", this.authService.getToken(), {
              mxgraph_id: mxgraph_id, cell_id: cell_id, target_mxgraph_id: target_mxgraph_id,
            })
              .toPromise().then(async data => {
                if (data["status"] == 200) {
                  this.graph.refresh();
                }
              });  
          }
           // Destroy all the rows in DB where graph id = mxgraph_id for ReadLinkMapping
          await this.restService.postData("deleteReadDetails", this.authService.getToken(), {
            mxgraph_id: mxgraph_id
          })
            .toPromise().then(async data => {
              // Successful
              if (data["status"] == 200) {
                for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
                  let slave = this.linkMappingReadConfig[i].slave;
                  let slave_name = this.linkMappingReadConfig[i].slave_name;
                  let slave_type = this.linkMappingReadConfig[i].slave_type;
                  let slave_cell_id = this.linkMappingReadConfig[i].slave_cell_id;
                  // Add all the new rows in the DB
                  await this.restService.postData("settingReadDetails", this.authService.getToken(), {
                    mxgraph_id: mxgraph_id, slave: slave, slave_name: slave_name, slave_type: slave_type, slave_cell_id: slave_cell_id
                  })
                    .toPromise().then(data => {
                      if (data["status"] == 200) {
                        this.graph.refresh();
                      }
                    })
                }
                let graphData = {
                  Id: this.mxgraphData["Id"],
                  mxgraph_name: this.mxgraphData["mxgraph_name"],
                  mxgraph_code: this.mxgraphData["mxgraph_code"]
                }
                this.onSelectGraph(graphData);
                this.router.navigate([this.router.url]);
                this.toastr.clear();
                this.successToast("Changes has been successfuly saved.")
              }
            })
        }
      });
  }

  // Function to revert changes in read config
  revert() {
    let graphData = {
      Id: this.mxgraphData["Id"],
      mxgraph_name: this.mxgraphData["mxgraph_name"],
      mxgraph_code: this.mxgraphData["mxgraph_code"]
    }
    this.onSelectGraph(graphData);
    this.router.navigate([this.router.url]);
    this.toastr.clear();
  }

  /*
    Function: Event triggered when mxGraph Save Configuration button is selected 
    Inserts mxGraph name & code into backend database
  */
  async mxGraphInsert() {
    if(this.mxGraphForm.value.mxgraph_value && this.mxGraphForm.value.mxgraph_code){
      // Truncate <mxGraphModel> tags
      let code = await this.config.mxGraphFilter(this.mxGraphForm.value.mxgraph_code);
      this.restService.postData("mxGraphUpdate", this.authService.getToken(), { mxgraph_name: this.mxGraphForm.value.mxgraph_value, mxgraph_code: code })
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
                  this.successToast("Successfully added Graph");
                }
              });
          }
      });
    }
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
            this.writeSlaveType=[...this.writeSlaveType,test[i]];
            
            // Assigning slave list into getAllSlaveArray
            // this.writeSlaveType = this.writeSlaveType.reduce((ac,a) => ({...ac,[a]:''}),{});
          }

        }
      });
  }


  async getReadSlaveList() {
    this.loadingIndicator = true;

    // Get Assets
    await this.restService.postData("getSlaveList", this.authService.getToken())
      .toPromise().then(data => {

        // Success
        if (data["status"] == 200) {

          this.rows1 = data["data"].rows;
          var sType = deserialize(this.rows1['Slave']);
          this.slaveArray = this.rows1;

          // Push Slave Types into Array
          for (let i = 0; i < this.rows1['Slave'].length; i++) {
            this.readSlaveType=[...this.readSlaveType,sType[i].Name];
            
            // Assigning slave list into getAllSlaveArray
            this.getAllSlaveArray = this.readSlaveType.reduce((ac,a) => ({...ac,[a]:''}),{});
          }
        }
      });
  }


  writeSlaveChange(event) {

    localStorage.setItem('writeController', event);

    this.restService.postData("getSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {

        this.writeName = true;
        this.writeCode = true;
        this.writeTableData = data["data"]["rows"];
        this.writeTableData = this.writeTableData['Items'];
        this.loadingIndicator = false;
      }
    });
  }


  // Populate slave name drop down
  async readSlaveChange(event) {
    this.newAttribute.name = "";
    this.readConfigClass = "";
    this.isAddError = false;
    await this.config.asyncLocalStorage.setItem('controller', event);

    this.restService.postData("getSlave", this.authService.getToken(), { type: event }).subscribe(data => {
      // Success
      if (data["status"] == 200) {

        this.readName = true;
        this.readCode = true;
        this.readTableData = data["data"]["rows"];
        this.readTableData = this.readTableData['Items'];
        this.loadingIndicator = false;
      }
    });
  }

  // Call dragEnter function when hover in a row
  highlightRow(field) {
    this.tempHoverField = field;
    this.previousStyle = null;
    this.isMouseHover = true;

    var graph = this.graph;

    // Highlights Nav Link Cells
    if (this.activeTab=="tab1") {
      for (let i = 0; i < this.cells.length; i++) {
        if (!this.cells[i]) {
          // Skip
        }
        else if (field.cell_id == this.cells[i].id) {
          this.tempState = this.cells[i];
          this.dragEnter(graph.view.getState(this.cells[i]));
        }
      }
    }
    // Highlights Data Link Cells
    else{
      for (let i = 0; i < this.cells.length; i++) {
        if (!this.cells[i]) {
          // Skip
        }
        else if (field.slave_cell_id == this.cells[i].id) {
          this.tempState = this.cells[i];
          this.dragEnter(graph.view.getState(this.cells[i]));
        }
      }
    }
  }

  // Call dragLeave function when hover out of a row
  unhighlightRow() {
    this.isMouseHover = false;
    var graph = this.graph;
    this.dragLeave(graph.view.getState(this.tempState))  
  }

  // When mouse hover over a row, it will change vertex state in the graph
  dragEnter(state) {
    if (state != null)
    {
      this.previousStyle = state.style;
      state.style = mxUtils.clone(state.style);
      this.updateStyle(state, true);
      state.shape.apply(state);
      state.shape.redraw();
      
      if (state.text != null)
      {
        state.text.apply(state);
        state.text.redraw();
      }
    }
  }

  // When mouse hover out of row, the vertex will go back to original state
  dragLeave(state) {
    if (state != null)
    {
      state.style = this.previousStyle;
      this.updateStyle(state, false);
      state.shape.apply(state);
      state.shape.redraw();
      
      if (state.text != null)
      {
        state.text.apply(state);
        state.text.redraw();
      }
    }
  }

  // Style for vertex state when hovered over row
  updateStyle(state, hover) {
      if (hover)
      {
        state.style[mxConstants.STYLE_FILLCOLOR] = '#00FF00';
        state.style[mxConstants.STYLE_STROKECOLOR] = '#00FF00';
      }
      
      // Sets rounded style for both cases since the rounded style
      // is not set in the default style and is therefore inherited
      // once it is set, whereas the above overrides the default value
      // state.style[mxConstants.STYLE_STROKE_OPACITY] = (hover) ? '60' : '100';
      // state.style[mxConstants.STYLE_FILL_OPACITY] = (hover) ? '40' : '100';
      state.style[mxConstants.STYLE_ROUNDED] = (hover) ? '0' : '0';
      state.style[mxConstants.STYLE_STROKEWIDTH] = (hover) ? '2' : '1';
      // state.style[mxConstants.STYLE_FONTSTYLE] = (hover) ? mxConstants.FONT_BOLD : '0';
  };

  // Update row details after done edit
  async doneEdit(i: number, event, state, index) {

    // Remove cell_value so that other cells wont change value when clicked
    localStorage.removeItem("cell_value");
    console.log(event)
    console.log(this.fieldArray);
    console.log("tempLinkMap", this.tempLinkMap)

    

    let attributeArray = {
      Id: event.Id,
      mxgraph_id: event.mxgraph_id,
      slave: event.slave,
      slave_cell_id: event.slave_cell_id,
      slave_name: event.slave_name.Name,
      slave_type: event.slave_type
    }
    console.log("attributeArray",attributeArray)

    // If click on done editing
    if (state=="done"){
      if(attributeArray.slave_cell_id && attributeArray.slave && attributeArray.mxgraph_id && attributeArray.slave_name && attributeArray.slave_type){
        this.linkMappingReadConfig[index] = attributeArray;
        this.fieldArray[index] = this.linkMappingReadConfig[index];
        this.unsavedToast();
      }
      else {
        // If any of the field is empty, revert to original value
        this.fieldArray[index] = this.tempLinkMap;
      }
    }
    // If click cancel edit, it should revert to original value
    else {
      this.fieldArray[index] = this.tempLinkMap;
    }
    
    this.unhighlightRow();
    // localStorage.removeItem('storedCellId');
    this.storedCellId = "";
    this.readConfigClass = "";
    this.readOnly = -1;
    this.hideAddRow = false;
    this.graphClickable = false;
    this.removeClickListener();
    this.router.navigate([this.router.url])
  }

    
  // Update row details after done edit Nav
    async doneEditNav(i: number, event, state, index) {
  
      let attributeArray = {
        mxgraph_id: event.mxgraph_id,
        cell_id: event.cell_id,
        target_mxgraph_id: event.mxgraph_name.Id,
        mxgraph_name: event.mxgraph_name.mxgraph_name,
      }
      console.log("attributeArray",attributeArray)
  
      // If click on done editing
      if (state=="done"){
        if(attributeArray.mxgraph_id && attributeArray.cell_id && attributeArray.target_mxgraph_id && attributeArray.mxgraph_name){
          this.navigationLink[index] = attributeArray;
          // this.navigationArray[index] = this.navigationLink[index];
          this.unsavedToast();
        }
        else {
          // If any of the field is empty, revert to original value
          this.navigationLink[index] = this.tempNavLinkMap;
        }
      }
      // If click cancel edit, it should revert to original value
      else {
        this.navigationLink[index] = this.tempNavLinkMap;
      }
      
      this.unhighlightRow();
      this.readOnly = -1;
      this.newNavAttribute.cell_id = "";
      this.newNavAttribute.mxgraph_name = "";
      this.hideAddRow = false;
      this.graphClickable = false;
      this.removeClickListener();
      this.router.navigate([this.router.url])
    }

  /* Function: Expands colspan of card */
  expand() {

    
    if (this.cardExpand==true) {
      this.cardExpand = false;
    } else {
      this.cardExpand = true;
    } 

    setTimeout(()=>{ this.centerGraph(); }, 10);

  }

  /* Function: Deletes graph */
  deleteGraph() {
    let rowArray = {mxgraph_id: this.editGraphForm.value.mxgraph_id, mxgraph_name: this.editGraphForm.value.mxgraph_name};
    // Open delete graph modal
    const modalRef = this.modalService.open(DeleteGraphModalComponent);
                  modalRef.componentInstance.row = rowArray;
                  modalRef.result.then((result) => {
                    if(result) {
                      // Open verify user modal
                      const modalRef = this.modalService.open(VerifyDeleteGraphModalComponent);
                      modalRef.componentInstance.row = rowArray;
                      modalRef.result.then((result) => {
                        if(result){
                            this.successToast("Successfully deleted Graph.")
                            window.location.reload();
                        }
                      }).catch((error)=>{
                        console.log(error)
                      })
                    }
                  }).catch((error)=>{
                    console.log(error)
                  })
                
  }

  /* Function: Edits graph name */
  async editGraph() {
    await this.restService.postData("mxGraphEdit", this.authService.getToken(), {mxgraph_id: this.editGraphForm.value.mxgraph_id, mxgraph_name: this.editGraphForm.value.mxgraph_name, previous_mxgraph_name: this.temp_mxgraph_name})
    .toPromise().then(async data => {
    // Successful Update
    if (data["status"] == 200 && data["data"]["rows"] !== false) {
      this.editGraphName = false;
      await this.restService.postData("getMxGraphList", this.authService.getToken())
      .toPromise().then(data => {
        // Success
        if (data["status"] == 200) {
          this.router.navigate([this.router.url])
          this.selectedMxGraph = data["data"].rows;
          this.selectedGraph = this.editGraphForm.value.mxgraph_name
        }
      });
      
    }
   })
    .catch((error)=>{
      console.log(error);
    })
  
  }

  fetchActiveTab(event) {
    console.log(event)
    this.activeTab = event.activeId;
  }

  /* Function: Revert back to original graph name when canceled edit */
  cancelEditGraph() {
    this.editGraphForm.patchValue({
      mxgraph_name: this.temp_mxgraph_name
    });
    
  }

  successToast(msg) {
    this.toastr.success(msg,"", {
      tapToDismiss: true,
      disableTimeOut: false,
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    });
  }

  failToast(msg) {
    this.toastr.error(msg,"", {
      tapToDismiss: true,
      disableTimeOut: false,
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    });
  }

  unsavedToast() {
    this.toastr.warning("You've got some unsaved changes.","", {
      tapToDismiss: false,
      disableTimeOut: true,
      positionClass: 'toast-bottom-full-width'
    });
    this.unsavedStatus = true;
  }

}


