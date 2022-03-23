import { HostListener,Component, OnDestroy, OnInit, ElementRef, ViewChild, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Config } from '../../config/config';
import { NgxSpinnerService } from "ngx-spinner";
import { LayoutService } from '../layout/layout.service';
import ResizeObserver from 'resize-observer-polyfill';


import { NgbModal, NgbModalOptions, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MxgraphEditComponent } from '../mxgraph-edit/mxgraph-edit.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable, Subscription, timer, fromEvent } from 'rxjs';
import { deserialize } from 'chartist';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { WriteVisualizationModalComponent } from '../visualization/write-visualization-modal/write-visualization-modal.component';
import { ReadOnlyGptimerModalComponent } from '../visualization-user/read-only-gptimer-modal/read-only-gptimer-modal.component';
import { VerifyUserModalComponent } from '../visualization/verify-user-modal/verify-user-modal.component';
import { DeleteGraphModalComponent } from '../visualization/delete-graph-modal/delete-graph-modal.component';
import { VerifyDeleteGraphModalComponent } from '../visualization/verify-delete-graph-modal/verify-delete-graph-modal.component';
import { ReadActiveAlarmComponent } from '../visualization/read-active-alarm/read-active-alarm.component';

declare var mxUtils: any;
declare var mxCodec: any;
declare var mxGraph: any;
declare var mxEvent: any;
declare var mxCellHighlight: any;
declare var mxGraphView: any;
declare var cellName: any;
declare var mxConstants: any;
declare var mxCellOverlay: any;
declare var mxImage: any;
declare var mxPoint: any;
declare var mxTooltipHandler: any;

