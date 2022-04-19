import { Injectable } from '@angular/core';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  initializeconv(conv:Conversation, uid1,uid2){
    conv.conversationid = this.concatuid(uid1,uid2);
    conv.participants = [uid1,uid2];
    return conv;
  }

  wordtoascii(chain:string){
    console.log("chaine:"+chain);
    let mychain= chain.split('');
    let asciicode='';
    for(let i=0;i<mychain.length; i++){
      asciicode = asciicode + mychain[i].charCodeAt(0).toString();
    }
    return asciicode;
  }

  concatuid(uid1:string,uid2:string){
    let numuid1 = parseInt(this.wordtoascii(uid1));
    let numuid2 = parseInt(this.wordtoascii(uid2));

    console.log('first word : '+ numuid1);
    console.log('second word : '+ numuid2);

    if(numuid1<numuid2){
      return ''+uid1+''+uid2;
    }else{
      return ''+uid2+''+uid1;
    }


  }

  randomNumber(lenght){
    return Math.floor(Math.random() * lenght) + 1 ;
  }

  // this.chatter.getConversation('','').subscribe(data => {
    //   this.messges = data.map(e => {
    //     return {
    //       ...e.payload.doc.data() as {}
    //     } as Messag;
    //   });
    //   console.log(this.messges)
    // });

}
