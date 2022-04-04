import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdbComponent } from './tdb.component';

describe('TdbComponent', () => {
  let component: TdbComponent;
  let fixture: ComponentFixture<TdbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
