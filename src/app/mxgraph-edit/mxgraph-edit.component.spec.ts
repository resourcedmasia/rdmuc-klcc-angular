import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MxgraphEditComponent } from './mxgraph-edit.component';

describe('MxgraphEditComponent', () => {
  let component: MxgraphEditComponent;
  let fixture: ComponentFixture<MxgraphEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MxgraphEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MxgraphEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
