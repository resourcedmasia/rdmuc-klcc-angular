import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyManagementComponent } from './energy-management.component';

describe('EnergyManagementComponent', () => {
  let component: EnergyManagementComponent;
  let fixture: ComponentFixture<EnergyManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
