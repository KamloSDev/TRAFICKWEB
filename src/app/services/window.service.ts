import { Injectable } from '@angular/core';
import * as Peer from 'peerjs';


@Injectable({
  providedIn: 'root'
})
export class WindowService {


  constructor() {
   }

   get windowRef() {
    return window
  }

}
