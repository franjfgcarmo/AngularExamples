import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimControlsComponent } from './sim-controls.component';

describe('SimControlsComponent', () => {
  let component: SimControlsComponent;
  let fixture: ComponentFixture<SimControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
