import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AFrameViewComponent } from './a-frame-view.component';

describe('AFrameViewComponent', () => {
  let component: AFrameViewComponent;
  let fixture: ComponentFixture<AFrameViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AFrameViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AFrameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
