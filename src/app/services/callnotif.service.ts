import { GeneralService } from './../providers/general.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallnotifService {

   private _callresponse$: BehaviorSubject<string> = new BehaviorSubject<string>("");
   url = 'https://fcm.googleapis.com/fcm/send';
   currentuser = JSON.parse(localStorage.getItem('LUser'));

   httpOptions = {
     headers: new HttpHeaders({
     'Content-Type':  'application/json',
     'Authorization': 'key=AAAALIL6THw:APA91bEHeZFuUF-30q1SnVJB2Jr3oAEvMK7YCR9C8rh2TBOFoNUS-svZkV5qMkpEn-mUjSP3zlgKuHGRYcdWt4gwKoUMs0fM0gENmC8wCml8LI_-ED2VCExi8c-n0hRpk7If-jofg9hn'
    })
   };
   // ..assets/img/logo
    notification = {
     "notification": {
       "title": "default",
       "body": "default",
       "click_action": "FCM_PLUGIN_ACTIVITY",
       "sound": "track_call_notif.mp3",
       "icon":"https://cdn0.iconfinder.com/data/icons/medical-218/66/14-512.png"
     },
     "data": {
       "title": "default",
       "message": "default",
       "caller": "default",
       "type": "call"
       // "caller_id":"default"
     },
       "android":{
       "ttl":"2419200s"
     },
     // to concat
     "to":'/topics/',
     "priority": "high"
   };


  constructor(private http:HttpClient,
              public general: GeneralService) { }

  getCallResponse(): Observable<string> {
      return this._callresponse$.asObservable();
   }

   notifyCallResponse(data: string) {
      this._callresponse$.next(data);
   }

  sendNotifIncomingCall(title,msg,topic,caller,callernum){
     let notif = this.newNotifObject(title,msg,topic,caller,callernum);
     console.log(JSON.stringify(notif));
     this.general.presentToastSuccess('notif send to topic '+topic);
     this.http.post(this.url, notif, this.httpOptions)
      .subscribe(data => {
         console.log("notif posté");
         console.log(data);
        }, error => {
         console.log(error);
         console.log(JSON.stringify(error.json()));
      });
 }

 sendNotifCallResponse(title,msg,topic,caller,caller_num,response){
    let notif = this.newNotifObject(title,msg,topic,caller,caller_num,response);
    console.log(JSON.stringify(notif));

    this.http.post(this.url, notif, this.httpOptions)
     .subscribe(data => {
        console.log("notif posté");
        console.log(data);
      }, error => {
        console.log(error);
        console.log(JSON.stringify(error.json()));
     });

 }



 newNotifObject(title, msg, topic:string, caller?:string, caller_num?:string, response?:string){
    this.notification.notification.title= title;
    this.notification.notification.body= msg;
    this.notification.data.title= title;
    this.notification.data.message= msg;
    this.notification.to = this.notification.to + topic;

    if(caller != null){
      this.notification.data["caller"]=caller;
    }

    if(caller_num != null){
      this.notification.data["caller_id"]=caller_num;
    }

    if(response != null){
      this.notification.data["response"]=response;
    }
    return this.notification;
}


}
