import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Torrent } from 'src/app/shared/models/Torrent';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Comment } from '../models/Comment'

@Injectable({
  providedIn: 'root'
})
export class TorrentsService {

  constructor(private http: HttpClient, private afs: AngularFirestore, private storage: AngularFireStorage, private commentService: CommentService) { }

  loadTorrent(){
    return this.afs.collection<Torrent>("Torrents").valueChanges();
  }

  downloadTorrent(url: string){
    const ref = this.storage.refFromURL(url);
    ref.getDownloadURL().subscribe((url: string) => {
      window.open(url);
    });
  }

  uploadTorrent(torrent: Torrent){
    return this.afs.collection<Torrent>("Torrents").doc(torrent.id).set(torrent);
    
  }

  updateTorrent(torrent: Torrent){
    return this.afs.doc('Torrents/' + torrent.id).update(torrent);
  }

  deleteTorrent(torrent: Torrent){
    this.commentService.loadComment().subscribe((data: Array<Comment>) => {
      data.forEach(comment => {
        if(comment.torrent_id == torrent.id) {
          this.afs.doc('Comments/' + comment.id).delete();
        }
      });
    });
    
    return this.afs.doc('Torrents/' + torrent.id).delete();
  }
 
}
