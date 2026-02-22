import { TestBed } from '@angular/core/testing';

import { BreweryApi } from './brewery-api';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Brewery } from '../models/brewery.model';

describe('BreweryApi', () => {
  let api: BreweryApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreweryApi, provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(BreweryApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls api endpoint with query, per_page and page parameters', () => {
    const mock: Brewery[] = [];
    api.searchBreweries('test', 5).subscribe((res) => {
      expect(res).toEqual(mock);
    });
    const req = httpMock.expectOne((req) => {
      return (
        req.url === 'https://api.openbrewerydb.org/v1/breweries/search' && req.method === 'GET'
      );
    });
    expect(req.request.params.get('query')).toBe('test');
    expect(req.request.params.get('per_page')).toBe('5');
    expect(req.request.params.get('page')).toBe('1');
  });
});
