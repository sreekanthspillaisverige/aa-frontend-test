import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brewery } from '../models/brewery.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BreweryApi {
  private readonly baseUrl = environment.apiBaseUrl + '/breweries';
  constructor(private http: HttpClient) {}

  searchBreweries(query: string, perPage: number): Observable<Brewery[]> {
    const params = new HttpParams().set('query', query).set('per_page', perPage).set('page', '1');
    return this.http.get<Brewery[]>(`${this.baseUrl}/search`, { params });
  }
}