@Component({
  selector: 'app-visualization-user',
  templateUrl: './visualization-user.component.html',
  styleUrls: ['./visualization-user.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class VisualizationUserComponent implements OnInit, OnDestroy {

  @ViewChild('graphContainer') graphContainer: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('DatatableComponent') table: DatatableComponent;
  @ViewChild('fullScreen') divRef: ElementRef;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  private tabs: NgbTabset;


  rows = [];
  rows1 = [];
  // Selected mxGraph dropdown
  selectedGraph;
  selectedMxGraph = [];
  graph;
  graph2;
  ro;
  roFullScreen;
  mxgraphData = [];
  colour: any;
  cardColour: any;

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
  flowLink = [];
  navigationArray = [];
  slaveArray = [];
  getAllSlaveArray = [];
  getSlaveValue = [];
  getAllActiveAlarms = [];
  mxGraphFloors = [];
  tempLinkMap = {};
  tempNavLinkMap = {};
  gpTimerChannels = [];
  gpTimerChannelsDetail = [];


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
  graphClickable: boolean;
  cardExpand: boolean;
  unsavedStatus: boolean;
  isHoverTooltip: boolean;
  isFullScreen: boolean;
  isTooltipCreated: boolean;
  currentState: any;


  readConfigClass: any;
  readCellID;
  disablebutton;
  selectedName: any;
  tempState: any;
  previousStyle: any;
  temp_mxgraph_name: any;
  tempFieldArray: any;
  isMouseHover: any;
  audio: any;
  alarmSound: any;
  


  // Add / Edit Graph Configuration Form
  mxGraphForm = new FormGroup({
    mxgraph_value: new FormControl(''),
    mxgraph_code: new FormControl('')
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
  observer: ResizeObserver;
 

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
              private zone: NgZone,
              ) {
    
    this.appService.pageTitle = 'Visualization Dashboard';
    this.toastr.overlayContainer = undefined;

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
      this.centerGraph()
    }
  }

 
  async ngOnInit() {

    // Collapse the sidebar
    this.toastr.overlayContainer = this.toastContainer;
    this.layoutService.setCollapsed(true, true);
    let CircularJSON = require('circular-json');
    this.readOnly = -1;
    this.tempState = "";
    this.graphClickable = false;
    this.cardExpand = false;
    this.storedCellId = "";
    this.unsavedStatus = false;
    this.toastr.clear();
    this.isMouseHover = false;
    this.isHoverTooltip = false;
    this.isFullScreen = false;
    this.isTooltipCreated = false;
    this.alarmSound = false;

    this.fullScreenEvent();

    // Retrieve stored mxGraphs from database and populate dropdown selection
    this.getMxGraphList();
    this.getMxGraphFloor();

    // Listens to element resize event
    this.elementObserver();

    //this.getUsers();
    // this.getWriteSlaveList();
    this.getReadSlaveList();

    
    // Prepare initial graph
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    this.graph2 = new mxGraph(this.divRef.nativeElement);
    
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

    this.renderXml(this.config.XMLnograph); 
  }

  renderXml(config) {
    // Default no graph from config.ts 
    let xml = config;
    let doc = mxUtils.parseXml(xml);
    let codec = new mxCodec(doc);
    let elt = doc.documentElement.firstChild;
    let cells = [];

    while (elt != null) {
      cells.push(codec.decodeCell(elt));
      elt = elt.nextSibling;
    }

    cells = cells.filter(function (el) {
      return el != null;
    });

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
    this.getCardColour();
  }

  elementObserver() {
    this.ro = new ResizeObserver(async entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        setTimeout(()=> {
          this.changeCellColour(this.cells);
          this.animateState(this.cells);
          this.centerGraph();
          this._cdRef.detectChanges();
        },0);
      }
    });

    // Element for which to observe height and width 
    this.ro.observe(this.container.nativeElement);
    this.ro.observe(this.divRef.nativeElement);
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

    this.changeCellColour(this.cells);
    this.animateState(this.cells);
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
          if(!this.alarmSound){
            this.playAlarmAudio();
          }
          this.centerGraph();
        }
        else {
          let temp = this.graph.getModel().getCell("alarm-id");
          if (temp) {
            this.getAllActiveAlarms = [];
            this.graph.getModel().remove(temp);
            this.graph.refresh();
            if(this.alarmSound){
              this.stopAlarmAudio();
            }
          }
        }
      }
      else {
        let temp = this.graph.getModel().getCell("alarm-id");
        if (temp) {
          this.getAllActiveAlarms = [];
          this.graph.getModel().remove(temp);
          this.graph.refresh();
          this.centerGraph();
          if(this.alarmSound){
            this.stopAlarmAudio();
          }
        }
      }
   });
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.toastr.clear();
    this.ro.unobserve(this.container.nativeElement)
    this.ro.unobserve(this.divRef.nativeElement);
  }


  /*  Function: Retrieve stored mxGraph data from MySQL database (id, mxgraph_name, mxgraph_code), populate 'this.selected' dropdown list */
  getMxGraphList() {
    this.restService.postData("getMxGraphList", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          for (const item of data["data"].rows) {
            if (item.is_landing_page === '1') {
              this.selectedGraph = item.mxgraph_name;  
              this.renderXml(this.config.XMLLoading);
              this.onSelectGraph(item);
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
    this.spinner.show();
    this.graphClickable = false;
    this.editGraphForm.reset();
    this.readConfigClass = "";
    this.readOnly = -1;
    this.storedCellId = "";
    this.unsavedStatus = false;
    this.isHoverTooltip = false;
    this.currentState = "";
    this.gpTimerChannelsDetail = [];
    this.gpTimerChannels = [];
    this.toastr.clear();
    this.alarmSound = false;

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
              await this.restService.postData("getMxGraphCodeByID", this.authService.getToken(), {
                id: result[i].target_mxgraph_id
              }).toPromise().then(async data => {
                // Success
                if (data["status"] == 200) {
                  let mxgraphData = data["data"].rows[0];
                  let targetMxGraphName = {
                    mxgraph_name: mxgraphData["mxgraph_name"],
                  }
                  // this.graphContainer.nativeElement.style.display = "none";
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
    // await this.getGPTimerChannels();

    // Clear the existing graph
    this.graph.getModel().clear();

    // Retrieve graph XML by ID
    await this.restService.postData("getMxGraphCodeByID", this.authService.getToken(), {
      id: event.Id
    }).toPromise().then(async data => {
      this.mxgraphData = [];
      let mxgraphData = [];
      // Success
      if (data["status"] == 200) {
        mxgraphData = data["data"].rows[0];
        this.mxgraphData = data["data"].rows[0];
        let doc = mxUtils.parseXml(mxgraphData["mxgraph_code"]);
        let codec = new mxCodec(doc);
        let elt = doc.documentElement.firstChild;
        let cells = [];
        this.cells = [];


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

        this.graph.addCells(cells);
        this.changeCellColour(this.cells)

        // GPTimer Overlay
        // this.addCellOverlay(cells);

        // Get Active Alarm
        this.getActiveAlarm();

        // Disable mxGraph editing
        this.graph.setEnabled(false);

        this.config.asyncLocalStorage.setItem('mxgraph_id', event.Id);
        this.addClickListener();

        this.centerGraph();
        // Stops loading spinner in Table
        this.spinner.hide().then(()=>{
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

  /* Function: Change the opacity of Image if value == 'On','Off' */
  animateState(cells) {
   
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
                        state.style[mxConstants.STYLE_FILL_OPACITY] = '100';
                        state.style[mxConstants.STYLE_OPACITY] = '100';   
                        state.shape.apply(state);
                        state.shape.redraw();
                      }
                      else if (this.config.CELL_VALUE_OFF.indexOf(value) > -1) {
                        state.style[mxConstants.STYLE_FILL_OPACITY] = '0';    
                        state.style[mxConstants.STYLE_OPACITY] = '0'; 
                        state.shape.apply(state);
                        state.shape.redraw();    
                      }
                      else {
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
  

  /* Function: Makes the cells on the graph clickable */
  async addClickListener() {
    let thisContext = this;
    let linkMap = this.linkMappingReadConfig;
    let tempNavArray = this.navigationLink;
  
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

              if ((tmp != null && !
                thisContext.graph.getModel().isVertex(tmp.cell)))
              {
                  tmp = null;
              }

              if (tmp != this.currentState)
              {
                  if (this.currentState != null)
                  {
                      thisContext.isHoverTooltip = false;
                      this.dragLeave(me.getEvent(), this.currentState);
                      thisContext.graph.getTooltipForCell = function(tmp)
                        {
                          return "";
                        }  
                  }

                  this.currentState = tmp;

                  if (this.currentState != null)
                  {
                    if(tmp.cell.id == "alarm-id") {
                      this.dragEnter(me.getEvent(), this.currentState, "Alarm", tmp, null, null);
                    }
                    for(let i = 0; i < tempNavArray.length; i++) {
                      if (tempNavArray[i].cell_id == tmp.cell.id) {
                        this.dragEnter(me.getEvent(), this.currentState, "Link", tmp, null, null);
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
          mouseUp: function(sender, me) {} ,
          mouseDown: function(sender, me) {},
          dragEnter: function(evt, state, parameter, cell, slave, slave_name)
          {
            // if(thisContext.isTooltipCreated == false) {
            //   thisContext.isTooltipCreated = true;
            //   mxTooltipHandler.prototype.init = function() {
            //     if (document.body != null) {
            //       const container = this.graph.container;
            //       this.div = document.createElement("div");
            //       this.div.className = "mxTooltip";
            //       this.div.style.visibility = "hidden";
            
            //       container.appendChild(this.div);
            
            //       mxEvent.addGestureListeners(
            //         this.div,
            //         mxUtils.bind(this, function(evt) {
            //           this.hideTooltip();
            //         })
            //       );
            //     }
            //   };

            //   mxTooltipHandler.prototype.reset = function(
            //     me,
            //     restart,
            //     state
            //   ) {
            //     if (mxEvent.isMouseEvent(me.getEvent())) {
            //       this.resetTimer();
            //       state = state != null ? state : this.getStateForEvent(me);
            //       if (
            //         restart &&
            //         this.isEnabled() &&
            //         state != null &&
            //         (this.div == null || this.div.style.visibility == "hidden")
            //       ) {
            //         var node = me.getSource();
            //         if(!node.attributes.x){
            //           return
            //         }
            //         var x = parseInt(node.attributes.x.nodeValue);
            //         var y = parseInt(node.attributes.y.nodeValue);
            
            //         var stateSource =
            //           me.isSource(state.shape) || me.isSource(state.text);
            
            //         this.thread = window.setTimeout(
            //           mxUtils.bind(this, function() {
            //             if (
            //               !thisContext.graph.isMouseDown
            //             ) {
            
            //               thisContext.graph.getTooltipForCell = function(cell)
            //               {
            //                 return slave + " - " + slave_name;
            //               }
            //               // this.show(tip, x+50, y-50);
            //               this.state = state;
            //               this.node = node;
            //               this.stateSource = stateSource;
            //             }
            //           }),
            //           this.delay
            //         );
            //       }
            //     }
            //   };

            // }
              
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
            else if (parameter == "Alarm" && cellStyle == "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
              thisContext.graph.getTooltipForCell = function(cell)
                {
                  return thisContext.getAllActiveAlarms.length + ' Active Alarms.';
                } 
            }
            else if (parameter == "Link" && cellStyle == "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
            }
            else if(parameter == "Non-Parameter"){
              if(slave && slave_name){
                thisContext.graph.getTooltipForCell = function(cell)
                {
                  return slave + " - " + slave_name;
                }  
              }
            }
            else if (cellStyle == "image") {
              thisContext.currentState = this.currentState
              this.currentState.setCursor('mouse');
            }
            else{
              thisContext.currentState = this.currentState
              this.currentState.setCursor('pointer');
            }
          },
          dragLeave: function(evt, state)
          {
            // thisContext.isHoverTooltip = false;
            mxTooltipHandler.prototype.hide();
            this.currentState.setCursor('mouse')
          }
      });


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

        let cellId = evt.properties.cell.id
        let cellStyle = evt.properties.cell.style;
       
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
                if (linkMap[i].slave_name == getAllSlaveArray[linkMap[i].slave].Items.Item[j].Name) {
                  let rowArray = {slave_value: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Value, slave_detail: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Detail, ...row};
                  console.log("rowArray",rowArray)
                  // Open Modal if slave_type is a Parameter
                  const options: NgbModalOptions = {
                    backdropClass: '.app-session-modal-backdrop',
                    windowClass: '.app-session-modal-window',
                    centered: true,
                    container: '#fullScreen'
                  };
                  const modalRef = modalService.open(WriteVisualizationModalComponent, options);
                  modalRef.componentInstance.row = rowArray;
                  modalRef.result.then((result) => {
                    if (result !== 'fail') {
                        refreshPage;
                        toastr.success("Parameter has been successfuly set.","", {
                          tapToDismiss: true,
                          disableTimeOut: false,
                          timeOut: 2000,
                          positionClass: 'toast-bottom-right',
                          
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
          const options: NgbModalOptions = {
            backdropClass: '.app-session-modal-backdrop',
            windowClass: '.app-session-modal-window',
            centered: true,
            container: '#fullScreen'
          };
          const modalRef = modalService.open(ReadActiveAlarmComponent, options);
          modalRef.componentInstance.row = row;
        }
   
      }
    });

   
  }

  /*Function to add GP Timer Overlay on Cells */
  addCellOverlay(cells){
    console.log(this.linkMappingReadConfig)
    var modalService = this.modalService;
    var thisContext = this;
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
                  thisContext.isHoverTooltip = false;
                  thisContext.graph.getTooltipForCell = function(tmp){return "";}  
                  let row = thisContext.gpTimerChannelsDetail[k];
                  const options: NgbModalOptions = {
                    backdropClass: '.app-session-modal-backdrop',
                    windowClass: '.app-session-modal-window',
                    centered: true,
                    container: '#fullScreen'
                  };
                  const modalRef = modalService.open(ReadOnlyGptimerModalComponent,options);
                  modalRef.componentInstance.row = row;
                  modalRef.result.then((result) => {}).catch(err => {
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
                  thisContext.isHoverTooltip = false;
                  thisContext.graph.getTooltipForCell = function(tmp){return "";} 
                  let row = thisContext.gpTimerChannelsDetail[k];
                  const options: NgbModalOptions = {
                    backdropClass: '.app-session-modal-backdrop',
                    windowClass: '.app-session-modal-window',
                    centered: true,
                    container: '#fullScreen'
                  };
                  const modalRef = modalService.open(ReadOnlyGptimerModalComponent,options);
                  modalRef.componentInstance.row = row;
                  modalRef.result.then((result) => {}).catch(err => {
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

      if (cells[i] == null || cells[i] == "" || !state) {
        // Skip Cells
        continue;
      }
      else if (this.config.CELL_VALUE_ON.indexOf(cellValueTrimmed) > -1) {
        // state.style = mxUtils.clone(state.style);
        state.style[mxConstants.STYLE_FILLCOLOR] = this.config.cell_colour_ON;
        state.shape.apply(state);
        state.shape.redraw();
      }
      else if (this.config.CELL_VALUE_OFF.indexOf(cellValueTrimmed) > -1) {
        // state.style = mxUtils.clone(state.style);
        state.style[mxConstants.STYLE_FILLCOLOR] = this.config.cell_colour_OFF;
        state.shape.apply(state);
        state.shape.redraw(); 
      }
      else {
        // Skip
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
      this.graph.eventListeners = (this.graph.eventListeners).splice(this.graph.eventListeners.length, 2);
      this.graph.mouseListeners = (this.graph.mouseListeners).splice(this.graph.mouseListeners, 2);
    }
  }

  /* Function: Makes API calls every 5 seconds */
  sub(cells) {
    // Normalize the object array through Slave
    const names = this.linkMappingReadConfig.map(o => o.slave);
    const filtered = this.linkMappingReadConfig.filter(({slave}, index) => !names.includes(slave, index + 1))
    // Set time out for 5 seconds
    this.subscription = timer(0, this.config.subscriptionInterval).pipe().subscribe( async() => {      
      let typeArray = [];
      for(let i = 0; i < filtered.length; i++) {
        let typeObj = {};
        typeObj['type'] = filtered[i].slave;
        typeArray.push(typeObj);
      }      
      if (typeArray.length > 0) {
      this.restService.postData("getSlave", this.authService.getToken(), typeArray).subscribe(data => {        
        // Success
      if (data["data"]["rows"] !== null) {
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
            console.log("Attribute is empty");
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
                        else{
                          // Sets the cell value using the mapped ID
                          if(cells[k].value == "" || cells[k].value == null) {
                            let cellValue = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                            let cellUnits = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Units;
                            if(cellUnits && cellUnits == this.config.UNITS_DEGREES_CELCIUS) {
                              // Converts to °C
                              cellUnits = this.config.SYMBOL_UNITS_DEGREES_CELCIUS;
                            }
                            cells[k].value = cellValue + " " + cellUnits;
                          }
                          
                          // this.graph.refresh();
                          this.graph.addCells(cells);
                        }
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
        await this.restService.postData("getSlave", this.authService.getToken(), typeArray).toPromise().then(data => {
        if (data !== null) {  
          // Success
          if (data["data"]["rows"] !== null) {
            if (data["status"] == 200 && data["data"]["rows"] !== false && data["data"]["rows"] !== null) {    
              let $responseArray = [];
              $responseArray = data["data"]["rows"];
              for (const data of $responseArray) {
                this.getAllSlaveArray[data.type] = data.data;              
              }
            }
            }
            else {
              console.log("Can't get data for Slave")
            }
          }
        });
        
    // this.changeCellColour(cells);
    // this.animateState(cells);
    
  }

  /* Function: Change the value of the cells after getting value from function "sub" */
  async refreshCells(cells) {
    // this.graph.addCells(cells);
    // this.animateState(cells);
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
                      let cellStyle = cells[k].style;
                      if(cellStyle.includes("image=data:image/gif") || cellStyle.includes("image=data:image")) {
                        // Skip
                      }
                      else {
                        // Sets the cell value using the mapped ID
                      
                          let cellValue = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Value;
                          let cellUnits = this.getAllSlaveArray[this.linkMappingReadConfig[i].slave].Items.Item[j].Units;
                          if(cellUnits && cellUnits == this.config.UNITS_DEGREES_CELCIUS) {
                            // Converts to °C
                            cellUnits = this.config.SYMBOL_UNITS_DEGREES_CELCIUS;
                          }
                          cells[k].value = cellValue + " " + cellUnits;
                        
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
    this.animateState(cells)
    this.changeCellColour(cells);
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

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
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

  async openFullscreen() {
    // Use this.divRef.nativeElement to request fullscreen
    const elem = this.divRef.nativeElement;
  
    if (elem.requestFullscreen) {
      await elem.requestFullscreen().then(()=>{
        setTimeout(()=>{ this.centerGraph(); }, 100);
      });
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen().then(()=>{
        setTimeout(()=>{ this.centerGraph(); }, 0);
      });
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen().then(()=>{
        setTimeout(()=>{ this.centerGraph(); }, 0);
      });
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen().then(()=>{
        setTimeout(()=>{ this.centerGraph(); }, 0);
      });
    }
    setTimeout(()=>{ this.centerGraph(); }, 0);
  }

  fullScreenEvent() {
    var thisC = this;
    // this.isFullScreen = true;
    document.addEventListener("fullscreenchange", function() {
      if(thisC.isFullScreen == true) {
        thisC.isFullScreen = false;
      }
      else {
        thisC.isFullScreen = true;
        setTimeout(()=>{ thisC.centerGraph(); }, 100);
      }   
    });
    document.addEventListener("mozfullscreenchange", function() {
      if(thisC.isFullScreen == true) {
        thisC.isFullScreen = false;
      }
      else {
        thisC.isFullScreen = true;
        setTimeout(()=>{ thisC.centerGraph(); }, 100);
      }
    });
    document.addEventListener("webkitfullscreenchange", function() {
      if(thisC.isFullScreen == true) {
        thisC.isFullScreen = false;
      }
      else {
        thisC.isFullScreen = true;
        setTimeout(()=>{ thisC.centerGraph(); }, 100);
      }
    });
    document.addEventListener("msfullscreenchange", function() {
      if(thisC.isFullScreen == true) {
        thisC.isFullScreen = false;
      }
      else {
        thisC.isFullScreen = true;
        setTimeout(()=>{ thisC.centerGraph(); }, 100);
      }
    });
    setTimeout(()=>{ thisC.centerGraph(); }, 100);
    thisC._cdRef.detectChanges();
  }

  async getCardColour() {
    this.cardColour = await this.config.asyncLocalStorage.getItem('cardColour')
    this.colour = this.cardColour;
    if(!this.colour || this.colour == undefined){
      this.colour = "#ffffff";
      this.cardColour = "#ffffff";
    }
}

  async changeCardColour(event) {
  this.cardColour = event;
  await this.config.asyncLocalStorage.setItem('cardColour', event);
}

playAlarmAudio(){
  this.audio = new Audio();
  this.audio.src = "../../assets/audio/mxgraph-alarm.wav";
  this.audio.loop = true;
  this.audio.load();
  this.audio.play();
  this.alarmSound = true;
}

stopAlarmAudio(){
  console.log("alarm stop")
  this.audio.pause();
  this.alarmSound = false;
}

}


