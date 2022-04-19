export class User {

  id:number;
  niveau_id:number;
  specialite_id:number;
  nom :string;
  prenom:string;
  username:string;
  telephone:string;
  email:string;
  sexe:string;
  date_naissance: Date;
  groupe_sanguin: string;
  statut: number;
  prix: number;
  avatar: string;
  password: string;
  specialite: string;
  categorie: number;
  type: number;
  niveau:number;
  date: Date;
  about: string;
  experience: number;

  constructor(nom,
              prenom,
              username,
              phone,
              email,
              sexe,
              naissance,
              groupe_sanguin,
              statut,
              prix,
              avatar,
              password,
              specialite,
              categorie,
              type,
              ){

                this.nom = nom;
                this.prenom = prenom;
                this.username = username;
                this.telephone = phone;
                this.email = email;
                this.sexe = sexe;
                this.date_naissance = naissance;
                this.groupe_sanguin = groupe_sanguin;
                this.statut = statut;
                this.prix = prix;
                this.avatar = avatar;
                this.password = password;
                this.specialite = specialite;
                this.categorie = categorie;
                this.type = type;
  }



    // userid: string;
    // createat:Date;
    // role:string;
    // imageurl:string;
}
