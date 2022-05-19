import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteVisualizationModalComponent } from './write-visualization-modal.component';

describe('WriteVisualizationModalComponent', () => {
  let component: WriteVisualizationModalComponent;
  let fixture: ComponentFixture<WriteVisualizationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteVisualizationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteVisualizationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
