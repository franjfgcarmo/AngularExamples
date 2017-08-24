import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { F5ViewComponent } from './f5-view.component';

describe('F5ViewComponent', () => {
  let component: F5ViewComponent;
  let fixture: ComponentFixture<F5ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ F5ViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(F5ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
