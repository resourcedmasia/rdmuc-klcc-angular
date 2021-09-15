import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPerformanceModalComponent } from './asset-performance-modal.component';

describe('AssetPerformanceModalComponent', () => {
  let component: AssetPerformanceModalComponent;
  let fixture: ComponentFixture<AssetPerformanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPerformanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPerformanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
