import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAssetModalComponent } from './modify-asset-modal.component';

describe('ModifyAssetModalComponent', () => {
  let component: ModifyAssetModalComponent;
  let fixture: ComponentFixture<ModifyAssetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyAssetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
