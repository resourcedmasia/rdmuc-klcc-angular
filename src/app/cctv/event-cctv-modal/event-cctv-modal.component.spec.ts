import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCctvModalComponent } from './event-cctv-modal.component';

describe('EventCctvModalComponent', () => {
  let component: EventCctvModalComponent;
  let fixture: ComponentFixture<EventCctvModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCctvModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCctvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
