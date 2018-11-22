import { Component, NgZone } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { QuestionnaireProvider } from '../../providers/questionnaire/questionnaire';


import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { Subscription } from 'rxjs';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { LocalAuthenticatorProvider } from '../../providers/local-authenticator/local-authenticator';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  connection: any;
  logedIn: boolean;

  questionnaires: any;
  connectivitySubscription: Subscription;
  constructor(private zone: NgZone, public localAuthenticatorProvider: LocalAuthenticatorProvider, public afAuth: AngularFireAuth, private firebaseProvider: FirebaseProvider, private connectivityProvider: ConnectivityProvider, public navCtrl: NavController, public questionnaireProvider: QuestionnaireProvider, private viewCtrl: ViewController) {

    this.connectivitySubscription = this.connectivityProvider.online.subscribe((data) => {
      this.zone.run(() => {
        this.connection = data;
      });
    })

    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.logedIn = true;
      } else {
        this.logedIn = false;
        this.authenticate();
      }
    }, (error) => {
      console.log(error);
    })
  }

  authenticate() {
    setTimeout(() => {
      this.navCtrl.push(LoginPage, {
      })
    }, 1000);
  }


  ionViewDidEnter() {
    this.viewCtrl.showBackButton(false);
    this.questionnaireProvider.createPouchDB();

    this.questionnaireProvider.read()
      .then(questionnaires => {
        this.questionnaires = questionnaires;
      })
      .catch((err) => { });

  }

  addQ() {
    this.questionnaireProvider.create({ questionnaire: +new Date() }).then(() => {
      this.questionnaireProvider.read()
        .then(questionnaires => {
          this.questionnaires = questionnaires;
        })
        .catch((err) => { });
    })
  }
  showDetails(questionnaire) {
  }

  logOut() {
    this.afAuth.auth.signOut().then((data) => {
      //this.logedIn = false;
      this.localAuthenticatorProvider.read().then((data) => {
        if (data && data.length > 0) {
          let tempLength = data.length;
          for (let i = 0; i < data.length; ++i) {
            this.localAuthenticatorProvider.delete(data[i]).then(() => {
              if (i + 1 == tempLength) {
                console.log("test1");

              }
            })
          }
        } else {
          setTimeout(() => {
            this.navCtrl.push(LoginPage, {
            })
          }, 1000);
        }
      })
    })
  }

}
