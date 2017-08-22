import { TestBed, inject } from '@angular/core/testing';

import { PoissonConfigService } from './poisson-config.service';

describe('PoissonConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoissonConfigService]
    });
  });

  it('should be created', inject([PoissonConfigService], (service: PoissonConfigService) => {
    expect(service).toBeTruthy();
  }));
});
