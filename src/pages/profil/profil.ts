import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {

  email : string = "";
  fName : string = "";
  sName : string = "";
  tel : string = "";
  address : string = "";
  city : string = "";
  zip : string = "";
  restoName : string = "";
  restoType : string = "";
  isDisabled : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider) {
    this.loadInfos();
  }

  loadInfos(){
    this.apiProvider.apiLoadUser().then(data =>{
      this.email = data["email"];
      this.fName = data["fName"];
      this.sName = data["sName"];
      this.tel = data["tel"];
      this.address = data["address"];
      this.city = data["city"];
      this.zip = data["zip"];
      this.restoName = data["restoName"];
      this.restoType = data["restoType"];
    }, err =>{

    });
  }

}
