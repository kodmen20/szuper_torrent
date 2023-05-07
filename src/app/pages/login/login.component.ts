import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from '../../shared/models/User'
import { Subject } from 'rxjs';
import { displayNameService } from '../../shared/services/displayName.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  email: string = "";
  password: string = "";
  username = "";
  loggingIn: boolean = false;

  show: boolean = false;
  visibility: string = "visibility";

  mySubject = new Subject<string>();

  constructor(private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private displayNameService: displayNameService,
    private _snackBar: MatSnackBar) {}
  ngOnInit(): void {

  }

  login(){
    this.loggingIn = true;
    this.email = (<HTMLInputElement>document.getElementById("loginEmail")).value;
    this.password = (<HTMLInputElement>document.getElementById("loginPassword")).value;


    this.authService.login(this.email, this.password).then(cred => {
      this.userService.getAll().forEach((data: Array<User>) => {
        if(this.loggingIn){
          for (let i in data){
            if(this.email == data[i].email) {
              localStorage.setItem("username",  data[i].username);
            }
          }
        }
          this.displayNameService.setDisplayName(localStorage.getItem('username') || 'guest');
          this.loggingIn = false;
      });

      this.router.navigateByUrl('');
    }).catch(error => {
      this._snackBar.open("Bad email or password!", "Ok");
      console.error(error);
    });

    
  }
  
  passwordVisibility() {
    if (this.show) this.visibility = "visibility";
    else this.visibility = "visibility_off";
    this.show = !this.show;
  }

}