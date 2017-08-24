import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasViewComponent } from './canvas-view.component';

describe('CanvasViewComponent', () => {
  let component: CanvasViewComponent;
  let fixture: ComponentFixture<CanvasViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
