import { TestBed } from '@angular/core/testing';

import { NewPayService } from './new-pay.service';

describe('NewPayService', () => {
  let service: NewPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
