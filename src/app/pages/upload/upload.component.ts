import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Torrent } from 'src/app/shared/models/Torrent';
import { TorrentsService } from 'src/app/shared/services/torrents.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  default: string = 'other';
  file?: File;
  fileName: String = "";
  inputElement = '' as unknown as HTMLInputElement
  

  uploadForm = new FormGroup({
    uploadTitle: new FormControl(''),
    uploadCategory: new FormControl('other'),
    uploadText: new FormControl(''),
    uploadFile: new FormControl(''),
  });

  constructor(
    private torrentService: TorrentsService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private router: Router,
    private _snackBar: MatSnackBar
    ) {}

  fileUploaded(event: Event){
    this.inputElement = event.target as HTMLInputElement;
  }

  uploadTorrent(){

    let regexp = new RegExp('.*\.torrent$');

    if (this.inputElement && this.inputElement.files) {
      this.file = this.inputElement.files[0];
    }
    else {
      return this._snackBar.open("No file found: Please upload a torrent file!", "Ok");
    }
     
    if (!regexp.test(String(this.file.name))){
      return this._snackBar.open("Bad file format: Please upload a torrent file!", "Ok");
    }

    if(String(this.uploadForm.get('uploadTitle')?.value).length > 40){
      return 0;
    }
    
    if(String(this.uploadForm.get('uploadText')?.value).length > 256){
      return 0;
    }

    switch(String(this.uploadForm.get('uploadCategory')?.value)){
      case "other":
      case "movies":
      case "shows":
      case "games":
      case "programs":
        break;

      default:
        console.log(String(this.uploadForm.get('category')?.value));
        console.log("bad category");
        return 0;
    }


    let id = this.afs.createId();

    this.fileName = String(this.file?.name);
    const filePath = 'TorrentBucket/' + id + '/' + this.fileName;
    const storageRef = this.storage.ref(String(this.fileName));
    const uploadTask = this.storage.upload(filePath, this.file);
  
    let dateTime = formatDate(new Date(), 'HH:mm dd/MM/yyyy', 'en');
    const torrent: Torrent = {
      id: id,
      title: this.uploadForm.get('uploadTitle')?.value || '',
      uploader: String(localStorage.getItem("username")),
      category: this.uploadForm.get('uploadCategory')?.value || '',
      torrent_url: ("gs://szupertorrent.appspot.com/TorrentBucket/" + id + "/" + String(this.fileName)),
      description: this.uploadForm.get('uploadText')?.value || '',
      date: "Created on: " + dateTime,
    };

    if (torrent.title.length == 0 || torrent.description.length == 0){
      return this._snackBar.open("Title or Description is empty", "Ok");
    }

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL()
        console.log("file uploaded!");
      })
    )

    this.torrentService.uploadTorrent(torrent);

    return this.router.navigate(['/']);
  }

}
