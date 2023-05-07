
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Validators } from '@angular/forms';
import { displayNameService } from 'src/app/shared/services/displayName.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  show: boolean = false;
  visibility: string = "visibility";
  userList: Array<User> = [];

  registerForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    username: new FormControl('', [
      Validators.required
    ]),
    password1: new FormControl('', [
      Validators.required
    ]),
    password2: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private displayNameService: displayNameService
    ) {}

  register() {

    if (this.isEmailInvalid) {
      return this._snackBar.open("Email must be valid!", "Ok")
    }

    if(String(this.registerForm.get('username')?.value).length < 6){
      return this._snackBar.open("Username too short!", "Ok")
    }

    if(String(this.registerForm.get('password1')?.value).length < 6){
      return this._snackBar.open("Password too short!", "Ok")
    }

    if(String(this.registerForm.get('password1')?.value) !== String(this.registerForm.get('password2')?.value)){
      return this._snackBar.open("Passwords don't match!", "Ok")
    }

    this.authService.register(String(this.registerForm.get('email')?.value), this.registerForm.get('password1')?.value || "").then(cred => {
      console.log(cred);
      this.router.navigateByUrl('/');
      
      const user: User = {
        id: cred.user?.uid as string,
        email: this.registerForm.get('email')?.value || '',
        username: this.registerForm.get('username')?.value || '',
        premium: false
      };
    
      localStorage.setItem('username', user.username);
      this.displayNameService.setDisplayName(localStorage.getItem('username') || 'guest');

      this.userService.create(user).then(_ => {
        console.log("User added!");
      }).catch(error => {
        console.error(error);
      });
    }).catch(error => {
      this._snackBar.open("Email is taken!", "Ok")
    });
    
    return console.log("Registered!");
  }

  get isEmailInvalid() {
    return this.registerForm.invalid && (this.registerForm.dirty || this.registerForm.touched);
  }

  password() {
    if (this.show) this.visibility = "visibility";
    else this.visibility = "visibility_off";
    this.show = !this.show;
  }

}
