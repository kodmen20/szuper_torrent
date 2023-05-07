import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authFire: AngularFireAuth) { }

  login(email: string, password: string){
    return this.authFire.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string){
    return this.authFire.createUserWithEmailAndPassword(email, password);
  }

  isUserLoggedIn(){
    return this.authFire.user;
  }

  logout(){
    return this.authFire.signOut();
  }

}

