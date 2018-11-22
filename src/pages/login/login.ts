import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { LocalAuthenticatorProvider } from '../../providers/local-authenticator/local-authenticator';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { Subscription } from 'rxjs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  error: any;
  email: any = "";
  password: any = "";

  localUser: any;

  connectivitySubscription: Subscription;

  constructor(private connectivityProvider: ConnectivityProvider, public localAuthenticatorProvider: LocalAuthenticatorProvider, public afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.viewCtrl.showBackButton(false);

    this.localAuthenticate(true);

    this.connectivitySubscription = this.connectivityProvider.online.subscribe((data) => {
      if (data) {
        this.afAuth.authState.subscribe((auth) => {
          console.log(auth);
          if (auth) {
            this.navCtrl.push(HomePage, {
            });
          } else {
            this.localAuthenticate(true);
          }
        }, (error) => {
          console.log(error);
        })
      } else {
        //this.localAuthenticate(false);
      }
    })
  }

  localAuthenticate(real) {
    this.localAuthenticatorProvider.read().then((data) => {
      console.log(data);
      if (data && data.length > 0) {
        this.localUser = data[0];
        if(real){
          if (this.localUser && this.localUser.email && this.localUser.password) {
            this.autoLogin(this.localUser.email, this.localUser.password);
          }
        } else {
          this.navCtrl.push(HomePage, {
          });
        }
      }
    })
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, "NG" + this.password).then(
      (success) => {
        this.error = undefined;
        this.storeLogins(this.email, this.password);
        this.navCtrl.push(HomePage, {
        });
      }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        })
  }

  storeLogins(email, password){
    this.localAuthenticatorProvider.read().then((data) => {
      if (data && data.length > 0) {
        for(let i = 0; i< data.length; ++i){
          this.localAuthenticatorProvider.delete(data[i]);
        }
      }
      this.localAuthenticatorProvider.create({email: email, password: password});
    })
  }

  autoLogin(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, "NG" + password).then(
      (success) => {
        this.navCtrl.push(HomePage, {
        });
      }).catch(
        (err) => {
        })
  }

}
