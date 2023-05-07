import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class displayNameService {
  private displayName = new BehaviorSubject<string>(localStorage.getItem('username') || 'guest');

  setDisplayName(name: string) {
    this.displayName.next(name);
  }

  getDisplayName() {
    return this.displayName.asObservable();
  }
}