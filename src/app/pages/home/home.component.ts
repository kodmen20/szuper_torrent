import { Component, OnInit } from '@angular/core';
import { Torrent } from 'src/app/shared/models/Torrent';
import { Comment } from 'src/app/shared/models/Comment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  torrentList: Array<Torrent> = [];

  boxes: checkBoxes = {
    all: true,
    movies: false,
    shows: false,
    games: false,
    programs: false,
    other: false
  }

  constructor
  (private homeService: HomeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService
   ) {}

  ngOnInit(): void {

    this.displayTorrents("all");
    
  }

  rowClick(row: Torrent){
    console.log(localStorage.getItem("username"))
    if(String(localStorage.getItem("username")) == "guest" || localStorage.getItem("username") == null){
      this._snackBar.open("You need to login to do that", "Ok");
    }
    else{
      localStorage.setItem('torrent_ID', String(row.id));
      this.router.navigate(["/torrents"]);
    }
  }

  columns = [
    {
      columnDef: 'title',
      header: 'Title',
      cell: (element: Torrent) => `${element.title}`,
    },
    {
      columnDef: 'category',
      header: 'Category',
      cell: (element: Torrent) => `${element.category}`,
    },
    {
      columnDef: 'date',
      header: 'Date',
      cell: (element: Torrent) => `${element.date}`,
    }
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  displayTorrents(category: string){
    this.homeService.loadTorrentList().subscribe((data: Array<Torrent>) => {
      if(category == 'all'){
        this.torrentList = data;
      }
      else {
        let tempList: Array<Torrent> = []
        this.torrentList = tempList;
        let j = 0;
        tempList = data;
        tempList.forEach(torrent => {
          if (torrent.category == category){
            this.torrentList[j] = torrent;
            j++;
          }
        })
      }
      for(let i = 0; i < this.torrentList.length; i++){    
          this.torrentList[i].date = this.torrentList[i].date.split(':')[1] + ':' + this.torrentList[i].date.split(':')[2];
      }

      let tempTorrent: Torrent;

      for(let i = 0; i < this.torrentList.length - 1; i++){
   
        for(let j = 0; j < this.torrentList.length - i - 1; j++){
  
          let [__, clock_i, date_i] = this.torrentList[j].date.split(' ');
          let [day_i, month_i, year_i] = date_i.split('/');
          let [hour_i, min_i] = clock_i.split(':');

          let [_, clock_j, date_j] = this.torrentList[j + 1].date.split(' ');
          let [day_j, month_j, year_j] = date_j.split('/');
          let [hour_j, min_j] = clock_j.split(':');
    
          let i_date = new Date(Number(year_i), (Number(month_i) - 1), Number(day_i), Number(hour_i), Number(min_i));
          let j_date = new Date(Number(year_j), (Number(month_j) - 1), Number(day_j), Number(hour_j), Number(min_j));
          
          if(i_date < j_date){
            tempTorrent = this.torrentList[j];
            this.torrentList[j] = this.torrentList[j + 1];
            this.torrentList[j + 1] = tempTorrent;
          }
        }
      }
    });
  }

  allCheck(){
    this.boxes.all = true,
    this.boxes.movies = false,
    this.boxes.shows = false,
    this.boxes.games = false,
    this.boxes.programs = false,
    this.boxes.other = false

    this.displayTorrents("all");
  }

  moviesCheck(){
    if (this.boxes.movies) {
      this.boxes.all = true;
      this.boxes.movies = false;
      this.displayTorrents("all");

    }
    else{
      this.boxes.all = false;
      this.boxes.movies = true;
      this.displayTorrents("movies");
    }

    this.boxes.other = false;
    this.boxes.shows = false;
    this.boxes.games = false;
    this.boxes.programs = false;
  }

  showsCheck(){
    if (this.boxes.shows) {
      this.boxes.all = true;
      this.boxes.shows = false;
      this.displayTorrents("all");

    }
    else{
      this.boxes.all = false;
      this.boxes.shows = true;
      this.displayTorrents("shows");
    }

    this.boxes.movies = false;
    this.boxes.other = false;
    this.boxes.games = false;
    this.boxes.programs = false;
  }
  
  gamesCheck(){
    if (this.boxes.games) {
      this.boxes.all = true;
      this.boxes.games = false;
      this.displayTorrents("all");

    }
    else{
      this.boxes.all = false;
      this.boxes.games = true;
      this.displayTorrents("games");
    }

    this.boxes.movies = false;
    this.boxes.shows = false;
    this.boxes.other = false;
    this.boxes.programs = false;
  }

  programsCheck(){
    if (this.boxes.programs) {
      this.boxes.all = true;
      this.boxes.programs = false;
      this.displayTorrents("all");

    }
    else{
      this.boxes.all = false;
      this.boxes.programs = true;
      this.displayTorrents("programs");
    }

    this.boxes.movies = false;
    this.boxes.shows = false;
    this.boxes.games = false;
    this.boxes.other = false;
  }

  otherCheck(){
    if (this.boxes.other) {
      this.boxes.all = true;
      this.boxes.other = false;
      this.displayTorrents("all");

    }
    else{
      this.boxes.all = false;
      this.boxes.other = true;
      this.displayTorrents("other");
    }

    this.boxes.movies = false;
    this.boxes.shows = false;
    this.boxes.games = false;
    this.boxes.programs = false;
  
  }
}

type checkBoxes = { 
  all: boolean,
  movies: boolean,
  shows: boolean,
  games: boolean,
  programs: boolean,
  other: boolean,
}









// console.log("ass");