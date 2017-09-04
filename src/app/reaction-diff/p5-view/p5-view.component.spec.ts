import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P5ViewComponent } from './p5-view.component';

describe('P5ViewComponent', () => {
  let component: P5ViewComponent;
  let fixture: ComponentFixture<P5ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P5ViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P5ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
