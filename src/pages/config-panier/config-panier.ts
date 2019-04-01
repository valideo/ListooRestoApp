import { TabsPage } from '../../pages/tabs/tabs';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, DateTime, ModalController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-config-panier',
  templateUrl: 'config-panier.html',
})
export class ConfigPanierPage {
  @ViewChild(Slides) slides : Slides;

  prix : number = 10000;
  qtite : number = 1;
  totalGain : number = this.prix*0.3*this.qtite;
  desc : string = "";
  startHour : DateTime;
  isDisabled : boolean = true;
  endHour : DateTime;
  piUrl : string = "";
  minEnd : string = "2119-03-28T23:59Z";
  todayDate : Date = new Date(Date.parse(Date()));
  type : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public events : Events, public apiProvider : ApiProvider, public modalCtrl : ModalController, public viewCtrl : ViewController) {
    events.subscribe('valuePanier', () => {
      this.totalGain = this.prix*0.3*this.qtite;
    });
    this.type = this.navParams.get("type");
    if(this.type != "first")
      this.loadData();
  }

  slideTo(nb : number){
    this.slides.slideTo(nb, 500);
  }
  loadData(){
    this.apiProvider.apiGetAnnonce().then(data =>{
      this.prix = data["price"];
      this.qtite = data["qtite"];
      this.desc = data["desc"];
      this.startHour = data["startHour"];
      this.endHour = data["endHour"];
      this.valueChanged();
    }, err => {

    });
  }

  valueChanged(){
    this.events.publish('valuePanier');
  }

  savePanier(){

    if(this.endHour > this.startHour){
      this.publishAnnonce();
    }else{
      this.apiProvider.presentToast("L'heure de fin de récupération est antérieur à celle de début de récupération !");
    }
  }

  editPanier(){
    let configPanierModal = this.modalCtrl.create(ConfigPanierPage,{type : "edit"},{

    });
    configPanierModal.present();
  }

  dateStartChanged(){
    
    var minEndHour = this.addAnHour(this.startHour.toString());
    var currentMonth = (this.todayDate.getMonth() + 1);
    var currentMonthString;
    if(currentMonth < 10)
      currentMonthString = "0"+currentMonth;
    else
      currentMonthString = currentMonth;

    var currentDay = this.todayDate.getUTCDate();
    var currantDayString
    if(currentDay < 10)
      currantDayString = "0"+currentDay;
    else
      currantDayString = currentDay;

    var currentDate = this.todayDate.getFullYear() + "-" + currentMonthString + "-" + currantDayString;
    this.minEnd = currentDate+"T"+minEndHour+":00Z";
    console.log(this.minEnd);
    this.isDisabled = false;
  }

  addAnHour(hourToConvert : string){
    var hours = parseInt(hourToConvert.substring(0,2));
    hours += 1;
    var stringHours;
    if(hours < 10){
      stringHours = "0"+hours;
    }else if(hours == 23){
      stringHours == "23";
    }else{
      stringHours = hours;
    }
    return stringHours;
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  dateEndChanged(){
    console.log(this.endHour);
  }

  publishAnnonce(){
    if(this.type == "first"){
      this.apiProvider.apiCreateAnnonce(this.desc, this.piUrl, this.prix, this.startHour, this.endHour, this.qtite, false).then(data =>{
        this.dismiss();
      }, err =>{
        
      });
    }else if(this.type == "edit"){
      this.apiProvider.apiUpdateAnnonce(this.desc, this.prix, this.startHour, this.endHour, this.qtite).then(data =>{
        this.navCtrl.setRoot(TabsPage);
      }, err =>{
        
      });
    }
    
  }


}
