import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CommunesHttpService } from 'src/app/modules/communes';
import { CommuneModel, UserModel } from 'src/app/modules/models';
import { UsersHttpService } from '../../services/users-http.service';

export type UserType = UserModel | undefined;
export type CommunesType = CommuneModel[] | undefined;

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  // private fields
  private userSubscr: Subscription;
  private communesSubscr: Subscription;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  updateUserForm!: FormGroup;
  isLoading$: Observable<boolean>;
  userSubject: BehaviorSubject<UserType>;
  user$: Observable<UserType>;
  communesSubject: BehaviorSubject<CommunesType>;
  communes$: Observable<CommunesType>;

  // convenience getter for easy access to user
  get userValue(): UserType {
    return this.userSubject.value;
  }

  // convenience setter for easy access to user
  set userValue(user: UserType) {
    this.userSubject.next(user);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateUserForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: UsersHttpService,
    private httpCommunes: CommunesHttpService,
    private toast: ToastrService,
  ) {
    this.isLoading$ = this.http.isLoading$;

    this.userSubject = new BehaviorSubject<UserType>(undefined);
    this.user$ = this.userSubject.asObservable();
    this.userSubscr = this.getUser().subscribe();
    this.unsubscribe.push(this.userSubscr);

    this.communesSubject = new BehaviorSubject<CommunesType>(undefined);
    this.communes$ = this.communesSubject.asObservable();
    this.communesSubscr = this.getCommunes().subscribe();
    this.unsubscribe.push(this.communesSubscr);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateUserForm = this.fb.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ]),
      ],
      communes: ['', Validators.compose([Validators.required])],
    });
  }

  getUser(): Observable<UserType> {
    const id = this.route.snapshot.paramMap.get('id');
    return this.http.getById(id).pipe(
      map((response) => {
        if (response) {
          this.userSubject.next(response);
          return response;
        } else {
          return of(undefined);
        }
      }),
    );
  }

  getCommunes(): Observable<CommunesType> {
    return this.httpCommunes.getAll().pipe(
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

  submit() {
    const user = {
      id: this.userValue?.id,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phone: this.f['phone'].value,
      communeName: this.f['communes'].value,
    };

    const subscr = this.http
      .update(user as UserModel)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('err', err.message);
          this.toast.error('Se ha producido un error al actualizar el usuario.');
          return of(undefined);
        }),
      )
      .subscribe((event) => {
        if (typeof event === 'object') {
          this.toast.success('Se ha actualizado el usuario con éxito.');
        }
      });

    this.unsubscribe.push(subscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
