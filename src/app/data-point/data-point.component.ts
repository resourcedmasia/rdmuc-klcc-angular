import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ModalDataPointComponent } from './modal-data-point/modal-data-point.component';

type AOA = any[][];

@Component({
  selector: 'app-data-point',
  templateUrl: './data-point.component.html',
  styleUrls: ['./data-point.component.scss']
})
export class DataPointComponent implements OnInit {
  facilityList = ['Menara 3', 'Menara 2'];
  selectedFacilityID;
  servicesList = ['Alarm', 'VTT'];
  selectedServices;



  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  placeholder: string = 'Upload File';

  // form
  fileName: string;
  uploadDataForm: FormGroup;

  // table
  multipleTabData = [];


  hideTabPreview = false;






  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.createUploadDataForm();
  }

  createUploadDataForm() {
    this.uploadDataForm = this.formBuilder.group({
      facilityName: [null, Validators.required],
      services: [null, Validators.required],
      fileUpload: ['', Validators.required]
    });
  }

  onFileChange(evt: any) {
    this.multipleTabData = [];
    this.hideTabPreview = true;
    let file = evt.target.files[0];
    this.placeholder = file.name;
    
    this.uploadDataForm.patchValue({
      fileUpload: evt.target.files[0]
    })
    
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      if (wb.SheetNames.length > 1){
        for (const  item of wb.SheetNames) {
          const objSheet = {};
          objSheet['name'] = item;
          let tempData: XLSX.WorkSheet;
          tempData = wb.Sheets[objSheet['name']];
          objSheet['data'] = <AOA>(XLSX.utils.sheet_to_json(tempData, { header: 1 }));
          this.multipleTabData.push(objSheet);
        }
        console.log(this.multipleTabData);
      } else {
        const objSheet = {};
        objSheet['name'] = wb.SheetNames[0];
        let tempData: XLSX.WorkSheet;
        tempData = wb.Sheets[wb.SheetNames[0]];
        objSheet['data'] = <AOA>(XLSX.utils.sheet_to_json(tempData, { header: 1 }));
        this.multipleTabData.push(objSheet);
      }

      
      
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  cancel() {
    this.multipleTabData = [];
    this.hideTabPreview = false;
    this.uploadDataForm.reset();
    this.placeholder = 'Upload File';
  }

  previewTable(data: any){
    console.log(data);
    const modalRef = this.modalService.open(ModalDataPointComponent, {size: 'lg'}); 
    modalRef.componentInstance.data = data; 
  }

}
