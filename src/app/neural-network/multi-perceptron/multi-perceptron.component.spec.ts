import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPerceptronComponent } from './multi-perceptron.component';

describe('MultiPerceptronComponent', () => {
  let component: MultiPerceptronComponent;
  let fixture: ComponentFixture<MultiPerceptronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiPerceptronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPerceptronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
