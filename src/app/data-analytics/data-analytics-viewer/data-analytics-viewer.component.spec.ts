import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAnalyticsViewerComponent } from './data-analytics-viewer.component';

describe('DataAnalyticsViewerComponent', () => {
  let component: DataAnalyticsViewerComponent;
  let fixture: ComponentFixture<DataAnalyticsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAnalyticsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalyticsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
