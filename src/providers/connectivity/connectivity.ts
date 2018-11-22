import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@ionic-native/network';
/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectivityProvider {

  online: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public http: HttpClient, private network: Network) {
    console.log('Hello ConnectivityProvider Provider');

    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.online.next(false);
    });

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.online.next(true);
    });

  }

}
