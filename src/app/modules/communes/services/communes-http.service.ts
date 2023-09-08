import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

const API_COMMUNE_URL = `${environment.apiUrl}/communes`;

@Injectable({
  providedIn: 'root',
})
export class CommunesHttpService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  getAll(): Observable<any> {
    return this.http.get(API_COMMUNE_URL);
  }
}
