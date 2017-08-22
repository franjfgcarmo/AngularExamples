import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoissonComponent } from './poisson.component';

describe('PoissonComponent', () => {
  let component: PoissonComponent;
  let fixture: ComponentFixture<PoissonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoissonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoissonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
