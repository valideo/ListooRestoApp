import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from './../../providers/api/api';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from './../login/login';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public nativeStorage : NativeStorage, public platform : Platform, public apiProvider : ApiProvider, public splash : SplashScreen) {
    
  }

  ionViewDidLoad(){
   
    this.platform.ready().then(() => {
        
      this.nativeStorage.getItem('listooUserCredentials')
      .then(
        data => {
          console.log(data);
          this.apiProvider.apiLogin(data['email'], data['pass']).then(data => {
            if(data['token'] != ""){
              this.apiProvider.token = data['token'];
              this.navCtrl.setRoot(TabsPage);
              this.splash.hide();
            }else{
              this.splash.hide();
            }
          });
        },
        error => {
            console.log(error);
            if(this.apiProvider.token != ""){
                
            }
            this.splash.hide();
        }
      );
    });
  }



  quitHome(){
    this.navCtrl.setRoot(TabsPage);
  }

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }



}
