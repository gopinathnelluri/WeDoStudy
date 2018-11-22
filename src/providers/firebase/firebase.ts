import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(private afd: AngularFireDatabase) {
  }

  get(listName){
    return this.afd.list(listName);
  }

  getObject(objName){
    return this.afd.object(objName);
  }


}
