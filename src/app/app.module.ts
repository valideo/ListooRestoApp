import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { CommandesPage } from './../pages/commandes/commandes';
import { PanierPage } from './../pages/panier/panier';
import { ProfilPage } from './../pages/profil/profil';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { ConfigPanierPage } from './../pages/config-panier/config-panier';
import { StartConfigPage } from './../pages/start-config/start-config';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    CommandesPage,
    PanierPage,
    ProfilPage,
    TabsPage, 
    HomePage,
    RegisterPage,
    LoginPage,
    ConfigPanierPage,
    StartConfigPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CommandesPage,
    PanierPage,
    ProfilPage,
    TabsPage,
    HomePage,
    RegisterPage,
    LoginPage,
    ConfigPanierPage,
    StartConfigPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider, 
    NativeStorage
  ]
})
export class AppModule {}
