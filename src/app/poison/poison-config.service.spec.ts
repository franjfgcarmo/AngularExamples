import { TestBed, inject } from '@angular/core/testing';

import { PoisonConfigService } from './poison-config.service';

describe('PoisonConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoisonConfigService]
    });
  });

  it('should be created', inject([PoisonConfigService], (service: PoisonConfigService) => {
    expect(service).toBeTruthy();
  }));
});
