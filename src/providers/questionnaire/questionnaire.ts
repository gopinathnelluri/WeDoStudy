//import { HttpClient } from '@angular/common/http';
/*
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
*/

import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';


/*
  Generated class for the QuestionnaireProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QuestionnaireProvider {

  constructor() {
    console.log('Hello QuestionnaireProvider Provider');
    this.createPouchDB();
  }

  public pdb;
  public questionnaires;

  createPouchDB() {
    PouchDB.plugin(cordovaSqlitePlugin);
    this.pdb = new PouchDB('employees.db',
      { 
        adapter: 'cordova-sqlite',
        iosDatabaseLocation: 'Library',
        androidDatabaseImplementation: 2
      });
  }

  create(questionnaire) {
    return this.pdb.post(questionnaire);
  }

  update(questionnaire) {
    return this.pdb.put(questionnaire);
  }

  delete(questionnaire) {
    return this.pdb.remove(questionnaire._id, questionnaire._rev);
  }

  read2() {
    let pdb = this.pdb;

    function allDocs() {

      let _questionnaire = pdb.allDocs({ include_docs: true })
        .then(docs => {
          return docs.rows;
        });

      return Promise.resolve(_questionnaire);
    };

    return allDocs();
  }



  read() {


    this.pdb.changes({ live: true, since: 'now', include_docs: true })
      .on('change', () => {
        this.allDocs().then((emps) => {

          this.questionnaires = emps;
        });
      });
    return this.allDocs();

  }


  allDocs() {
    return this.pdb.allDocs({ include_docs: true })
      .then(docs => {
        this.questionnaires = docs.rows.map(row => {
          row.doc.Date = new Date(row.doc.Date);
          return row.doc;
        });

        return this.questionnaires;
      });
  }

}
