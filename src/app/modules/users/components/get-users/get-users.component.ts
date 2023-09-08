import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserModel } from 'src/app/modules/models';
import { UsersHttpService } from '../../services/users-http.service';

export type UsersType = UserModel[] | undefined;

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
})
export class GetUsersComponent implements OnDestroy {
  // private fields
  private usersSubscr: Subscription;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  usersSubject: BehaviorSubject<UsersType>;
  users$: Observable<UsersType>;

  // convenience getter for easy access to users
  get usersValue(): UsersType {
    return this.usersSubject.value;
  }

  // convenience setter for easy access to users
  set usersValue(users: UsersType) {
    this.usersSubject.next(users);
  }

  constructor(
    private http: UsersHttpService,
    private toast: ToastrService,
  ) {
    this.usersSubject = new BehaviorSubject<UsersType>(undefined);
    this.users$ = this.usersSubject.asObservable();
    this.usersSubscr = this.getUsers().subscribe();
    this.unsubscribe.push(this.usersSubscr);
  }

  getUsers(): Observable<UsersType> {
    return this.http.getAll().pipe(
      map((response) => {
        if (response) {
          this.usersSubject.next(response);
          return response;
        } else {
          return of(undefined);
        }
      }),
    );
  }

  updateUsers() {
    this.usersSubscr.unsubscribe();
    this.usersSubscr = this.getUsers().subscribe();
  }

  deleteUser(id: number) {
    const subscr = this.http
      .delete(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('err', err.message);
          this.toast.error('Se ha producido un error al eliminar el usuario.');
          return of(undefined);
        }),
      )
      .subscribe((event) => {
        if (typeof event === 'object') {
          this.toast.success('Se ha eliminado el usuario con éxito.');
          setTimeout(() => {
            document.location.reload();
          }, 500);
        }
      });

    this.unsubscribe.push(subscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
