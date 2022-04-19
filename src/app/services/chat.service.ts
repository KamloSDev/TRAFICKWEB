import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Messag } from 'src/app/models/messag.model'
import { Conversation } from '../models/conversation.model';
import { User } from '../models/user.model';
import { HelpersService } from './helpers.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore : AngularFirestore, private helper:HelpersService) { }

  // Creation Method
  newUser(user:User){
    this.firestore.collection('users').add(user);
  }
  newConversation(conv:Conversation){
    this.firestore.collection("conversations").add(conv);
  }
  newMessage(msg:Messag){
    this.firestore.collection("messages").add(msg);
  }


  // Avoid doublons
  checkexixstinguser(uid){
    return this.firestore.collection('users', ref =>
      ref.where('userid', '==', uid).limit(1)).get();
  }
  checkexistingconv(convid:string){
    // let convid=this.helper.concatuid(uid1,uid2);
    return this.firestore.collection('conversations', ref =>
      ref.where('conversationid', '==', convid).limit(1)).get();
  }

  // Load Doctors
  retrievealldoctors(){
    return this.firestore.collection('users', ref =>
    ref.where('role', '==', 'doctor')).snapshotChanges();
  }

  // Load Message
  retrieveallmessages(convid:string){
    // let convid=this.helper.concatuid(uid1,uid2);
    return this.firestore.collection('messages', ref =>
      ref.orderBy('send_date','asc')
          .where('conversationid', '==', convid))
            .snapshotChanges();
  }

  // Load Message
  loadLastConvmessage(convid:string){
    return this.firestore.collection('messages', ref =>
      ref.orderBy('send_date','desc')
          .where('conversationid', '==', convid).limit(1))
            .get();
  }

  loadUserConv(uid){
    return this.firestore.collection('conversations', ref =>
      ref.where('participants', 'array-contains-any', [uid])).get();
  }


}

//=== Message(expert) helpers====//
    // getConversation(expid,destid){
    //   return this.firestore.collection('messages', ref =>
    //     ref.orderBy('senddate','asc')
    //           .where('expediteurid', 'in', ['joel_001','nk_flame'])
    //             .where('destinataireid', 'in', ['joel_001','nk_flame'])
    //             )
    //       .snapshotChanges();
    // }
    // createMessag(msg : Messag){
    //   this.firestore.collection("messages").add(msg);
    // }
  //=== Message(expert) helpers====//


//  Get conversation template No1
// getConversation(expid,destid){
//   return this.firestore.collection('messages', ref =>
//     ref.orderBy('senddate','desc')
//         .where('expediteurid', '==', 'joel_001')
//           .where('destinataireid', '==', 'nk_flame'))
//       .snapshotChanges();
// }
// getConversation(expid,destid){
//   return this.firestore.collection('messages', ref =>
//     ref.orderBy('senddate','asc')
//         .where('participants', "array-contains" , 'joel_001')
//         .where('participants', "array-contains" , 'nk_flame')
//         )
//       .snapshotChanges();
// }
