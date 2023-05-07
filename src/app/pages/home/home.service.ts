import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Torrent } from 'src/app/shared/models/Torrent';
import { Comment} from 'src/app/shared/models/Comment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  loadTorrentList(): Observable<Array<Torrent>>{
    return this.afs.collection<Torrent>("Torrents").valueChanges();
  }

}
