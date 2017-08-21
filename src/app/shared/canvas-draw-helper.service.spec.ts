import { TestBed, inject } from '@angular/core/testing';

import { CanvasDrawHelperService } from './canvas-draw-helper.service';

describe('CanvasDrawHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasDrawHelperService]
    });
  });

  it('should be created', inject([CanvasDrawHelperService], (service: CanvasDrawHelperService) => {
    expect(service).toBeTruthy();
  }));

});
