import { TabsPage } from '../../pages/tabs/tabs';
import { ConfigPanierPage } from './../config-panier/config-panier';
import { StartConfigPage } from './../start-config/start-config';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  todayDate : Date = new Date(Date.parse(Date()));
  dateFormated : string = "";
  isPublished : boolean = false;
  imgUrl : string = "http:///192.168.1.3:8080/uploads/defaultPic.jpg";

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public modalCtrl : ModalController, public events : Events, public imagePicker : ImagePicker, private transfer: FileTransfer) {
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
      if(data["piUrl"] != "")
        this.imgUrl = "http:///192.168.1.3:8080/uploads/"+data["piUrl"];
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
      for (var i = 0; i < results.length; i++) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        mimeType: 'multipart/form-data',
        params : {file : results[i]}
     }
     fileTransfer.upload(results[i], 'http:///192.168.1.3:8080/apiImg/upload', options)
      .then((data) => {
        this.apiProvider.apiUpdateImg(data["response"]).then(data=>{
          this.navCtrl.setRoot(TabsPage);
          console.log(data);
        },err=>{
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      })
    }
    }, (err) => { });

  }

  ionViewDidEnter(){
   this.init();
  }

}
