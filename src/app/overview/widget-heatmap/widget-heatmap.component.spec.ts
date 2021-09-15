import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHeatmapComponent } from './widget-heatmap.component';

describe('WidgetHeatmapComponent', () => {
  let component: WidgetHeatmapComponent;
  let fixture: ComponentFixture<WidgetHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
