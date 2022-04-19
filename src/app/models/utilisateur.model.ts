export class Utilisateur {
    // public nom: string;
    // public prenom:string;
    // public username:string;
    // public password:string;
    // public telephone:string;
    // public email:string;
    // public sexe:string;
    // public avatar:string;
    // public groupe_sanguin:string;
    // public categorie:string;
    // public specialite:string;
    // public date:Date;
    // public date_naissance:Date;
    // public prix:Number;
    // public statut:Number;
    // public type:Number;
    // public id:Number;
    // public niveau_id:Number;
    // public api_token:string;
    // public create_at:Date;
    // public updated_at:Date;

    constructor(
        public nom: string,
        public prenom:string,
        public username:string,
        public password:string,
        public telephone:string,
        public sexe:string,
        public avatar:string,
        public categorie:string,
        public date:Date,
        public niveau_id:Number,
        public statut:Number,
        public type:Number,
        public email?:string,
        public specialite_id?:number,
        public groupe_sanguin?:string,
        public specialite?:string,
        public date_naissance?:Date,
        public prix?:Number,
        public id?:Number,
        public create_at?:Date,
        public updated_at?:Date,
        public note?:number,
        public nbVote?:number,
        public experience?:number

    ) {}

}
