import { TestBed } from '@angular/core/testing';

import { GetHistoryClientService } from './get-history-client.service';

describe('GetHistoryClientService', () => {
  let service: GetHistoryClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetHistoryClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
