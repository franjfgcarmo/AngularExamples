import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoisonComponent } from './poison.component';

describe('PoisonComponent', () => {
  let component: PoisonComponent;
  let fixture: ComponentFixture<PoisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
