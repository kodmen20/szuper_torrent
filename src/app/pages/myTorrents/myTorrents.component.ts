import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/shared/models/User';
import { TorrentsService } from 'src/app/shared/services/torrents.service';
import { AuthService } from '../../shared/services/auth.service';
import { Torrent } from 'src/app/shared/models/Torrent';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-myTorrents',
  templateUrl: './myTorrents.component.html',
  styleUrls: ['./myTorrents.component.scss']
})
export class myTorrentsComponent implements OnInit{

  torrentList: Array<Torrent> = [];

  myTorrentForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    torrent_url: new FormControl(''),
    category: new FormControl(''),
    description: new FormControl('')
  });

  file?: File;
  inputElement = '' as unknown as HTMLInputElement
  fileName: String = "";

  defaultTorrentCategory = "other";

  rowClickedTorrentId = "";

  constructor(private torrentsService: TorrentsService, private router: Router, private storage: AngularFireStorage, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.torrentsService.loadTorrent().subscribe((data: Array<Torrent>) => {
      let j = 0;
      for (let torrent of data){
        if (torrent.uploader == String(localStorage.getItem("username"))){
          this.torrentList[j] = torrent;
          j++
        }
      }
    });
  }

  fileUploaded(event: Event){
    this.inputElement = event.target as HTMLInputElement;
  }

  updateTorrent(torrent: Torrent){
    let newTorrent = torrent;
    

    if (this.inputElement && this.inputElement.files) {
      this.file = this.inputElement.files[0];
    }

    if(this.file?.name){
      this.fileName = String(this.file?.name);
      newTorrent.torrent_url = "gs://szupertorrent.appspot.com/TorrentBucket/" + torrent.id + "/" + this.fileName;
    }

    if(this.myTorrentForm.get('title')?.value){
      newTorrent.title = this.myTorrentForm.get('title')?.value || "";
    }

    if(this.myTorrentForm.get('description')?.value){
      newTorrent.description = this.myTorrentForm.get('description')?.value || "";
    }

    newTorrent.category = this.myTorrentForm.get('category')?.value || "";

    let dateTime = formatDate(new Date(), 'HH:mm dd/MM/yyyy', 'en');
    newTorrent.date = "Last edit: " + dateTime;

    this.torrentsService.updateTorrent(newTorrent);

    const filePath = 'TorrentBucket/' + newTorrent.id + '/' + this.fileName;
    const storageRef = this.storage.ref(String(this.fileName));
    const uploadTask = this.storage.upload(filePath, this.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL()
        console.log("file uploaded!");
      })
    )

    console.log("Ez az error nem tudom mi, a fajl feltotes miatt dobja, de a feltoltes az sikerul neki...");
  }

  deleteTorrent(torrentToDelete: Torrent) {
    let folderName = 'TorrentBucket/' + torrentToDelete.id + '/' + this.fileName;
    const folderRef: AngularFireStorageReference = this.storage.ref(folderName);
    folderRef.delete().toPromise().then(() => {
    }).catch(error => {
      console.log(`Failed to delete folder ${folderName}: ${error.message}`);
    });
    
    this.torrentsService.deleteTorrent(torrentToDelete).then(() => {
      console.log("Deleted succsessful!");
    }).catch((error) => {
        console.error('Error deleting document: ', error);
    });
    
    let newTorrentList: Array<Torrent> = [];
    let j = 0;

    this.torrentList.forEach(torrent => {
      if(torrent != torrentToDelete){
        newTorrentList[j] = torrent;
        j++;
      }
    });
    this.torrentList = newTorrentList;
  }

  rowClick(torrent: Torrent){
    let splitText = torrent.torrent_url.split("/");
    this.fileName = splitText[splitText.length-1];

    if(this.rowClickedTorrentId != torrent.id){
      this.rowClickedTorrentId = torrent.id;
      this.defaultTorrentCategory = torrent.category;
    }

  }

  navigateToMyTorrent(torrent: Torrent){
    localStorage.setItem('torrent_ID', String(torrent.id));
    this.router.navigate(["/torrents"]);
  }



}
