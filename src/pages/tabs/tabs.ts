import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from './../../providers/api/api';
import { ProfilPage } from './../profil/profil';
import { CommandesPage } from './../commandes/commandes';
import { PanierPage } from './../panier/panier';
import { Component, ViewChild } from '@angular/core';
import { Events, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = PanierPage;
  tab2Root = CommandesPage;
  tab3Root = ProfilPage;
  isBlured : string = "no";

  constructor(public apiProvider : ApiProvider, public events : Events, public splash : SplashScreen) {
    events.subscribe('blurChange', () => {
      this.isBlured = this.apiProvider.isBlured;
    });
    events.subscribe('goOrders', () => {
      this.tabRef.select(1);
    });

  }

  ionViewDidLoad(){
    this.splash.hide();
  }

}
