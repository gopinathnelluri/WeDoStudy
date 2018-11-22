import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
/*
  Generated class for the LocalAuthenticatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalAuthenticatorProvider {

  constructor() {
    console.log('Hello LocalAuthenticatorProvider Provider');
    this.createPouchDB();
  }

  public pdb;
  public user;

  createPouchDB() {
    PouchDB.plugin(cordovaSqlitePlugin);
    this.pdb = new PouchDB('user.db',
      { 
        adapter: 'cordova-sqlite',
        iosDatabaseLocation: 'Library',
        androidDatabaseImplementation: 2
      });
  }

  create(user) {
    return this.pdb.post(user);
  }

  update(user) {
    return this.pdb.put(user);
  }

  delete(user) {
    return this.pdb.remove(user._id, user._rev);
  }

  read() {
    return this.allDocs();
  }

  allDocs() {
    return this.pdb.allDocs({ include_docs: true })
      .then(docs => {
        let users = docs.rows.map(row => {
          row.doc.Date = new Date(row.doc.Date);
          return row.doc;
        });

        return users;
      });
  }

}
