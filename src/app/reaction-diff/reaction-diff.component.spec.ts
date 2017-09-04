import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionDiffComponent } from './reaction-diff.component';

describe('ReactionDiffComponent', () => {
  let component: ReactionDiffComponent;
  let fixture: ComponentFixture<ReactionDiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactionDiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
