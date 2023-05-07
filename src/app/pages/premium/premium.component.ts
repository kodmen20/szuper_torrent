import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})

export class PremiumComponent implements OnInit{

    loggedInUser?: firebase.default.User | null;
    
    user: User = {
      id: "",
      username: "guest",
      email: "",
      premium: false
  }
  
  premiumForm = new FormGroup({
    moneyAmount: new FormControl(''),
  });
  
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}
  
  ngOnInit(){
  
    this.authService.isUserLoggedIn().subscribe(user => {
        this.loggedInUser = user;
        localStorage.setItem('user', JSON.stringify(user));
    }, error => {
        console.log(error);
        localStorage.setItem('user', JSON.stringify('null'));
    });
  
    this.userService.getAll().subscribe((data: Array<User>) => {
        for (let i in data){
          if (data[i].username == localStorage.getItem("username")){
            this.user = data[i];
          }
        }
        console.log("user: " + this.user);
      
    });
    this.userService.getAll()
  }

  buyPremium(){
    this.userService.updatePremium(this.user.id);
    this.router.navigateByUrl('');
  }
}