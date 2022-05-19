import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationUserComponent } from './visualization-user.component';

describe('VisualizationUserComponent', () => {
  let component: VisualizationUserComponent;
  let fixture: ComponentFixture<VisualizationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
