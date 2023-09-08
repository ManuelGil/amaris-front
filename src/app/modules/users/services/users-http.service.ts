import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { UserModel } from '../../models';

const API_USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class UsersHttpService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  getAll(): Observable<any> {
    return this.http.get(`${API_USERS_URL}`);
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${API_USERS_URL}/${id}`);
  }

  create(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http
      .post(`${API_USERS_URL}`, user)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  update(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http
      .put(`${API_USERS_URL}/${user.id}`, user)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  delete(id: number): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http
      .delete(`${API_USERS_URL}/${id}`)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
}
