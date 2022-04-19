import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdvancednavService {

  constructor(public active: ActivatedRoute, public route: Router) { }

  navwithdata(pagename:string,data:string,data2:string){
     let navigationExtras: NavigationExtras = {
       state: {
          // j'envoi mon nom
          call_participant: data,
          role: data2
       }
     };
     this.route.navigate([pagename], navigationExtras);
  }

  navIncomming(pagename:string,data:string,data2:string){
     let navigationExtras: NavigationExtras = {
      state: {
          // j'envoi mon nom
          caller: data,
          caller_num: data2
      }
     };
     this.route.navigate([pagename], navigationExtras);
 }
}
