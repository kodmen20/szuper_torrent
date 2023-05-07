import { Injectable } from '@angular/core';
import { Comment } from '../models/Comment'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Torrent } from '../models/Torrent';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  collectionName = 'Comments';

  constructor(private afs: AngularFirestore) { }

  create(comment: Comment){ 
    return this.afs.collection<Comment>(this.collectionName).doc(String(comment.id)).set(comment);
  }

  delete(comment: Comment){
    
  }

  loadComment(){
    return this.afs.collection<Comment>("Comments").valueChanges();
  }

  addComment(torrent_id: string, username: string, text: string, date: string){
    let comment: Comment = {
      id: this.afs.createId(),
      torrent_id: torrent_id,
      username: username,
      text: text,
      date: date
    };

    this.create(comment);
    return 1;
  }

}
