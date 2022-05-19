import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyGptimerModalComponent } from './read-only-gptimer-modal.component';

describe('ReadOnlyGptimerModalComponent', () => {
  let component: ReadOnlyGptimerModalComponent;
  let fixture: ComponentFixture<ReadOnlyGptimerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadOnlyGptimerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadOnlyGptimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
