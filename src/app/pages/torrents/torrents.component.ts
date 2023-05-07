import { Component, OnInit } from '@angular/core';
import { TorrentsService } from '../../shared/services/torrents.service';
import { Torrent } from 'src/app/shared/models/Torrent';
import { Comment } from 'src/app/shared/models/Comment';
import { FormControl, FormGroup } from '@angular/forms';
import {formatDate} from '@angular/common';
import { CommentService } from 'src/app/shared/services/comment.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-torrents',
  templateUrl: './torrents.component.html',
  styleUrls: ['./torrents.component.scss']
})
export class TorrentsComponent implements OnInit{
  
  selectedTorrent?: Torrent;
  commentList: Array<Comment> = [];

  torrentTitle: string = "";
  torrentCategory: string = "";
  torrentDate: string = "";
  torrentUploader: string = "";
  torrentDescription: string = "";
  torrentDownloadUrl:string = "";

  newCommentForm = new FormGroup({
    commentText: new FormControl(''),
  });

  constructor(
    private torrentService: TorrentsService,
    private commentService: CommentService,
    private storage: AngularFireStorage
    ) {}

  ngOnInit(): void {
    
    this.torrentService.loadTorrent().subscribe((data: Array<Torrent>) => {
      for (let i in data){
        if (data[i].id == localStorage.getItem('torrent_ID')){
          this.selectedTorrent = data[i];
        }
      } 
    this.torrentTitle = String(this.selectedTorrent?.title);
    this.torrentCategory = String(this.selectedTorrent?.category);
    this.torrentDate = String(this.selectedTorrent?.date);
    this.torrentUploader = String(this.selectedTorrent?.uploader);
    this.torrentDescription = String(this.selectedTorrent?.description);
    this.torrentDownloadUrl = String(this.selectedTorrent?.torrent_url);
    
    });

    this.displayComments()
  }

  displayComments(){
    this.commentService.loadComment().subscribe((data: Array<Comment>) => {
      let j = 0;
      for (let i in data){
        if (data[i].torrent_id == localStorage.getItem('torrent_ID')){
          this.commentList[j] = data[i];
          j++;
        }
      }

      let tempComment: Comment;
      for(let i = 0; i < this.commentList.length - 1; i++){
        
        for(let j = 0; j < this.commentList.length - i - 1; j++){

          let [iday, imonth, iyear] = this.commentList[j].date.split(' ')[1].split('/');
          let [imin, ihour] = this.commentList[j].date.split(' ')[0].split(':');
          
          let [jday, jmonth, jyear] = this.commentList[j + 1].date.split(' ')[1].split('/');
          let [jmin, jhour] = this.commentList[j + 1].date.split(' ')[0].split(':');

          //console.log("idate: %d/%d/%d %d:%d", iday, imonth, iyear, ihour, imin)
          //console.log("jdate: %d/%d/%d %d:%d", jday, jmonth, jyear, jhour, jmin)

          console.log("i: " + this.commentList[j].date);
          console.log("j: " + this.commentList[j + 1].date);
          
          let idate = new Date(Number(iyear), (Number(imonth) - 1), Number(iday), Number(ihour), Number(imin));
          let jdate = new Date(Number(jyear), (Number(jmonth) - 1), Number(jday), Number(jhour), Number(jmin));

          if (idate < jdate){
            tempComment = this.commentList[j];
            this.commentList[j] = this.commentList[j + 1];
            this.commentList[j + 1] = tempComment;
            console.log("Swap!")
          }
          console.log("--------")
        }
      }
    });

  }
  
  addNewComment(){
    if((this.newCommentForm.get('commentText')?.value != null) &&  (String(this.newCommentForm.get('commentText')?.value).length < 256)){
      let dateTime = formatDate(new Date(), 'HH:mm dd/MM/yyyy', 'en');
      this.commentService.addComment(
        String(localStorage.getItem('torrent_ID')), String(localStorage.getItem("username")),
        this.newCommentForm.get('commentText')?.value || "guest", String(dateTime)
      );
      this.newCommentForm.reset();
    }
  }

  torrentDownload(){ 
    this.torrentService.downloadTorrent(this.torrentDownloadUrl);
  }
}
