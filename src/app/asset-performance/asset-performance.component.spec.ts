import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPerformanceComponent } from './asset-performance.component';

describe('AssetPerformanceComponent', () => {
  let component: AssetPerformanceComponent;
  let fixture: ComponentFixture<AssetPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
