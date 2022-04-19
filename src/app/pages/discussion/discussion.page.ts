import { Utilisateur } from './../../models/utilisateur.model';
import { GeneralService } from './../../providers/general.service';
import { DataService } from './../../services/data.service';
import { RestapiService } from './../../services/restapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpersService } from './../../services/helpers.service';
import { ChatService } from './../../services/chat.service';
import { Conversation } from './../../models/conversation.model';
import { Messag } from 'src/app/models/messag.model';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.page.html',
  styleUrls: ['../discussions/discussions.page.scss'],
})
export class DiscussionPage implements OnInit {

  @ViewChild('input') myInput;
  myuserid: string;
  doctorid: string;
  convid: string;
  destinataire: any;
  messagelist: Messag[];
  msg: Messag = { senderid: '', receiverid: 'chatbot', conversationid: '', text: '', send_date: new Date() };
  conv: Conversation = { conversationid: '', participants: [] }
  messges: Messag[];

  constructor(
    private chatter: ChatService,
    private helper: HelpersService,
    private route: ActivatedRoute,
    private router: Router,
    private rest: RestapiService,
    private data: DataService,
    private general: GeneralService,
    public active: ActivatedRoute
  ) {

    this.active.queryParams.subscribe(params => {
      if (params && params.destinataire) {
        this.destinataire = JSON.parse(params.destinataire);
        this.myuserid = this.general.currentUser.username;
        this.doctorid = this.destinataire.username;
        console.log(this.destinataire);
      } else {
        this.myuserid = this.route.snapshot.paramMap.get('user');
        this.doctorid = this.route.snapshot.paramMap.get('doctor');
        console.log('constructor userid', this.myuserid);
        console.log('constructor doctorid', this.doctorid);

        this.rest.getUserPerUsername(this.doctorid).subscribe((users: Utilisateur[]) => {
          console.log(users);
          this.destinataire = users[0];
          console.log(this.destinataire);
        },
          (error) => {
            console.log(error);
          })
      }
    });
  }


  ngOnInit() {
    if (this.general.currentUser.type == 0) {
      this.convid = "" + this.helper.concatuid(this.myuserid, this.doctorid);
    }
    else {
      this.convid = "" + this.helper.concatuid(this.doctorid, this.myuserid);
    }

    this.msg.senderid = this.myuserid;
    this.msg.receiverid = this.doctorid;

    this.msg.conversationid = this.convid;
    console.log("ngOnInit: " + this.convid);
    this.chatter.checkexistingconv(this.convid)
      .subscribe(conversation => {
        if (conversation.size > 0) {
          // une conv existe deja
          console.log('cette conversation existe donc chargez vos messages');
          this.loadmessage();
        }
        else {
          // une conv n'existe pas
          console.log('cette conversation n\'existe pas');
          this.conv = this.helper.initializeconv(this.conv, this.myuserid, this.doctorid);
          this.chatter.newConversation(this.conv);
        }
      });

    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  chatt() {
    console.log(this.msg);
    this.msg.send_date = new Date();
    this.chatter.newMessage(this.msg);
    this.general.sendPush("Nouveau message de " + this.general.currentUser.username, this.msg.text, null, this.destinataire.username);
    this.msg.text = "";

    this.loadmessage();

    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);

    if (this.msg.receiverid == "chatbot") {
      setTimeout(() => {
        this.botanswer();
      }, 5000);
    }
  }

  loadmessage() {
    console.log(this.convid);
    // this.chatter.
    this.chatter.retrieveallmessages(this.convid).subscribe(data => {
      this.messagelist = data.map(e => {
        return {
          ...e.payload.doc.data() as {}
        } as Messag;
      });
    });
  }

  botanswer() {
    let num = this.helper.randomNumber(20);
    let answer = this.data.data[num];

    let botmsg: Messag = {
      conversationid: this.convid,
      receiverid: this.myuserid,
      senderid: 'chatbot',
      send_date: new Date(),
      text: answer
    }
    this.chatter.newMessage(botmsg);
    this.loadmessage();
  }

  launchCall() {
    console.log('call launched');
  }


}
