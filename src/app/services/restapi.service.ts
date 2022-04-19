import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utilisateur }  from '../models/utilisateur.model';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {

  PHP_API_SERVER = "https://api.lostoweb.com/public/api/v1/";

  httpHeader = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin':'*',
      // 'Access-Control-Allow-Methods':'POST, GET, PUT, OPTIONS, DELETE, PATCH',
      // 'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
     })
  };

  constructor(private httpClient: HttpClient) { }

  userInfo(username):Observable<Utilisateur>{
    return this.httpClient.get<Utilisateur>(`${this.PHP_API_SERVER}getPerUsername/${username}`);
  }

  fetchUser(): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getAllUsers`);
  }

  getUserPerUsername(username): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getPerUsername/`+username);
  }

  getUserPerTelephone(telephone): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getPerPhone/`+telephone);
  }

  getAllUsers(): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getAllUsers`);
  }

  getUsersPerType(type): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getPerType/`+type);
  }



  updateUser(user){
    return this.httpClient.put(this.PHP_API_SERVER+"updateUser/"+user.id, user )
    .pipe(
      catchError(this.handleError<any>('Add User'))
    );
  }

  fectchDoctor(): Observable<Utilisateur[]>{
    return this.httpClient.get<Utilisateur[]>(`${this.PHP_API_SERVER}getPerType/1`);
  }

  createUser(user: Utilisateur): Observable<Utilisateur>{
    return this.httpClient.post<Utilisateur>(`${this.PHP_API_SERVER}insertUser`, user);
  }

  logUserIn(username:string,pass:string){
    return this.httpClient.get(`${this.PHP_API_SERVER}getPerUsernameandPass/${username}/${pass}`);
  }


  // NIVEAUX
  // les niveaux representent le titre que peu porter un personnel de santé: Ex Medecin, infirmier...
  getAllNiveaux(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getNiveaux`);
  }

  getAllSpecialites(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getAllSpecialites`);
  }

  // EVALUATION
  saveEvaluation(evaluation): Observable<Utilisateur>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}insertEvaluation`, evaluation);
  }

  getEvaluationPerUserAndMedecin(user, medecin): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getPerUserAndMedecin/${user}/${medecin}`);
  }

  getAllEvaluations(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getAllEvaluations`);
  }


  // CONSULTATION



  // DEMANDES

  saveDemande(demande): Observable<Utilisateur>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}inserDemande`, demande);
  }

  getDemandePerPatientAndMedecin(patient, medecin): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getDemandePerPatientAndMedecin/${patient}/${medecin}`);
  }

  getPassedDemandePerMedecin(id, statut): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getDemandePerMedecinAndStatut/${id}/${statut}`);
  }

  getDemandesPerMedecin(id): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getDemandesPerMedecin/${id}`);
  }

  getDemandesPerPatient(id): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getDemandesPerPatient/${id}`);
  }

  getDemandesAnyWhere(id): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getDemandesAnyWhere/${id}`);
  }

   updateDemande(id,demande){
    return this.httpClient.put(`${this.PHP_API_SERVER}updateDemande/${id}`, demande)
    .pipe(
      catchError(this.handleError<any>('update demande'))
    );
  }

  deleteDemande(id): Observable<any[]>{
    return this.httpClient.delete<any[]>(`${this.PHP_API_SERVER}deleteDemande/${id}`);
  }



  // PLANINGS
  savePlaning(pla): Observable<any>{
    return this.httpClient.post<any>(`${this.PHP_API_SERVER}insertPlaning`, pla);
  }

  getPlaningPerUser(id): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getPlaningPerUser/${id}`);
  }

// CARNET ITEMS
saveCarnetItem(ci): Observable<any>{
  return this.httpClient.post<any>(`${this.PHP_API_SERVER}insertCarnetItem`, ci);
}


getCarnetItemsPerDemandeID(id): Observable<any[]>{
  return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getCarnetItemsPerDemandeID/${id}`);
}

getCarnetUserPerPatientId(id): Observable<any[]>{
  return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getCarnetUserPerPatientId/${id}`);
}

updateCarnetItem(id,ci){
  return this.httpClient.put(`${this.PHP_API_SERVER}updateCarnetItem/${id}`, ci)
  .pipe(
    catchError(this.handleError<any>('update demande'))
  );
}

// GET STRUCTURE TYPES

saveStructure(structure): Observable<any>{
  return this.httpClient.post<any>(`${this.PHP_API_SERVER}insertStructure`, structure);
}

getAllStructureCategories(): Observable<any[]>{
  return this.httpClient.get<any[]>(`${this.PHP_API_SERVER}getAllTypes`);
}

getAllStructures(): Promise<any>{
  let url = `${this.PHP_API_SERVER}getAllStructures`;
  console.log(url);

  return new Promise(resolve => {
    this.httpClient.get<any>(url)
      .subscribe((data: any) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
  });

}


getStructurePerName(name): Promise<any>{

  let url = `${this.PHP_API_SERVER}getStructuresPerName/${name}`;
  encodeURI(url);
  console.log(url);

  return new Promise(resolve => {
    this.httpClient.get<any>(url)
      .subscribe((data: any) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
  });

}


//  MAP POINTS

savePoint(point): Promise<any>{
  // return this.httpClient.post<any>(`${this.PHP_API_SERVER}insertPoint`, point);
  return new Promise(resolve => {
    this.httpClient.post<any>(`${this.PHP_API_SERVER}insertPoint`, point)
      .subscribe((data: any) => {
        resolve(data);
      }, error => {
        resolve(-1);
      });
  });
}
updateStructuteStatus(structure){

  return new Promise(resolve => {
    this.httpClient.put<any>(`${this.PHP_API_SERVER}updateStructureStatus/${structure.id}`, structure)
      .subscribe((data: any) => {
        resolve(data);
      }, error => {
        resolve(-1);
      });
  });
}


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };

  }



  getPointsPerStructureID(structureID): Observable<any[]>{
    let url = `${this.PHP_API_SERVER}getPointsPerStructureID/${structureID}`;
    console.log(url);
    return this.httpClient.get<any[]>(url);
}

}
