import { TestBed, inject } from '@angular/core/testing';

import { ShapeFactoryService } from './shape-factory.service';

describe('ShapeFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeFactoryService]
    });
  });

  it('should be created', inject([ShapeFactoryService], (service: ShapeFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
