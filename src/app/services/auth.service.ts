import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import User from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<User>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data['authOnly'] ?? false;
      });
  }

  public async createUser(userData: User) {
    if (!userData.password) throw new Error('Password not provided!');

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    await this.usersCollection.doc(userCredentials.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phone_number: userData.phone_number,
    });

    await userCredentials.user?.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout($event?: Event) {
    if ($event) $event.preventDefault();

    await this.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}
