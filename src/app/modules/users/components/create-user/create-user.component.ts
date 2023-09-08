import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CommunesHttpService } from 'src/app/modules/communes';
import { CommuneModel, UserModel } from 'src/app/modules/models';
import { UsersHttpService } from '../../services/users-http.service';

export type CommunesType = CommuneModel[] | undefined;

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit, OnDestroy {
  // private fields
  private communesSubscr: Subscription;
  private unsubscribe: Subscription[] = [];

  // public fields
  createUserForm!: FormGroup;
  isLoading$: Observable<boolean>;
  communesSubject: BehaviorSubject<CommunesType>;
  communes$: Observable<CommunesType>;

  // convenience getter for easy access to form fields
  get f() {
    return this.createUserForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private http: UsersHttpService,
    private httpCommunes: CommunesHttpService,
    private toast: ToastrService,
  ) {
    this.isLoading$ = this.http.isLoading$;

    this.communesSubject = new BehaviorSubject<CommunesType>(undefined);
    this.communes$ = this.communesSubject.asObservable();
    this.communesSubscr = this.getCommunes().subscribe();
    this.unsubscribe.push(this.communesSubscr);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.createUserForm = this.fb.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
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
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      phone: this.f['phone'].value,
      communeName: this.f['communes'].value,
    };

    const subscr = this.http
      .create(user as UserModel)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('err', err.message);
          this.toast.error('Se ha producido un error al crear el usuario.');
          return of(undefined);
        }),
      )
      .subscribe((event) => {
        if (typeof event === 'object') {
          this.toast.success('Se ha creado el usuario con éxito.');
          this.createUserForm.reset();
        }
      });

    this.unsubscribe.push(subscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
