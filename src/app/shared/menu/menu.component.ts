import { AfterContentInit, Component, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { displayNameService } from '../services/displayName.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit, AfterContentInit{

  loggedInUser?: firebase.default.User | null;
  displayName?: string;
  user: User =  {
    id: "",
    username: "guest",
    email: "",
    premium: false
  }

  ads: ad[] = [
    {imgPath: "AdPictures/ad1.png", redirectTo: "https://www.youtube.com/watch?v=rQ1f9vV03B4"},
    {imgPath: "AdPictures/ad2.png", redirectTo: "https://www.youtube.com/watch?v=tvkxupwbFLk"},
    {imgPath: "AdPictures/ad3.png", redirectTo: "https://youtu.be/NHEaYbDWyQE?t=9"},
  ];

  randomAd: ad = {
    imgPath: "",
    redirectTo: ""
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private displayNameService: displayNameService,
    private storage: AngularFireStorage,
    private router: Router
    ) {}

  ngOnInit(){
    this.updateDisplayName();
    this.displayNameService.getDisplayName().subscribe((username) => {
      this.updateDisplayName();
    });
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
    });

    this.userService.getAll()
  }

  ngAfterContentInit(){
    let randomIndex = Math.floor(Math.random() * this.ads.length);

    const ref = this.storage.ref(this.ads[randomIndex].imgPath);
    ref.getDownloadURL().subscribe(url => {
      this.randomAd.imgPath = url;
      this.randomAd.redirectTo = this.ads[randomIndex].redirectTo;
    });

    this.updateDisplayName();
  }

  async logout(){
    this.authService.logout().then(() => {
      localStorage.setItem("username", "guest");
      this.updateDisplayName();
      this.router.navigateByUrl('/login');
    }).catch(error =>{
      console.log(error);
    });

  }

  updateDisplayName(){
    this.displayName = localStorage.getItem('username') || 'guest';

  }

  redirect(){
    window.open(this.randomAd.redirectTo, '_blank');
  }

}

type ad = { 
  imgPath: string,
  redirectTo: string
}