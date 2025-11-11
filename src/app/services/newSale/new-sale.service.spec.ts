import { TestBed } from '@angular/core/testing';

import { NewSaleService } from './new-sale.service';

describe('NewSaleService', () => {
  let service: NewSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
