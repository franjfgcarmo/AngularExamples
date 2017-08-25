import { TestBed, inject } from '@angular/core/testing';

import { PoissonCalcService } from './poisson-calc.service';

describe('PoissonCalcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoissonCalcService]
    });
  });

  it('should be created', inject([PoissonCalcService], (service: PoissonCalcService) => {
    expect(service).toBeTruthy();
  }));
});
