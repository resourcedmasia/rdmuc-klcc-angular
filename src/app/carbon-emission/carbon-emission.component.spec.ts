import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEmissionComponent } from './carbon-emission.component';

describe('CarbonEmissionComponent', () => {
  let component: CarbonEmissionComponent;
  let fixture: ComponentFixture<CarbonEmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarbonEmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonEmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
