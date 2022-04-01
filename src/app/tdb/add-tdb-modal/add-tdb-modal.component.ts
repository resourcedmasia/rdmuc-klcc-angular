import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-tdb-modal',
  templateUrl: './add-tdb-modal.component.html',
  styleUrls: ['./add-tdb-modal.component.scss']
})
export class AddTdbModalComponent implements OnInit {

  createTdbForm: FormGroup;
  ipRegex = /^[0-9]*\.?[0-9]*$/;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    
    this.createForm();
    console.log(this.createTdbForm.get('ipAddress').errors);

  }

  createForm() {
    this.createTdbForm = this.formBuilder.group({
      tdbName: ['', Validators.required],
      ipAddress: ['', [Validators.pattern(this.ipRegex), Validators.required]]
    });
  }

  createTdb() {

  }

  testIpConnection() {

  }
}
