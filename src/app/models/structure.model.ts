export class Structure {
  constructor(
    public type_id: number,
    public nom : string,
    public ville : string,
    public localisation : string,
    public telephone1 : string,
    public telephone2 : string,
    public email : string,
    public statut = 1,
    public logo : string,
    public description : string,
    public url: string,
    public categorie?: string,
    public date?: string,
    public id?: number,
    public user_id?: number,
    public username?: string,

  ){

  }
}
