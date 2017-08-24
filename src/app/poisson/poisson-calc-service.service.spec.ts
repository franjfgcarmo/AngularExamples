import { TestBed, inject } from '@angular/core/testing';

import { PoissonCalcServiceService } from './poisson-calc-service.service';

describe('PoissonCalcServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoissonCalcServiceService]
    });
  });

  it('should be created', inject([PoissonCalcServiceService], (service: PoissonCalcServiceService) => {
    expect(service).toBeTruthy();
  }));
});
