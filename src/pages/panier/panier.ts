import { ConfigPanierPage } from './../config-panier/config-panier';
import { StartConfigPage } from './../start-config/start-config';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  todayDate : Date = new Date(Date.parse(Date()));
  dateFormated : string = "";
  isPublished : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public modalCtrl : ModalController, public events : Events, public photoLibrary : PhotoLibrary) {
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

    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => console.log('permissions weren\'t granted'));

  }

  ionViewDidEnter(){
   this.init();
  }

}
