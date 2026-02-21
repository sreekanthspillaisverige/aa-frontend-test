import { TestBed } from '@angular/core/testing';

import { BreweryApi } from './brewery-api';

describe('BreweryApi', () => {
  let service: BreweryApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreweryApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
