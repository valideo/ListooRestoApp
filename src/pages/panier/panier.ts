import { ConfigPanierPage } from './../config-panier/config-panier';
import { StartConfigPage } from './../start-config/start-config';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  todayDate : Date = new Date(Date.parse(Date()));
  dateFormated : string = "";
  isPublished : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public modalCtrl : ModalController, public events : Events, public imagePicker : ImagePicker) {
    var currentMonth = (this.todayDate.getMonth() + 1);
    var currentMonthString;
    if(currentMonth < 10)
      currentMonthString = "0"+currentMonth;
    else
      currentMonthString = currentMonth;
    this.dateFormated = this.todayDate.getUTCDate()+"/"+currentMonthString+"/"+this.todayDate.getFullYear();
  }

  init(){
    this.apiProvider.apiGetAnnonce().then(data =>{
      if(data["isActive"] == true)
        this.isPublished = true;
      
    },err =>{
      if(err["status"] == 404){
        this.showStartConfig();
      }
    })
  }

  activeAnnonce(){
    this.apiProvider.apiChangeAnnonceState(true).then(data=>{
      this.isPublished = true;
    }, err =>{

    })
  }

  disableAnnonce(){
    this.apiProvider.apiChangeAnnonceState(false).then(data=>{
      this.isPublished = false;
    }, err =>{
      
    })
  }

  showStartConfig(){
    let startConfigModal = this.modalCtrl.create(StartConfigPage,{type : "first"},{
      cssClass : 'modal-config'
    });
    let configPanierModal = this.modalCtrl.create(ConfigPanierPage,{type : "first"},{

    });
    startConfigModal.onDidDismiss(data => {
     if(data["data"] == "config"){
      configPanierModal.present();
     }else{
      this.apiProvider.isBlured = "fadeOutBlur";
      this.events.publish('blurChange');
     }
    });
    this.apiProvider.isBlured = "fadeInBlur";
    this.events.publish('blurChange');
    startConfigModal.present();
  }

  goDetail(){
    this.navCtrl.push(ConfigPanierPage, {type : "detail"});
  }

  changePicture(){
    var options = {maximumImagesCount : 1, quality : 60, width : 500}
    this.imagePicker.getPictures(options).then((results) => {
      console.log('Image URI: ' + results);
    }, (err) => { });

  }

  ionViewDidEnter(){
   this.init();
  }

}
