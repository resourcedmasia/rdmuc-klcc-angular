import { HostListener,Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Config } from '../../config/config';
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutService } from '../layout/layout.service';
import ResizeObserver from 'resize-observer-polyfill';

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
import { SetGptimerModalComponent } from './set-gptimer-modal/set-gptimer-modal.component';
import { ReadActiveAlarmComponent } from './read-active-alarm/read-active-alarm.component';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { share } from 'rxjs/operators';
import { kill } from 'process';


declare var mxUtils: any;
declare var mxCodec: any;
declare var mxPoint: any;
declare var mxImage: any;
declare var mxGraph: any;
declare var mxEvent: any;
declare var mxCellHighlight: any;
declare var mxGraphView: any;
declare var cellName: any;
declare var mxConstants: any;
declare var mxCellOverlay: any;
declare var mxGraphHandler: any;

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class VisualizationComponent implements OnInit, OnDestroy {

  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('DatatableComponent') table: DatatableComponent;
  @ViewChild('tabs')
  private tabs: NgbTabset;


  rows = [];
  rows1 = [];
  // Selected mxGraph dropdown
  selectedGraph;
  selectedGraphLanding;
  selectedMxGraph = [];
  graph;
  rO;
  mxgraphData = [];

  // Selected mxGraph cell ID (ngModel binding)
  selectedCellId;
  selectedWriteCellId;
  selectedCellValue;
  cellValue: any;
  storedCellId: any;
  tempNavAttributeCellId: any;
  selectRow: any;
  rowIndex: number;

  temp = [];
  loadingIndicator = true;
  description = [];
  items = [];
  cells = [];
  gpTimerChannels = [];
  gpTimerChannelsDetail = [];

  writeSlaveType = [];
  readSlaveType = [];
  linkMappingReadConfig = [];
  navigationLink = [];
  flowLink = [];
  navigationArray = [];
  slaveArray = [];
  getAllSlaveArray = [];
  getSlaveValue = [];
  getAllActiveAlarms = [];
  mxGraphFloors = [];
  tempLinkMap = {};
  tempNavLinkMap = {};
  tempFlowLinkMap = {};

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
  isAddFlowError: boolean;
  isEdit: boolean;
  activeTab: any;
  selectedTab: any;
  isHoverTooltip: boolean;
  isEditNav: boolean;
  isEditFlow: boolean;
  isRowMoved: boolean;
  isErrorFileType: boolean;
  isUploadedFile: boolean;

  readConfigClass: any;
  readCellID;
  disablebutton;
  selectedName: any;
  tempState: any;
  previousStyle: any;
  temp_mxgraph_name: any;
  tempFieldArray: any;
  isMouseHover: any;
  currentState: any;
  ng_mxgraph_code: any;
  fileUploadEvent: any;
  isDisabledCenter = false;
  landingId: number;
  


  // Add / Edit Graph Configuration Form
  mxGraphForm = new FormGroup({
    mxgraph_value: new FormControl('', Validators.required),
    mxgraph_code: new FormControl('', Validators.required),
    mxgraph_code_file: new FormControl('')
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
  tempFlowCellId: any;
  
 

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
              private _cdRef: ChangeDetectorRef,
              private ngZone: NgZone
              ) {
    
    this.appService.pageTitle = 'Visualization Dashboard';
    // modalService = this.modalService;

  }

  subscription: Subscription;


  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  private newNavAttribute: any = {};
  private newFlowAttribute: any = {};
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
    this.isAddFlowError = false;
    this.isHoverTooltip = false;
    this.currentState = "";
    this.isEditNav = false;
    this.isEditFlow = false;
    this.rowIndex = -1;
    this.isRowMoved = false;
    this.isEdit = false;
    this.isErrorFileType = false;
    this.ng_mxgraph_code = "";
    this.isUploadedFile = false;
    

    // Retrieve stored mxGraphs from database and populate dropdown selection
    this.getMxGraphList();
    this.getMxGraphFloor();

    //this.getUsers();
    // this.getWriteSlaveList();
    this.getReadSlaveList();

    // Listens to element resize event
    this.elementObserver();

    
    // Prepare initial graph
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    
    // this.graph.view.rendering = false;
    this.graph.setTooltips(true);

    // Load default stylesheet for mxGraph
    var loadStylesheet = function (graph, url) {
      var node = mxUtils.load(url).getDocumentElement();
  
      if (node != null) {
          var dec = new mxCodec(node.ownerDocument);
          dec.decode(node, graph.getStylesheet());
      }
    };
    loadStylesheet(this.graph, this.config.DEFAULT_MXGRAPH_STYLESHEET);
    
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
    // this.changeCellColour(this.cells)

    // Disable mxGraph editing
    this.graph.setEnabled(false);

    // Enable HTML markup on labels (https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.htmlLabels)
    this.graph.htmlLabels = true;
    // Add click event
    this.addClickListener();
    // Center and Re-scale graph
    setTimeout(()=> {
      this.centerGraph();
    },0)
    // Disable loading indicator on table
    this.spinner.hide();
   
  }
  

  ngAfterViewInit() {
    this.tabs.select("tab1");
    this.activeTab = "tab1";
    this._cdRef.detectChanges();
  }

  elementObserver() {
    this.rO = new ResizeObserver(async entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.centerGraph();
      }
      
  });

    // Element for which to observe height and width 
    this.rO.observe(this.container.nativeElement);
  }

  centerGraph() {
    if (!this.isDisabledCenter) {
   
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
    var scaledX = (margin + cw - w * s) / (2 * s) - bounds.x / this.graph.view.scale;
    var scaledY = (margin + ch - h * s) / (2 * s) - bounds.y / this.graph.view.scale;
    
    this.graph.view.scaleAndTranslate(s,
      scaledX,
      scaledY);

    // Re-scale the graph to fit the container
    this.graph.fit();
    // Re-render the graph
    this.graph.refresh();
    // this.changeCellColour(this.cells)
    this.animateState(this.cells)
    }
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.toastr.clear();
    this.rO.unobserve(this.container.nativeElement)
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
            slave_type: this.newAttribute.name.Class,
            gpt: this.newAttribute.gpt
          }
        }
        else {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            slave: "",
            slave_cell_id: "",
            slave_name: "",
            slave_type: "",
            gpt: false
          }
        }  

        this.newAttribute = {};
        this.readTableData = [];
        // Make sure the fields are not empty when adding new row
        if (attributeArray.slave && attributeArray.slave_cell_id && attributeArray.slave_name && attributeArray.slave_type) {
          if(this.isRowMoved == true) {
            this.fieldArray.push(attributeArray)
          }
          else {
            this.fieldArray.push(attributeArray)
            this.linkMappingReadConfig.push(attributeArray)
          }
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
          if((this.newNavAttribute.cell_id).includes("-")){
            var tempCellId = this.newNavAttribute.cell_id;
            tempCellId = tempCellId.split("-");
            tempCellId = tempCellId[1];
          }
          else {
            tempCellId = this.newNavAttribute.cell_id;
          }
          
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            cell_id: this.newNavAttribute.cell_id,
            split_cell_id: tempCellId,
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
            split_cell_id: ""
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
        this.isEditNav = false;
    }
    
  }

  async addFlowFieldValue() {
    console.log(this.newFlowAttribute)
    console.log("flow_type",this.newFlowAttribute.flow_type)
    console.log("flow_colour",this.newFlowAttribute.flow_colour)
    // If attribute is empty, no new rows will be added
    if (Object.keys(this.newFlowAttribute).length === 0){
      console.log("Attribute is empty");
    } else {
        var attributeArray;;
        if(Object.keys(this.newFlowAttribute).length > 1) {
          if((this.newFlowAttribute.cell_id).includes("-")){
            var tempCellId = this.newFlowAttribute.cell_id;
            tempCellId = tempCellId.split("-");
            tempCellId = tempCellId[1];
          }
          else {
            tempCellId = this.newFlowAttribute.cell_id;
          }
          
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            cell_id: this.newFlowAttribute.cell_id,
            split_cell_id: tempCellId,
            flow_type: this.newFlowAttribute.flow_type,
            flow_colour: this.newFlowAttribute.flow_colour,
          }
          console.log(attributeArray)
        }
        else {
          attributeArray = {
            mxgraph_id: this.mxgraphData["Id"],
            cell_id: "",
            split_cell_id: "",
            flow_type: "",
            flow_colour: ""
          }
        }  

        this.newFlowAttribute = {};
        // Make sure the fields are not empty when adding new row
        if (attributeArray.mxgraph_id && attributeArray.cell_id && attributeArray.flow_type && attributeArray.flow_colour) {
          this.flowLink.push(attributeArray)
          this.graphClickable = false;
          this.removeClickListener();
          // Show toastr for unsaved changes.
          await this.unsavedToast();
          this.isAddFlowError = false;
          this.animateState(this.cells);
        }
        else {
          this.isAddFlowError = true;
        }
        this.isEditFlow = false;
    }
    
  }

  deleteFieldValue(event, index) {
    console.log("INDEX", index)
    let cell_id;
    if(index == null || index == undefined || index == "") {
      index = this.rowIndex;
    }
    if(this.subscription){
      this.subscription.unsubscribe();
    }

    if(index !== null || index !== undefined || index !== "") {
      setTimeout(async ()=> {
        
          
        if(this.isRowMoved == true) {
          cell_id = this.fieldArray[index].slave_cell_id;
          // Change value cell value to "" after delete
          this.resetCells(this.cells, cell_id);
          // Splice array in Read Config
          this.fieldArray.splice(index,1);
        }
        else {
          cell_id = this.fieldArray[index].slave_cell_id;
          // Change value cell value to "" after delete
          this.resetCells(this.cells, cell_id);
          // Splice array in Read Config
          this.fieldArray.splice(index,1);
          this.linkMappingReadConfig.splice(index,1);
        }

        this.unsavedToast();  
        this.graph.refresh();
        this.animateState(this.cells);
        this.unhighlightRow();
     
      },10)
    }
  }

  deleteNavFieldValue(event) {
    for(let i = 0; i < this.navigationLink.length; ++i){
      if (this.navigationLink[i].cell_id === event.target.id) {
        // Splice array in navigation link
        this.navigationLink.splice(i,1);
        // this.navigationArray.splice(i,1);
        this.unsavedToast();
      }
    }
   this.graph.refresh();
   this.animateState(this.cells);
   this.unhighlightRow();
  }

  deleteFlowFieldValue(event) {
    for(let i = 0; i < this.flowLink.length; ++i){
      if (this.flowLink[i].cell_id === event.target.id) {
        // Splice array in flow link
        this.flowLink.splice(i,1);
        this.unsavedToast();
      }
    }
   this.graph.refresh();
   this.animateState(this.cells);
   this.unhighlightRow();
  }
 
  /* Function: Edits row */
  async onSelect(i: number, event, e) {
    this.isEdit = true;
    if (this.subscription) {
      // Stops subscription when on edit
      this.subscription.unsubscribe();
    }
    console.log("e.target.id",e.target.id)
    let tableIndex = e.target.id;
    this._cdRef.detectChanges();
    if(e.target.id === undefined || e.target.id === null || e.target.id === "") {
      console.log("Index", this.rowIndex)
      tableIndex = this.rowIndex;
    }
    
    if(tableIndex !== null || tableIndex !== undefined || tableIndex !== "") {
      this.removeClickListener();
      this.graphClickable = true;
    setTimeout(async ()=>{
      // this.addClickListener();
      this.tempLinkMap = {
        mxgraph_id: event.mxgraph_id,
        slave: event.slave,
        slave_cell_id: event.slave_cell_id,
        slave_name: event.slave_name,
        slave_type: event.slave_type,
        gpt: event.gpt
      }
      this.readTableData = [];

      for(let i = 0; i < this.fieldArray.length; i++){
        if(i==tableIndex){
          this.tempFieldArray = this.fieldArray[i].slave_cell_id;
            // Clear the fields when on edit
            this.fieldArray[i].slave = "";
            this.fieldArray[i].slave_name = "";
            this.fieldArray[i].slave_type = "";
          
            let tempFieldArray = this.tempFieldArray;
            this.storedCellId = tempFieldArray;
          
            // Call API if the selected slave is not in getAllSlaveArray to get the slave value
            if (this.getAllSlaveArray[event.slave] === "" || this.getAllSlaveArray[event.slave] == false) {
             
            } 
      
            this.readOnly = i
            this.hideAddRow = true;
            this.graphClickable = true;
            this._cdRef.detectChanges();
            this.addClickListener();
          }
      }

    },10);
   }
  }
   
  /* Function: Edits Nav Link row */
  async onEditNav(i: number, event, e) {
    let tableIndex = e.target.id
    if(tableIndex === undefined || tableIndex === null || tableIndex === ""){
      tableIndex = this.rowIndex;
    }

    if(tableIndex !== null || tableIndex !== undefined || tableIndex !== "") {
    this._cdRef.detectChanges();
    setTimeout(()=>{
      this.tempNavCellId = "";
      this.isEditNav = true;
      this.removeClickListener();
      this.graphClickable = true;
      // this.addClickListener();
      
      if((event.cell_id).includes("-")){
        var tempCellId = (event.cell_id).split("-");
        tempCellId = tempCellId[1];
      }
      else {
        var tempCellId = event.cell_id;
      }

      this.tempNavLinkMap = {
        Id: event.Id,
        mxgraph_id: event.mxgraph_id,
        cell_id: event.cell_id,
        split_cell_id: tempCellId,
        mxgraph_name: event.mxgraph_name,
        target_mxgraph_id: event.target_mxgraph_id
      }

        for(let i = 0; i < this.navigationLink.length; i++){
          if(i==tableIndex){
            this.tempNavCellId = tableIndex;
              // Clear the fields when on edit
              this.navigationLink[i].mxgraph_name = "";
              this._cdRef.detectChanges();
          }
        }
    
        this.readOnly = i
        this.hideAddRow = true;
        this._cdRef.detectChanges();
        this.addClickListener();
     
    }, 10);
   }
  }

  /* Function: Edits Flow Link row */
  async onEditFlow(i: number, event, e) {
    let tableIndex = e.target.id
    if(tableIndex === undefined || tableIndex === null || tableIndex === ""){
      tableIndex = this.rowIndex;
    }

    if(tableIndex !== null || tableIndex !== undefined || tableIndex !== "") {
    this._cdRef.detectChanges();
    setTimeout(()=>{
      this.tempFlowCellId = "";
      this.isEditFlow = true;
      this.removeClickListener();
      this.graphClickable = true;
      // this.addClickListener();
      
      if((event.cell_id).includes("-")){
        var tempCellId = (event.cell_id).split("-");
        tempCellId = tempCellId[1];
      }
      else {
        var tempCellId = event.cell_id;
      }

      this.tempFlowLinkMap = {
        Id: event.Id,
        mxgraph_id: event.mxgraph_id,
        cell_id: event.cell_id,
        split_cell_id: tempCellId,
        flow_type: event.flow_type,
        flow_colour: event.flow_colour
      }

        for(let i = 0; i < this.flowLink.length; i++){
          if(i==tableIndex){
            this.tempFlowCellId = tableIndex;
              // Clear the fields when on edit
              this.flowLink[i].flow_type = "";
              this.flowLink[i].flow_colour = "";
              this._cdRef.detectChanges();
          }
        }
    
        this.readOnly = i
        this.hideAddRow = true;
        this._cdRef.detectChanges();
        this.addClickListener();
      
    }, 10);
    }
  }

  /*  Function: Retrieve stored mxGraph data from MySQL database (id, mxgraph_name, mxgraph_code), populate 'this.selected' dropdown list */
  getMxGraphList() {
    this.restService.postData("getMxGraphList", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
        for (const item of data["data"].rows) {
          if (item.is_landing_page === '1') {
            this.onSelectGraph(item);
            this.selectedGraphLanding = item.mxgraph_name;
            this.selectedGraph = item.mxgraph_name;        
          } else {

          }
        }
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
    this.isDisabledCenter = false;
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
    this.isAddFlowError = false;
    this.isHoverTooltip = false;
    this.isEditNav = false;
    this.isEditFlow = false;
    this.isRowMoved = false;
    this.isErrorFileType = false;
    this.isUploadedFile = false;
    this.currentState = "";
    this.rowIndex = -1;
    this.gpTimerChannelsDetail = [];
    this.gpTimerChannels = [];
    this.toastr.clear();
    this.activeTab = "tab1";
    this.tabs.select("tab1");
    this.unhighlightRow();
    this._cdRef.detectChanges();

    localStorage.removeItem('cell_value');
    this.newAttribute = {};
    this.newNavAttribute = {};
    this.newFlowAttribute = {};
    // Clear fieldArray
    this.fieldArray = [];
    // Clear linkMappingReadConfig Array
    this.linkMappingReadConfig = [];
    this.navigationLink = [];
    this.flowLink = [];

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
          console.log("******",this.linkMappingReadConfig)
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
              if((this.navigationLink[i].cell_id).includes("-")){
                var tempCellId = this.navigationLink[i].cell_id;
                tempCellId = tempCellId.split("-");
                tempCellId = tempCellId[1];
                this.navigationLink[i].split_cell_id = tempCellId;
              }
              else {
                var tempCellId = this.navigationLink[i].cell_id;
                this.navigationLink[i].split_cell_id = tempCellId;
              }
              
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

    // Retrieve Flow Link by Graph ID
    await this.restService.postData("getFlowLink", this.authService.getToken(), {
      mxgraph_id: event.Id
    }).toPromise().then(data => {
      if (data["status"] == 200) {
    
          let flowLink = data["data"].rows;
          
          // Push flowLink into array
          for (let i = 0; i < flowLink.length; i++) {
            this.flowLink=[...this.flowLink,flowLink[i]];
            if((this.flowLink[i].cell_id).includes("-")){
              var tempCellId = this.flowLink[i].cell_id;
              tempCellId = tempCellId.split("-");
              tempCellId = tempCellId[1];
              this.flowLink[i].split_cell_id = tempCellId;
            }
            else {
              var tempCellId = this.flowLink[i].cell_id;
              this.flowLink[i].split_cell_id = tempCellId;
            }
          }
      }
    });
    
    //Get GPTimerChannel
    await this.getGPTimerChannels();

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

        this.graph.getModel().clear();

        while (elt != null) {
          cells.push(codec.decodeCell(elt));
          this.graph.refresh();
          elt = elt.nextSibling;
        }
        
        this.cells = cells;
     
        // Iterate read config field and change value of cells
        await this.generateCells(cells) 
        // Stops loading indicator  
        this.loadingIndicator = false;  
        this.graph.addCells(cells);  
        this.graph.refresh();

       
        
       
        this.animateState(cells);

        // this.changeCellColour(cells);

        // GPTimer Overlay
        this.addCellOverlay(cells);

        // Get Active Alarm
        this.getActiveAlarm();

        // Disable mxGraph editing
        this.graph.setEnabled(false);

        this.config.asyncLocalStorage.setItem('mxgraph_id', event.Id);
        this.addClickListener();

        
        this.centerGraph();
        // Stops loading spinner in Table
        this.spinner.hide().then(()=> {
           // Start 5 seconds interval subscription
        if (this.subscription) {
          // If already subscribed, unsubbed to the previous sub
          this.subscription.unsubscribe();
          this.sub(cells);
        } else {
          this.sub(cells);
        }
        });
        

      }
    });
  
  }

  getActiveAlarm() {
    this.restService.postData("getActiveAlarmSoap", this.authService.getToken()).subscribe(data => {  
      // Success
      if (data["status"] == 200 && data["data"]["rows"] !== false && data["data"]["rows"] !== null) { 
        let $responseArray = [];
        $responseArray = data["data"]["rows"];
        this.getAllActiveAlarms = $responseArray;
     
        if ($responseArray.length > 0) {
          let temp = this.graph.getModel().getCell("alarm-id");
          if (temp) {
            this.graph.getModel().remove(temp)
          }
          let parent = this.graph.getDefaultParent();
          var custom = new Object();
          custom[mxConstants.STYLE_SHAPE] = 'image';
          custom[mxConstants.STYLE_IMAGE] = '../../assets/img/warning.gif';
          this.graph.getStylesheet().putCellStyle('customstyle', custom);
          this.graph.insertVertex(parent,"alarm-id",null,0,0,70,70,'customstyle',false)
          this.centerGraph();
        }
        else {
          let temp = this.graph.getModel().getCell("alarm-id");
          if (temp) {
            this.getAllActiveAlarms = [];
            this.graph.getModel().remove(temp);
            this.graph.refresh();
          }
        }
      }
      else {
        let temp = this.graph.getModel().getCell("alarm-id");
        if (temp) {
          this.getAllActiveAlarms = [];
          this.graph.getModel().remove(temp);
          this.graph.refresh();
        }
      }
   });
  }

  animateState(cells) {
    if(this.isEdit == false) {
      for(let i = 0; i < cells.length; i++) {
        let state =  this.graph.view.getState(cells[i]);
        if(state && cells[i] !== null && cells[i] !== undefined) {
          if (state.style.shape == "image") {
            let cellImage = "";
            let arr = [];
            cellImage = state.style.image;
            arr = cellImage.split(";")
            var imageType = arr[0]; 
          }
          else {
            // Skip
          }
        }

        if(cells[i] == null || cells[i] == "" || cells[i] == undefined || state == null || state == "") {
          // Skip Cells
        }
        else if(cells[i] !== null && state.style.shape == "connector") {
          for(let j = 0; j < this.flowLink.length; j++) {
            if( this.flowLink[j].cell_id == cells[i].id ){
              if(this.flowLink[j].flow_type == this.config.FLOW_1) {
                if(this.flowLink[j].flow_colour == this.config.FLOW_RED) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_RED);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_1);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_RED);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_RED);
                }
                else if(this.flowLink[j].flow_colour == this.config.FLOW_BLUE) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_BLUE);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_1);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_BLUE);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_BLUE);
                }
                else if(this.flowLink[j].flow_colour == this.config.FLOW_GREY) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_GREY);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_1);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_GREY);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_GREY);
                }
              }
              else if(this.flowLink[j].flow_type == this.config.FLOW_2) {
                if(this.flowLink[j].flow_colour == this.config.FLOW_RED) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_RED);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_2);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_RED);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_RED);
                }
                else if(this.flowLink[j].flow_colour == this.config.FLOW_BLUE) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_BLUE);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_2);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_BLUE);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_BLUE);
                }
                else if(this.flowLink[j].flow_colour == this.config.FLOW_GREY) {
                  state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
                  state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', this.config.FLOW_COLOUR_GREY);
                  state.shape.node.getElementsByTagName('path')[1].setAttribute('class', this.config.FLOW_2);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('stroke', this.config.FLOW_COLOUR_GREY);
                  state.shape.node.getElementsByTagName('path')[2].setAttribute('fill', this.config.FLOW_COLOUR_GREY);
                }
              }
            }
            else {
              //Skip
            }
          }
        }
        else if(cells[i] !== null && state.style.shape == "image" && imageType == "data:image/png" || imageType == "data:image/jpeg" ) {
          for(let j = 0; j < this.fieldArray.length; j++) {
            if(this.fieldArray[j].slave_cell_id == cells[i].id) {
              let slave = this.fieldArray[j].slave; 
              let slave_name = this.fieldArray[j].slave_name;
              let slave_type = this.fieldArray[j].slave_type;
              
                for (let k = 0; k < this.getAllSlaveArray[slave].Items.Item.length; k++) {
                    if(this.getAllSlaveArray[slave].Items.Item[k].Name == slave_name) {
                    let value = this.getAllSlaveArray[slave].Items.Item[k].Value;
                      if (this.config.CELL_VALUE_ON.indexOf(value) > -1) {
                        state.style = mxUtils.clone(state.style);
                        state.shape.node.removeAttribute('visibility');
                        state.shape.node.setAttribute('class','clockwiseSpin');
                      }
                      else if (this.config.CELL_VALUE_OFF.indexOf(value) > -1) {
                        state.style = mxUtils.clone(state.style);
                        state.shape.node.removeAttribute('clockwiseSpin');         
                      }
                      else {
                        state.style = mxUtils.clone(state.style);
                        state.shape.node.removeAttribute('clockwiseSpin');    
                      }
                  }
                }
            }
          }
        }
        else if(cells[i] !== null &&  state.style.shape == "image" && imageType == "data:image/gif") {
          for(let j = 0; j < this.fieldArray.length; j++) {
            if(this.fieldArray[j].slave_cell_id == cells[i].id) {
              let slave = this.fieldArray[j].slave; 
              let slave_name = this.fieldArray[j].slave_name;
              let slave_type = this.fieldArray[j].slave_type;
              
                for (let k = 0; k < this.getAllSlaveArray[slave].Items.Item.length; k++) {
                    if(this.getAllSlaveArray[slave].Items.Item[k].Name == slave_name) {
                    let value = this.getAllSlaveArray[slave].Items.Item[k].Value;
                      if (this.config.CELL_VALUE_ON.indexOf(value) > -1) {
                        // state.style = mxUtils.clone(state.style);
                        // state.style[mxConstants.STYLE_STROKE_OPACITY] =  '100';
                        state.style[mxConstants.STYLE_FILL_OPACITY] = '100';
                        state.style[mxConstants.STYLE_OPACITY] = '100';   
                        state.shape.apply(state);
                        state.shape.redraw();
                      }
                      else if (this.config.CELL_VALUE_OFF.indexOf(value) > -1) {
                        // state.style = mxUtils.clone(state.style);
                        // state.style[mxConstants.STYLE_STROKE_OPACITY] =  '0';
                        state.style[mxConstants.STYLE_FILL_OPACITY] = '0';    
                        state.style[mxConstants.STYLE_OPACITY] = '0'; 
                        state.shape.apply(state);
                        state.shape.redraw();    
                      }
                      else {
                        // state.style = mxUtils.clone(state.style);
                        // state.style[mxConstants.STYLE_STROKE_OPACITY] =  '100';
                        state.style[mxConstants.STYLE_FILL_OPACITY] = '100';  
                        state.style[mxConstants.STYLE_OPACITY] = '100';
                        state.shape.apply(state);
                        state.shape.redraw();   
                      }
                  }
                }
            }
          }
        }
        else {
          // Skip
          
        }
      }
    }
  }

  /*Function: Change Fill Colour of Cell when met with specific value. Eg: On, Off */
  changeCellColour(cells) {
    for(let i = 0; i < cells.length; i++) {
      let state =  this.graph.view.getState(cells[i]);
      if (cells[i] == null || cells[i] == "") {
        // Skip
        continue;
      }
      else {
        let cellValue = cells[i].value;
        var cellValueTrimmed  = typeof cellValue === 'string' ? cellValue.trim() : '';
      }

      if (cells[i] == null || cells[i] == "") {
        // Skip Cells
        continue;
      }
      else if (this.config.CELL_VALUE_ON.indexOf(cellValueTrimmed) > -1) {
        state.style = mxUtils.clone(state.style);
        state.style[mxConstants.STYLE_FILLCOLOR] = this.config.cell_colour_ON;
        state.shape.apply(state);
        state.shape.redraw();
      }
      else if (this.config.CELL_VALUE_OFF.indexOf(cellValueTrimmed) > -1) {
        state.style = mxUtils.clone(state.style);
        state.style[mxConstants.STYLE_FILLCOLOR] = this.config.cell_colour_OFF;
        state.shape.apply(state);
        state.shape.redraw(); 
      }
    }
  }

  /* Function: Makes the cells on the graph clickable */
  async addClickListener() {
    
    let model = this.graph.getModel();
    let thisContext = this;
    let linkMap = this.linkMappingReadConfig;
    let tempFieldArray = this.fieldArray;
    let tempNavArray = this.navigationLink;
    let tempFlowArray = this.flowLink;
    let storedCellId = this.storedCellId;
    let storedNavCellId = this.tempNavCellId;
    let storedFlowCellId = this.tempFlowCellId;
         
    
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
                      thisContext.isHoverTooltip = false;
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
                      }
                    }
                    for(let i = 0; i < tempFlowArray.length; i++) {
                      if (tempFlowArray[i].cell_id == tmp.cell.id) {
                        this.dragEnter(me.getEvent(), this.currentState, "Flow", tmp, null, null);
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
            
            let cellStyle = evt.target.nodeName;
            thisContext.isHoverTooltip = true;
            if(parameter == "Parameter" && cellStyle !== "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
              if(slave && slave_name){
                thisContext.graph.getTooltipForCell = function(cell)
                {
                  return slave + " - " + slave_name;
                }  
              }
            }
            else if (parameter == "Link" && cellStyle == "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
            }
            else if (parameter == "Flow") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('mouse');
            }
            else if (cellStyle == "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('mouse');
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
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
            }
          },
          dragLeave: function(evt, state)
          {
            // thisContext.isHoverTooltip = false;
          }
      });



    // On Click event ...
    if (this.graphClickable) {
    this.graph.addListener(mxEvent.IS_TOUCH, function (sender, evt) {
      let valued = null
      if (evt.properties.cell) {
        if(thisContext.activeTab == "tab1") {
          // Get event 'cell' property, 'id' subproperty (cell ID)
          let cellId = evt.getProperty("cell").id;    
          valued = localStorage.getItem('cell_value');
          // Update ngModel binding with selected cell ID
          thisContext.newAttribute.mxgraphid = cellId;
          model.beginUpdate();
          try {
            // Get cell from model by cell ID string (https://jgraph.github.io/mxgraph/docs/js-api/files/model/mxGraphModel-js.html#mxGraphModel.getCell)
            let cell = model.getCell(evt.getProperty("cell").id);
            let cellStyle = cell.style;
            let cellValue = cell.value;
            let cellValueTrimmed = cellValue.trim();
            // Set value in cell when clicked
            if (valued) {
              if(cellStyle.includes("image=data:image/gif") || cellStyle.includes("image=data:image")) {
                // Skip
              }
              else {
                if (cellValueTrimmed == "" || cellValueTrimmed == null) {
                  model.setValue(cell, valued);
                }
              }
              
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
        else if(thisContext.activeTab == "tab2"){
          let cellId = evt.getProperty("cell").id;
          thisContext.newNavAttribute.cell_id = cellId;
          if(cellId.includes("-")){
            var splitCellId = cellId.split("-");
            splitCellId = splitCellId[1];
          }
          else {
            var splitCellId = cellId;   
          }
          thisContext.newNavAttribute.split_cell_id = splitCellId;  
          if(thisContext.isEditNav){
            for (let i = 0; i < tempNavArray.length; i++) {
              if (tempNavArray[i] == tempNavArray[storedNavCellId]) {
                  tempNavArray[i].cell_id = cellId;
                  tempNavArray[i].split_cell_id = splitCellId;
                }
              }  
          }
          
        }
        else {
          if(evt.getProperty("cell").isEdge() == true){
            let cellId = evt.getProperty("cell").id;
            thisContext.newFlowAttribute.cell_id = cellId;
            console.log(thisContext.newFlowAttribute)
            if(cellId.includes("-")){
              var splitCellId = cellId.split("-");
              splitCellId = splitCellId[1];
            }
            else {
              var splitCellId = cellId;   
            }
            thisContext.newFlowAttribute.split_cell_id = splitCellId;  
            if(thisContext.isEditFlow){
              for (let i = 0; i < tempFlowArray.length; i++) {
                if (tempFlowArray[i] == tempFlowArray[storedFlowCellId]) {
                    tempFlowArray[i].cell_id = cellId;
                    tempFlowArray[i].split_cell_id = splitCellId;
                }
              }  
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

    this.graph.addListener(mxEvent.IS_TOUCH, function (sender, evt) {
      
      if (evt.properties.cell) {

        let cellStyle = evt.properties.cell.style;
        let cellId = evt.properties.cell.id;
       
        for (let i = 0; i < linkMap.length; i++) {
          if (linkMap[i].slave_cell_id == cellId && linkMap[i].slave_type == "Parameter" && !cellStyle.includes("image=data:image")) {
            let row = {
              slave_name: linkMap[i].slave_name,
              slave_type: linkMap[i].slave_type,
              slave_cell_id: linkMap[i].slave_cell_id,
              slave: linkMap[i].slave,
              mxgraph_id: linkMap[i].mxgraph_id
            }

            for (let j = 0; j < getAllSlaveArray[linkMap[i].slave].Items.Item.length; j++) {
                if (linkMap[i].slave_name == getAllSlaveArray[linkMap[i].slave].Items.Item[j].Name && linkMap[i].slave_type == getAllSlaveArray[linkMap[i].slave].Items.Item[j].Class) {
                  let rowArray = {slave_value: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Value, slave_detail: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Detail, ...row};
                  // Open Modal if slave_type is a Parameter
                  const modalRef = modalService.open(WriteVisualizationModalComponent, {centered:true});
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

        if(cellId == "alarm-id") {
          let row = thisContext.getAllActiveAlarms;
          const modalRef = modalService.open(ReadActiveAlarmComponent);
          modalRef.componentInstance.row = row;
        }
   
      }
    });
   }
  }

  /*Function to add GP Timer Overlay on Cells */
  addCellOverlay(cells){
    var modalService = this.modalService;
    var thisContext = this;
    let graphData = {
      Id: this.mxgraphData["Id"],
      mxgraph_name: this.mxgraphData["mxgraph_name"],
      mxgraph_code: this.mxgraphData["mxgraph_code"]
    }
    for(let i = 0; i < this.linkMappingReadConfig.length; i++ ) {
      for(let j = 0; j < cells.length; j++){
        if(cells[j]=="" || cells[j]==null){
          //Skip
        }
        else if(cells[j].id == this.linkMappingReadConfig[i].slave_cell_id && this.linkMappingReadConfig[i].gpt == "true") {
          let id = this.linkMappingReadConfig[i].slave_cell_id;
          var cell = this.graph.getModel().getCell(id);
          for(let k = 0; k < this.gpTimerChannelsDetail.length; k++) {
            if(this.gpTimerChannelsDetail[k].Details.OutputMask == this.linkMappingReadConfig[i].slave){
              if(this.gpTimerChannelsDetail[k].Status == true) {
                let status = "On"
                this.graph.removeCellOverlays(cell);
                var overlay = new mxCellOverlay(new mxImage('../../assets/img/greenClock.png',10, 10), 'GPTimer Status: '+status,mxConstants.ALIGN_RIGHT,mxConstants.ALIGN_RIGHT,new mxPoint(-6, -6),mxConstants.CURSOR_TERMINAL_HANDLE);
                overlay.addListener(mxEvent.CLICK, function(sender, evt){
                  let row = thisContext.gpTimerChannelsDetail[k];
                  const modalRef = modalService.open(SetGptimerModalComponent);
                  thisContext.isHoverTooltip = false;
                  thisContext.graph.getTooltipForCell = function(tmp){return "";} 
                  modalRef.componentInstance.row = row;
                  modalRef.result.then(async (result) => {
                    console.log(result)
                    if(result == "success") {
                      thisContext.successToast("Successfully saved changes.")
                      thisContext.onSelectGraph(graphData);
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                });
                this.graph.addCellOverlay(cell, overlay);
              }
              else {
                let status = "Off"
                this.graph.removeCellOverlays(cell);
                var overlay = new mxCellOverlay(new mxImage('../../assets/img/redClock.png',10, 10), 'GPTimer Status: '+status,mxConstants.ALIGN_RIGHT,mxConstants.ALIGN_RIGHT,new mxPoint(-6, -6),mxConstants.CURSOR_TERMINAL_HANDLE);
                overlay.addListener(mxEvent.CLICK, function(sender, evt){
                  let row = thisContext.gpTimerChannelsDetail[k];
                  const modalRef = modalService.open(SetGptimerModalComponent);
                  thisContext.isHoverTooltip = false;
                  thisContext.graph.getTooltipForCell = function(tmp){return "";} 
                  modalRef.componentInstance.row = row;
                  modalRef.result.then(async (result) => {
                    console.log(result)
                    if(result == "success") {
                      thisContext.successToast("Successfully saved changes.");
                      thisContext.onSelectGraph(graphData);
                    }
                  }).catch(err => {
                    console.log(err)
                  })
                });
                this.graph.addCellOverlay(cell, overlay);
              }
            }
          }
        }
        else {
          //Skip
        }
      }
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
  async sub(cells) {
    // Normalize the object array through Slave
    const names = this.linkMappingReadConfig.map(o => o.slave);
    const filtered = this.linkMappingReadConfig.filter(({slave}, index) => !names.includes(slave, index + 1))
    // Set time out for 5 seconds
    this.subscription = timer(0, this.config.subscriptionInterval).pipe().subscribe( async () => {      
      let typeArray = [];
      for(let i = 0; i < filtered.length; i++) {
        let typeObj = {};
        typeObj['type'] = filtered[i].slave;
        typeArray.push(typeObj);
      }            
     if (typeArray.length > 0) {
      this.restService.postData("getSlave", this.authService.getToken(), typeArray).subscribe(data => {          
        if (data["data"]["rows"] !== null) {
        // Success
        if (data["status"] == 200 && data["data"]["rows"] !== false && data["data"]["rows"] !== null) { 
          let $responseArray = [];
          $responseArray = data["data"]["rows"];
          for (const data of $responseArray) {
            this.getAllSlaveArray[data.type] = data.data;
          }
        }
        else {
          console.log("Can't get Slave data.");
        }
      }
    }); 
    }
        // Re-add the cells with new value
        this.refreshCells(cells);
        this.getActiveAlarm();
    });

  }

  /* Function: Adding the value to the linked cells on the graph */
  async generateCells(cells) {
        // Populate number of rows in Read Config
        let typeArray = [];
        for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
          if (this.linkMappingReadConfig.length === 0) {
          } else {
            this.fieldArray.push(this.linkMappingReadConfig[i]);
              // Check if controller object is empty
                let typeObj = {};
                typeObj['type'] = this.linkMappingReadConfig[i].slave;
                typeArray.push(typeObj);
              // Iterate cells to find the matched controller name
              if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave]) {
                  for (let j = 0; j < (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item).length; j++){
                    if (this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Name == this.linkMappingReadConfig[i].slave_name) {
                    for (let k = 0; k < (cells.length); k++) {
                      if (cells[k] == null) {
                        // Skip cell if null
                      }
                      else if (cells[k].id == this.linkMappingReadConfig[i].slave_cell_id){
                        let cellStyle = cells[k].style;
                        if(cellStyle.includes("image=data:image/gif") || cellStyle.includes("image=data:image")) {
                          // Skip
                        }
                        else {
                          if(cells[k].value == "" || cells[k].value == null) {
                            let cellValue = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                            let cellUnits = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Units;
                            if(cellUnits && cellUnits == this.config.UNITS_DEGREES_CELCIUS) {
                              // Converts to °C
                              cellUnits = this.config.SYMBOL_UNITS_DEGREES_CELCIUS;
                            }
                            cells[k].value = cellValue + " " + cellUnits;
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
        }
        await this.restService.postData("getSlave", this.authService.getToken(), typeArray).toPromise().then(data => { 

          // Success
        if (data !== null) {
          if (data["data"]["rows"] !== null) {
            if (data["status"] == 200 && data["data"]["rows"] !== false && data["data"]["rows"] !== null) {    
              let $responseArray = [];
              $responseArray = data["data"]["rows"];
              console.log($responseArray.length);
              
             if ($responseArray.length > 0) {
               for (const data of $responseArray) {                
                this.getAllSlaveArray[data.type] = data.data;              
              }
             }
           }
           else {
             console.log("Can't get data for Slave")
           }
          }
        }
        });
  }

  /* Function: Change the value of the cells after getting value from function "sub" */
  refreshCells(cells) {        
    // this.graph.addCells(cells);
    for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
      if (this.linkMappingReadConfig.length === 0) {
        console.log("Attribute is empty");
      } else {
        
          if(this.isHoverTooltip == true && this.currentState) {
            this.currentState.setCursor('pointer');
          }
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
                      let cellStyle = cells[k].style;
                      if(cellStyle.includes("image=data:image/gif") || cellStyle.includes("image=data:image")) {
                        // Skip
                      
                      }
                      else {
                        this.unhighlightRow();
                       
                          let cellValue = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                          let cellUnits = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Units;
                          if(cellUnits && cellUnits == this.config.UNITS_DEGREES_CELCIUS) {
                            // Converts to °C
                            cellUnits = this.config.SYMBOL_UNITS_DEGREES_CELCIUS;
                          }
                          cells[k].value = cellValue + " " + cellUnits;
                                                                    
                        if (this.isMouseHover == true) {
                          this.highlightRow(this.tempHoverField,event);
                        }
                        else {
                          this.unhighlightRow();
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
    }
    this.graph.refresh();
    this.animateState(cells);
    // this.changeCellColour(cells);
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
        let typeArray = [];
        for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
          let typeObj = {};
          typeObj['type'] = this.linkMappingReadConfig[i].slave;
          typeArray.push(typeObj);
          if (this.linkMappingReadConfig.length === 0) {
            console.log("Attribute is empty");
          } else {    
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
        await this.restService.postData("getSlave", this.authService.getToken(), typeArray).toPromise().then(data => {
        // Success
        if (data["status"] == 200) {
          let $responseArray = [];
          $responseArray = data["data"]["rows"];
          for (const data of $responseArray) {
            this.getAllSlaveArray[data.type] = data.data;
          }
        }
      });

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

    // this.linkToast();
    
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

  readTargetFlowChange(event, isAdd) {
    this.newFlowAttribute.flow_type = event;
    this.isAddFlowError = false;
  
    if(isAdd == true) {
      this.graphClickable = true;
      this.addClickListener();
      console.log("added click")
    }
  }

  readTargetFlowColourChange(event) {
    this.newFlowAttribute.flow_colour = event;
    this.isAddFlowError = false;
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
    this.subscription.unsubscribe();
    var mxgraph_id = this.mxgraphData["Id"];
    // Delete all by id
    await this.restService.postData("deleteTablesById", this.authService.getToken(), {
      mxgraph_id: mxgraph_id
    })
    .toPromise().then(async data => {
      console.log('deleteById', data);
      if (data["status"] == 200) {
        // bind navigation link
        for (let i = 0; i < this.navigationLink.length; i++) {
          let mxgraph_id = this.navigationLink[i].mxgraph_id;
          let cell_id = this.navigationLink[i].cell_id;
          let target_mxgraph_id = this.navigationLink[i].target_mxgraph_id;
          await this.restService.postData("addNavLink", this.authService.getToken(), {
            mxgraph_id: mxgraph_id, cell_id: cell_id, target_mxgraph_id: target_mxgraph_id,
          })
            .toPromise().then(async data => {
              if (data["status"] == 200) {
                console.log("Success")
              }
            });  
        }

        // add details on table 
        let newReadConfig = [];
        for (let i = 0; i < this.linkMappingReadConfig.length; i++) {                
        let newObj = {};
        if (this.linkMappingReadConfig[i].gpt==""
        || this.linkMappingReadConfig[i].gpt==null
        || this.linkMappingReadConfig[i].gpt=="false"
        || this.linkMappingReadConfig[i].gpt == undefined)
        {
          this.linkMappingReadConfig[i].gpt = 'false';
        } else {
          this.linkMappingReadConfig[i].gpt = 'true';
        }
        newObj['mxgraph_id'] = this.linkMappingReadConfig[i].mxgraph_id;
        newObj['slave'] = this.linkMappingReadConfig[i].slave;
        newObj['slave_name'] = this.linkMappingReadConfig[i].slave_name;
        newObj['slave_type'] = this.linkMappingReadConfig[i].slave_type;
        newObj['slave_cell_id'] = this.linkMappingReadConfig[i].slave_cell_id;
        newObj['gpt'] = this.linkMappingReadConfig[i].gpt; 
        newReadConfig.push(newObj);
        }
        await this.restService.postData("settingReadDetails", this.authService.getToken(), newReadConfig)
        .toPromise().then( data => {
          if (data['status'] == 200 ) {
            console.log("Success")
          }
        })
      }

      // add flow_link in table
      for (let i = 0; i < this.flowLink.length; i++) {
        let mxgraph_id = this.flowLink[i].mxgraph_id;
        let cell_id = this.flowLink[i].cell_id;
        let flow_type = this.flowLink[i].flow_type;
        let flow_colour = this.flowLink[i].flow_colour;
        // Add all the new rows in the DB
        await this.restService.postData("addFlowLink", this.authService.getToken(), {
          mxgraph_id: mxgraph_id, cell_id: cell_id, flow_type: flow_type, flow_colour: flow_colour
        })
          .toPromise().then(async data => {
            if (data["status"] == 200) {
              console.log("Success")
            }
          });  
      }
    });

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
    if(this.mxGraphForm.value.mxgraph_value && this.mxGraphForm.value.mxgraph_code_file || this.mxGraphForm.value.mxgraph_code){
      var code;
      if(this.isUploadedFile) {
         // Truncate <mxGraphModel> tags
        code = await this.config.mxGraphFilter(this.mxGraphForm.value.mxgraph_code_file);
      }
      else {
         // Truncate <mxGraphModel> tags
        code = await this.config.mxGraphFilter(this.mxGraphForm.value.mxgraph_code);
      }

      this.restService.postData("mxGraphUpdate", this.authService.getToken(), { mxgraph_name: this.mxGraphForm.value.mxgraph_value, mxgraph_code: code })
        .subscribe(data => {
          // Success
          if (data["status"] == 200) {
            // Reset Add / Edit form data
            this.mxGraphForm.reset();
            // Clear file in input type File
            (<HTMLInputElement>document.getElementById('mxGraphCode_id')).value = "";
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

  fileChangeEvent(event){
    const file: FileList = event.target.files;
    this.fileUploadEvent = event.target.value;
    if (!file[0] || file[0].type !== "text/plain") {
      event.target.value = null;
      this._cdRef.detectChanges();
      this.isErrorFileType = true;
      this.isUploadedFile = false;
    }
    else {
      var reader = new FileReader();
      reader.onload = () => {
          this.mxGraphForm.value.mxgraph_code_file = reader.result;
      };
      reader.readAsText(file[0]);
      this.isErrorFileType = false;
      this.mxGraphForm.value.mxgraph_code = "";
      // Clears the mxGraphCode input error if a file had been uploaded
      if (this.mxGraphForm.get('mxgraph_code').errors == null){
        // Skip
      }
      else if (this.mxGraphForm.get('mxgraph_code').errors.required == true) {
        this.mxGraphForm.get('mxgraph_code').errors.required = false;
      }
      else {
        // Skip
      }

      //Check if graph name has been inserted
      if (!this.mxGraphForm.value.mxgraph_value) {
        // Uses file name as mxgraph name
        this.mxGraphForm.patchValue({
          // Slice .txt from file name
          mxgraph_value: this.config.mxFileNameFilter(file[0].name),
        });
      }
      this.isUploadedFile = true;
    }
  }

  
  isMxCodeChange(event) {
    let value = event.target.value;
    if(value.length > 0) {
      // Clears the file input error if a mxGraphCode input is not empty
      this.isErrorFileType = false;
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

    let typeArray = [];
    let typeObj = {};
    typeObj['type'] = event;
    typeArray.push(typeObj);

    this.restService.postData("getSlave", this.authService.getToken(), typeArray).subscribe(data => {
      // Success
      if (data["status"] == 200) {
        this.writeName = true;
        this.writeCode = true;
        this.writeTableData = data["data"]["rows"][0].data;
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

    let typeArray = [];
    let typeObj = {};
    typeObj['type'] = event;
    typeArray.push(typeObj);
    

    this.restService.postData("getSlave", this.authService.getToken(), typeArray).subscribe(data => {
      // Success
      if (data["status"] == 200) {
        this.readName = true;
        this.readCode = true;
        this.readTableData = data["data"]["rows"][0].data;
        this.readTableData = this.readTableData['Items'];
        this.loadingIndicator = false;
      }
    });
  }

  readGPTChanged(event) {
    var checkedValue;
    if(event.target.checked == true) {
      checkedValue = "true";
    }
    else {
      checkedValue = "false";
    }
    this.newAttribute.gpt = checkedValue
  }

  readGPTChangedEdit(event, field) {
    var checkedValue;
    if(event.target.checked == true) {
      checkedValue = "true";
    }
    else {
      checkedValue = "false";
    }
    field.gpt = checkedValue;
  }

  /* Function: Get GPTimerChannels */
  async getGPTimerChannels() {
      await this.restService.postData("getAllGPTimerChannel", this.authService.getToken())
      .toPromise().then(async data => {
        if (data["status"] == 200) {
          this.gpTimerChannels = data["data"].rows;
          this.gpTimerChannelsDetail = this.gpTimerChannels.filter(item => item.Details.OutputMask !== "" && item.Details.OutputMask !== null )
        }
      });
  }

  // Call dragEnter function when hover in a row
  highlightRow(field,event) {
    this.tempHoverField = field;
    this.previousStyle = null;
    this.isMouseHover = true;
    this.rowIndex = event;
    var graph = this.graph;

    // Highlights Nav Link Cells
    if (this.activeTab=="tab2") {
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
    else if(this.activeTab=="tab1"){
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
    // Highlights Flow Link Cells
    else {
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
  }

  // Call dragLeave function when hover out of a row
  unhighlightRow() {
    this.rowIndex = -1;
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
        if(state.style.shape == "image") {
          state.style[mxConstants.STYLE_OPACITY] = '70'; 
          state.style[mxConstants.STYLE_IMAGE_BACKGROUND] = '#00FF00';
          state.style[mxConstants.STYLE_IMAGE_BORDER] = '#00FF00';
        }
        else {
          state.style[mxConstants.STYLE_FILLCOLOR] = '#00FF00';
          state.style[mxConstants.STYLE_STROKECOLOR] = '#00FF00';
        }
        
      }
      
      // Sets rounded style for both cases since the rounded style
      // is not set in the default style and is therefore inherited
      // once it is set, whereas the above overrides the default value
      // state.style[mxConstants.STYLE_STROKE_OPACITY] = (hover) ? '60' : '100';
      // state.style[mxConstants.STYLE_FILL_OPACITY] = (hover) ? '40' : '100';
      // state.style[mxConstants.STYLE_ROUNDED] = (hover) ? '0' : '0';
      // state.style[mxConstants.STYLE_STROKEWIDTH] = (hover) ? '2' : '1';
      // state.style[mxConstants.STYLE_FONTSTYLE] = (hover) ? mxConstants.FONT_BOLD : '0';
  };

  // Update row details after done edit
  async doneEdit(i: number, event, state, index) {

    console.log(index)
    if(index === undefined || index === null || index === "") {
      index = this.rowIndex;
    }

    
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
      slave_type: event.slave_type,
      gpt: event.gpt
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
        this.linkMappingReadConfig[index] = this.tempLinkMap;
      }
    }
    // If click cancel edit, it should revert to original value
    else {
      this.fieldArray[index] = this.tempLinkMap;
      this.linkMappingReadConfig[index] = this.tempLinkMap;
    }
    
    this.unhighlightRow();
    // localStorage.removeItem('storedCellId');
    this.storedCellId = "";
    this.readConfigClass = "";
    this.readOnly = -1;
    this.hideAddRow = false;
    this.graphClickable = false;
    this.removeClickListener();
    this._cdRef.detectChanges();
    this.isEdit = false;
    
    // // Start 5 seconds interval subscription
    // this.sub(this.cells);
    console.log("this.fieldArray[index]",this.fieldArray[index])
    console.log("this.linkMappingReadConfig",this.linkMappingReadConfig)
    // this.router.navigate([this.router.url])
   
  }

  // Update row details after done edit Nav
  async doneEditNav(i: number, event, state, index) {

    console.log(index)
    if(index === undefined || index === null || index === "") {
      index = this.rowIndex;
    }
      
      if((event.cell_id).includes("-")){
        var tempCellId = event.cell_id;
        tempCellId = tempCellId.split("-");
        tempCellId = tempCellId[1];
      }
      else {
        var tempCellId = event.cell_id
      }
      let attributeArray = {
        mxgraph_id: event.mxgraph_id,
        cell_id: event.cell_id,
        split_cell_id: tempCellId,
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
      this.newNavAttribute.split_cell_id = "";
      this.newNavAttribute.mxgraph_name = "";
      this.hideAddRow = false;
      this.graphClickable = false;
      this.isEditNav = false;
      this.tempNavCellId = "";
      this.removeClickListener();
      this._cdRef.detectChanges();
      // this.router.navigate([this.router.url])
  }

  // Update row details after done edit Flow
  async doneEditFlow(i: number, event, state, index) {

    console.log(index)
    if(index === undefined || index === null || index === "") {
      index = this.rowIndex;
    }
      
      if((event.cell_id).includes("-")){
        var tempCellId = event.cell_id;
        tempCellId = tempCellId.split("-");
        tempCellId = tempCellId[1];
      }
      else {
        var tempCellId = event.cell_id
      }
      let attributeArray = {
        mxgraph_id: event.mxgraph_id,
        cell_id: event.cell_id,
        split_cell_id: tempCellId,
        flow_type: event.flow_type,
        flow_colour: event.flow_colour,
      }
      console.log("attributeArray",attributeArray)
  
      // If click on done editing
      if (state=="done"){
        if(attributeArray.mxgraph_id && attributeArray.cell_id && attributeArray.flow_type && attributeArray.flow_colour){
          this.flowLink[index] = attributeArray;
          // this.navigationArray[index] = this.navigationLink[index];
          this.unsavedToast();
        }
        else {
          // If any of the field is empty, revert to original value
          this.flowLink[index] = this.tempFlowLinkMap;
        }
      }
      // If click cancel edit, it should revert to original value
      else {
        this.flowLink[index] = this.tempFlowLinkMap;
      }
      
      this.unhighlightRow();
      this.readOnly = -1;
      this.newFlowAttribute.cell_id = "";
      this.newFlowAttribute.split_cell_id = "";
      this.newFlowAttribute.flow_type = "";
      this.newFlowAttribute.flow_colour = "";
      this.hideAddRow = false;
      this.graphClickable = false;
      this.isEditFlow = false;
      this.tempFlowCellId = "";
      this.removeClickListener();
      this._cdRef.detectChanges();
  }

  /* Function: Expands colspan of card */
  expand() {

    
    if (this.cardExpand==true) {
      this.cardExpand = false;
    } else {
      this.cardExpand = true;
    } 
    this.isDisabledCenter = false;
    setTimeout(()=>{ this.centerGraph(); }, 10);

  }

  /* Function: Deletes graph */
  deleteGraph() {
    let rowArray = {mxgraph_id: this.editGraphForm.value.mxgraph_id, mxgraph_name: this.editGraphForm.value.mxgraph_name};
    // Open delete graph modal
    const modalRef = this.modalService.open(DeleteGraphModalComponent, {centered:true});
                  modalRef.componentInstance.row = rowArray;
                  modalRef.result.then((result) => {
                    if(result) {
                      // Open verify user modal
                      const modalRef = this.modalService.open(VerifyDeleteGraphModalComponent, {centered:true});
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
    this.removeClickListener();
    this.graphClickable = false;
    this.addClickListener();
    this.activeTab = event.nextId;
    this.newFlowAttribute = {};
    this.newNavAttribute = {};
    this.newAttribute = {};
  }

  /* Function: Revert back to original graph name when canceled edit */
  cancelEditGraph() {
    this.editGraphForm.patchValue({
      mxgraph_name: this.temp_mxgraph_name
    });
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldArray, event.previousIndex, event.currentIndex);
    this.linkMappingReadConfig = this.fieldArray;
    this.isRowMoved = true;
  }

  dropNav(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.navigationLink, event.previousIndex, event.currentIndex);
  }

  dropFlow(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.flowLink, event.previousIndex, event.currentIndex);
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



  zoomIn() {
    this.graph.zoomIn();
    let bounds = this.graph.getGraphBounds(); 
    this.graph.view.setTranslate
    (-bounds.x - (bounds.width - this.graph.container.clientWidth) / 3, -bounds.y - 
    (bounds.height - this.graph.container.clientHeight) / 3);  
  }

  zoomOut() {
    this.graph.zoomOut();
    let bounds = this.graph.getGraphBounds(); 
    this.graph.view.setTranslate
    (-bounds.x - (bounds.width - this.graph.container.clientWidth) / 3, -bounds.y - 
    (bounds.height - this.graph.container.clientHeight) / 3);  
  }

  disabledCenter(flag: boolean) {
    this.isDisabledCenter = flag;
  }

  onSelectLanding($event) {
    this.landingId = $event.Id;
    this.selectedGraphLanding = $event.mxgraph_name;
  }

  updateLandingPage() {
    let data = {
      mxgraph_id: this.landingId,
      is_landing_page:1
    };
    this.restService.postData("mxGraphLandingPage", this.authService.getToken(), data)
    .subscribe((data: any) => {
      if (data["data"].rows = true) {
        this.successToast('successfully update landing page');
      } else {
        this.failToast("error on update landing page");
      }
    });
  }
}


