import { HostListener,Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Config } from '../../config/config';



import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  mxgraphData = [];

  // Selected mxGraph cell ID (ngModel binding)
  selectedCellId;
  selectedWriteCellId;
  selectedCellValue;
  cellValue: any;
  storedCellId: any;

  temp = [];
  loadingIndicator = true;
  description = [];
  items = [];
  cells = [];

  writeSlaveType = [];
  readSlaveType = [];
  linkMappingReadConfig = [];
  slaveArray = [];
  getAllSlaveArray = [];
  getSlaveValue = [];
  tempLinkMap = {};

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

  readConfigClass: any;
  readCellID;
  disablebutton;
  selectedName: any;
  tempState: any;
  previousStyle: any;
  temp_mxgraph_name: any;



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

  constructor(
              private config: Config, 
              private toastr: ToastrService, 
              private modalService: NgbModal, 
              private appService: AppService, 
              private restService: RestService, 
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              ) {
    
    this.appService.pageTitle = 'Visualization Dashboard';
    // modalService = this.modalService;

  }

  subscription: Subscription;


  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  field: any;
  
  // Re-size graph when detect window size change
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event) {
      this.centerGraph();
    }
  }

 
  async ngOnInit() {


    let CircularJSON = require('circular-json');
    this.readOnly = -1;
    this.hideAddRow = true;
    this.tempState = "";
    this.graphClickable = false;
    this.cardExpand = false;
    this.hideEditGraph = true;
    this.editGraphName = false;
    this.storedCellId = "";
    this.toastr.clear();

    // Retrieve stored mxGraphs from database and populate dropdown selection
    this.getMxGraphList();

    //this.getUsers();
    this.getWriteSlaveList();
    await this.getReadSlaveList();

    
    // Prepare initial graph
    this.graph = new mxGraph(this.graphContainer.nativeElement);
    
    this.graph.view.rendering = false;
    
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
    this.loadingIndicator = false;
   
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
    this.subscription.unsubscribe();
    this.toastr.clear();
  }

  addFieldValue() {
    // If attribute is empty, no new rows will be added
    
    if (Object.keys(this.newAttribute).length === 0){
      console.log("Attribute is empty");
    } else {
      console.log("Attribute", this.newAttribute);
        let attributeArray = {
          mxgraph_id: this.mxgraphData["Id"],
          slave: this.newAttribute.controller,
          slave_cell_id: this.newAttribute.mxgraphid,
          slave_name: this.newAttribute.name.Name,
          slave_type: this.newAttribute.name.Class
        }

        this.newAttribute = {};
        console.log(this.fieldArray);
        // Make sure the fields are not empty when adding new row
        if (attributeArray.slave && attributeArray.slave_cell_id && attributeArray.slave_name && attributeArray.slave_type) {
          this.fieldArray.push(attributeArray)
          this.linkMappingReadConfig.push(attributeArray)
          this.readConfigClass = "";
          this.graphClickable = false;
          this.removeClickListener();
          // Show toastr for unsaved changes.
          this.unsavedToast();
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
   
  
  }

 

  async onSelect(i: number, event, e) {

    

    this.tempLinkMap = {
      mxgraph_id: event.mxgraph_id,
      slave: event.slave,
      slave_cell_id: event.slave_cell_id,
      slave_name: event.slave_name,
      slave_type: event.slave_type
    }
    
    console.log("Before tempLinkMap", this.tempLinkMap)
    this.readTableData = [];
    let tableIndex = e.target.id;
    let tempFieldArray = this.fieldArray[tableIndex].slave_cell_id;

    console.log(tempFieldArray)
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

 
    // Clear the fields when on edit
    this.fieldArray[tableIndex].slave = "";
    this.fieldArray[tableIndex].slave_name = "";
    this.fieldArray[tableIndex].slave_type = "";

    
    
    this.readOnly = i
    this.hideAddRow = true;
    this.graphClickable = true;
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

  /* Function: Event triggered when mxGraph is selected from UI dropdown */
  async onSelectGraph(event) {

    // Stops loading indicator  
    this.loadingIndicator = true;  
    this.graphClickable = false;
    this.hideEditGraph = false;
    this.editGraphName = false;
    this.editGraphForm.reset();
    this.readConfigClass = "";
    this.readOnly = -1;
    this.hideAddRow = false;
    this.storedCellId = "";
    this.toastr.clear();

    localStorage.removeItem('cell_value');
    this.newAttribute = {};
    // Clear fieldArray
    this.fieldArray = [];
    // Clear linkMappingReadConfig Array
    this.linkMappingReadConfig = [];

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
          console.log("getLinkMapping for ID " + event.Id, this.linkMappingReadConfig)
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

        // this.mxGraphForm.patchValue({
        //   mxgraph_value: event.mxgraph_name
        // });

        this.centerGraph();

      }
    });

  }

  async addClickListener() {
    console.log(this.fieldArray)
    let model = this.graph.getModel();
    let thisContext = this;
    let linkMap = this.linkMappingReadConfig;
    let tempFieldArray = this.fieldArray;
    let storedCellId = this.storedCellId;
    console.log("CLICK FIELD ARRAY",this.fieldArray)
        
    // On Click event ...
    if (this.graphClickable) {
    this.graph.addListener(mxEvent.CLICK, function (sender, evt) {
      let valued = null
  
      if (evt.properties.cell) {

        // Get event 'cell' property, 'id' subproperty (cell ID)
        let cellId = evt.getProperty("cell").id; 
        console.log("CELL ID",cellId)       
            
        valued = localStorage.getItem('cell_value');
        
        console.log(valued)
        

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
    });
   }
   else {
    //On-click event if the vertex has type Parameter
    let modalService = this.modalService
    let getAllSlaveArray = this.getAllSlaveArray
    let refreshPage = this.refreshPage
    
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
                  let rowArray = {slave_value: getAllSlaveArray[linkMap[i].slave].Items.Item[j].Value, ...row};
                  // Open Modal if slave_type is a Parameter
                  const modalRef = modalService.open(WriteVisualizationModalComponent);
                  modalRef.componentInstance.row = rowArray;
                  modalRef.result.then((result) => {
                    if (result !== 'cancel') {
                      // Open Modal if to verify user
                      const modalVer = modalService.open(VerifyUserModalComponent);
                      modalVer.componentInstance.row = result;
                      modalVer.result.then((result) => {
                        if (result !== "cancel" && result !== "fail") {
                        // this.successToast("Parameter has been successfuly set.")
                        refreshPage;
                        }
                      }).catch((error) => {
                        console.log(error)
                        modalService.dismissAll();
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
   
      }
    });

   }
  }

  refreshPage() {
    this.router.navigate([this.router.url]);
  }

  async reloadPage() {
    window.location.reload();
  }

  removeClickListener() {
    if (this.graph.eventListeners) {
      this.graph.eventListeners = (this.graph.eventListeners).splice(this.graph.eventListeners.length, 2)
    }
  }

  sub(cells) {
    // Normalize the object array through Slave
    const names = this.linkMappingReadConfig.map(o => o.slave);
    const filtered = this.linkMappingReadConfig.filter(({slave}, index) => !names.includes(slave, index + 1))
    console.log(filtered);
    // Set time out for 5 seconds
    this.subscription = timer(0, 5000).pipe().subscribe( async () => {
      for(let i = 0; i < filtered.length; i++) {
        if (this.getAllSlaveArray[filtered[i].slave] === "" || !this.getAllSlaveArray[filtered[i].slave]) {
          // Skip if empty
        }
        else {
          await this.restService.postData("getSlave", this.authService.getToken(), { type: filtered[i].slave }).toPromise().then(async data => {
                // Success
                if (data["status"] == 200 && data["data"]["rows"] !== false) {    
                    // Re-assign the new data values to controller object
                    this.getAllSlaveArray[filtered[i].slave] = data["data"]["rows"];
                    // Re-add the cells with new value
                    await this.refreshCells(cells);
                }
                else {
                  console.log("Can't get Slave data.");
                }
              });
          }
        }
      });
  }

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

              console.log(this.getAllSlaveArray);
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
        console.log("INSIDE GENERATE", this.fieldArray)
  }

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

  async resetCells(cells, id) {
    
    for (let i = 0; i < this.linkMappingReadConfig.length; i++) {
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

  async linkMapping() {
    console.log("LINKMAPPING", this.linkMappingReadConfig)
    var mxgraph_id = this.mxgraphData["Id"];

    // Destroy all the rows in DB where graph id = mxgraph_id
    await this.restService.postData("deleteReadDetails", this.authService.getToken(), {
      mxgraph_id: mxgraph_id
    })
      .toPromise().then(async data => {
        // Successful login
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
          console.log("Link Success")
          let graphData = {
            Id: this.mxgraphData["Id"],
            mxgraph_name: this.mxgraphData["mxgraph_name"],
            mxgraph_code: this.mxgraphData["mxgraph_code"]
          }
          this.onSelectGraph(graphData);
          this.router.navigate([this.router.url]);
          this.toastr.clear();
        }
      })
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
          console.log("getSlave",sType)

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
    this.previousStyle = null;

    var graph = this.graph;
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

  // Call dragLeave function when hover out of a row
  unhighlightRow() {
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
  updateStyle(state, hover)
  {
    if (hover)
    {
      state.style[mxConstants.STYLE_FILLCOLOR] = '#00FF00';
      // state.style[mxConstants.STYLE_FILL_OPACITY] = '40';
      state.style[mxConstants.STYLE_STROKECOLOR] = '#00FF00';
      // state.style[mxConstants.STYLE_STROKE_OPACITY] = '60';
    }
    
    // Sets rounded style for both cases since the rounded style
    // is not set in the default style and is therefore inherited
    // once it is set, whereas the above overrides the default value
    // state.style[mxConstants.STYLE_STROKE_OPACITY] = (hover) ? '60' : '100';
    state.style[mxConstants.STYLE_FILL_OPACITY] = (hover) ? '40' : '100';
    state.style[mxConstants.STYLE_ROUNDED] = (hover) ? '0' : '0';
    state.style[mxConstants.STYLE_STROKEWIDTH] = (hover) ? '2' : '1';
    state.style[mxConstants.STYLE_FONTSTYLE] = (hover) ? mxConstants.FONT_BOLD : '0';
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

  expand() {

    
    if (this.cardExpand==true) {
      this.cardExpand = false;
    } else {
      this.cardExpand = true;
    } 

    setTimeout(()=>{ this.centerGraph(); }, 10);

  }

  deleteGraph() {
    console.log(this.editGraphForm.value.mxgraph_id);
    let rowArray = {mxgraph_id: this.editGraphForm.value.mxgraph_id};
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

  async editGraph() {
    console.log(this.editGraphForm.value);
    await this.restService.postData("mxGraphEdit", this.authService.getToken(), {mxgraph_id: this.editGraphForm.value.mxgraph_id, mxgraph_name: this.editGraphForm.value.mxgraph_name})
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
        // this.router.navigate([this.router.url])
        // await this.onSelectGraph({ Id: this.editGraphForm.value.mxgraph_id, mxgraph_name: this.editGraphForm.value.mxgraph_name });
      
    }
   })
    .catch((error)=>{
      console.log(error);
    })
  
  }

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

  unsavedToast(){
    this.toastr.warning("You've got some unsaved changes.","", {
      tapToDismiss: false,
      disableTimeOut: true,
      positionClass: 'toast-bottom-full-width'
    });
  }
}


