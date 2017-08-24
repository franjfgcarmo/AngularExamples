import { TestBed, inject } from '@angular/core/testing';

import { CanvasDrawService } from '../poisson/views/canvas-view/canvas-draw-service.service';

describe('CanvasDrawService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasDrawService]
    });
  });

  it('should be created', inject([CanvasDrawService], (service: CanvasDrawService) => {
    expect(service).toBeTruthy();
  }));

});
