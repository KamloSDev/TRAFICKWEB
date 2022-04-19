import { HelpersService } from './../../services/helpers.service';
import { GeneralService } from './../../providers/general.service';
import { Utilisateur } from './../../models/utilisateur.model';
import { RestapiService } from './../../services/restapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';

export interface Conversation {
  coversation_id: string;
  partner_name: string;
  partner_surname: string;
  partner_username: string;
  last_message_text: string;
  last_message_sender: string;
  last_message_date: Date;
}

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.page.html',
  styleUrls: ['./discussions.page.scss'],
})
export class DiscussionsPage implements OnInit {

  searchbar = 1;
  doctor_username: string;
  discussions: any[] = [];
  userid: string;
  // doctors:User[];
  doctors: Utilisateur[];
  discussionsArray: any = [];
  users: any = [];
  today: Date;
  hasDisc = 1;

  constructor(
    private chatter: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    public helper: HelpersService,
    private rest: RestapiService,
    public general: GeneralService
  ) {
    this.today = new Date();
    this.loadAllUsers();
  }

  ngOnInit() {
  }
  async ionViewWillEnter() {

    //  this.discussions = [];
    // this.general.showLoader("Chargement...");
    // let convers: any[] = [];
    // let user = this.general.currentUser;
    // this.chatter.loadUserConv(user['username']).subscribe((ss) => {
    //   ss.docs.forEach((doc) => {
    //     convers.push(doc.data());
    //   });
    //   console.log(convers);
    //   for (let conv of convers) {
    //     let partner_name: string;
    //     let partner_surname: string;
    //     let partner_avatar: string;
    //     let partner_username: string;
    //     let last_message: any[] = [];

    //     if (conv.participants[0] == user['username']) {
    //       partner_username = conv.participants[1]
    //     } else {
    //       partner_username = conv.participants[0]
    //     }
    //     console.log(partner_username);
    //     this.rest.userInfo(partner_username).subscribe((us: Utilisateur) => {
    //       console.log(us);
    //       partner_surname = us[0].prenom;
    //       partner_name = us[0].nom;
    //       partner_avatar = us[0].avatar;
    //       console.log(partner_avatar);
    //       console.log("conv id "+conv.conversationid);
    //       // console.log(partner_name,partner_surname);

    //       console.log(conv.conversationid);
    //       this.chatter.loadLastConvmessage(conv.conversationid).subscribe((ss) => {
    //         ss.docs.forEach((doc) => {
    //           last_message.push(doc.data());
    //         });
    //         console.log("dernier message");
    //         console.log(last_message);
    //         // console.log('uname du lastsender', last_message[0].senderid);
    //         let newconv = {
    //           'coversation_id': conv.conversationid,
    //           'partner_name': partner_name,
    //           'partner_username': partner_username,
    //           'partner_surname': partner_surname,
    //           'last_message_text': last_message[0].text.substring(0, 20),
    //           'last_message_sender': last_message[0].senderid,
    //           'last_message_date': new Date(last_message[0].send_date),
    //           'avatar':partner_avatar
    //         };

    //         this.discussions.push(newconv);
    //         this.general.stopLoader();
    //       });
    //     });
    //   }
    // });

    // console.log(this.discussions);

    this.general.showLoader("Chargement...");
    let user = this.general.currentUser;
    console.log('retrieved localstorage user', user);
    this.userid = user['username'];

    await this.rest.getAllUsers().subscribe((users: Utilisateur[]) => {
      let docs: any
      docs = users;
      this.doctors = users;

      let myuserid = this.general.currentUser.username;
      let isDoctor = 1;
      if (this.general.currentUser.type == 1) {
        isDoctor = 0;
      }
      console.log(docs);


      for (let i = 0; i < docs.length; i++) {
        const elt = docs[i];
        console.log(elt);
        let convid;
        let doctorid = elt.username;
        if (isDoctor == 0) {
          convid = "" + this.helper.concatuid(doctorid, myuserid);
        }
        else {
          convid = "" + this.helper.concatuid(myuserid, doctorid);
        }
        console.log(convid);
        this.chatter.loadLastConvmessage(convid).subscribe((ss) => {
          ss.docs.forEach((doc) => {
            let last_message = (doc.data());
            console.log(last_message);
            if (last_message != null) {
              this.hasDisc = 0;
            }
            let dt = {
              id: elt.id,
              username: elt.username,
              nom: elt.nom,
              prenom: elt.prenom,
              avatar: elt.avatar,
              lastmsg: last_message,
            }
            docs[i] = dt;
          });

        });

      }
      this.discussionsArray = docs;
      console.log(docs);
      console.log(this.doctors);
      this.general.stopLoader();
    });

  }

  loadAllUsers() {
    this.rest.getAllUsers().subscribe((users: Utilisateur[]) => {
      this.users = users;
    });
  }


  toggleSearchBar() {
    if (this.searchbar == 0) {
      this.searchbar = 1;
    }
    else {
      this.searchbar = 0;
    }
  }

  getUserPerUsername(username) {
    let retour = null;
    let i = 0;
    do {
      let elt = this.users[i];
      if (elt.username == username) {
        retour = elt;
      }
      i++;
    }
    while (i < this.users.length && retour == null);
    return retour;
  }
}
