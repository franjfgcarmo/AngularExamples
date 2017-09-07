import { TestBed, inject } from '@angular/core/testing';

import { ColorMapperService } from './color-mapper.service';

describe('ColorMapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorMapperService]
    });
  });

  it('should be created', inject([ColorMapperService], (service: ColorMapperService) => {
    expect(service).toBeTruthy();
  }));
});
