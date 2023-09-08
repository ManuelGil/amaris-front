import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, of } from 'rxjs';

import { CommuneModel } from 'src/app/modules/models';
import { CommunesHttpService } from '../..';

export type CommunesType = CommuneModel[] | undefined;

@Component({
  selector: 'app-get-communes',
  templateUrl: './get-communes.component.html',
})
export class GetCommunesComponent implements OnDestroy {
  // private fields
  private communesSubscr: Subscription;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  communesSubject: BehaviorSubject<CommunesType>;
  communes$: Observable<CommunesType>;

  // convenience getter for easy access to communes
  get CommunesValue(): CommunesType {
    return this.communesSubject.value;
  }

  // convenience setter for easy access to communes
  set CommunesValue(communes: CommunesType) {
    this.communesSubject.next(communes);
  }

  constructor(private http: CommunesHttpService) {
    this.communesSubject = new BehaviorSubject<CommunesType>(undefined);
    this.communes$ = this.communesSubject.asObservable();
    this.communesSubscr = this.getCommunes().subscribe();
    this.unsubscribe.push(this.communesSubscr);
  }

  getCommunes(): Observable<CommunesType> {
    return this.http.getAll().pipe(
      map((response) => {
        if (response) {
          this.communesSubject.next(response);
          return response;
        } else {
          return of(undefined);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
