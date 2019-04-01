import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, DateTime } from 'ionic-angular';

@Injectable()
export class ApiProvider {

  apiBaseUrl = "http://127.0.0.1:8080/api/";
  token : string = "";
  isBlured : string = "blured";

  constructor(public http: HttpClient,private toastCtrl: ToastController) {

  }

  presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top',
      cssClass: "toast-error"
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  //Users

  apiLogin(email : string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/loginResto/", postData, options).subscribe(data => {
        this.token = data['token'];
        resolve(data);
      }, err => {
        if(err.status == 400){
          this.presentToast('Champs incorrects');
      }else if(err.status == 403 || err.status == 404){
           this.presentToast('Identifiant ou mot de passe incorrect');
      }else{
           this.presentToast('Erreur serveur');
      }
      });
    });
  }

  apiRegister(email : string, password: string, sName : string, fName : string, address : string, city : string, zip : string, tel : string, restoName : string, restoType : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password, "sName": sName, "fName" : fName, "address" : address, "city": city, "zip" : zip, "tel" : tel, "restoName" : restoName, "restoType" : restoType }
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/registerResto/", postData, options).subscribe(data => {
        resolve(data);
        this.presentToast("Votre compte a bien été créé");
      }, err => {
        if(err.status == 400){
          this.presentToast('Champs incorrects');
      }else if(err.status == 403 || err.status == 404){
           this.presentToast('Identifiant ou mot de passe incorrect');
      }else{
           this.presentToast('Erreur serveur');
      }
      });
    });
  }

  apiLoadUser() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/me/", options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentToast('Impossible de charger les informations');
      });
    });
  }

  apiUpdateMe(email:string, username:string, fname:string, sname:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let postData = {"email": email,"username": username, "prenom":fname, "nom":sname}
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"users/me/",postData, options).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  //Annonces 

  apiGetAnnonce() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"getAnnonce/", options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiCreateAnnonce(desc : string, piUrl: string, price : number, startHour : DateTime, endHour : DateTime, qtite : number, isActive : boolean) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"desc": desc, "piUrl": piUrl, "price" : price, "startHour" : startHour, "endHour": endHour, "qtite" : qtite, "isActive" : isActive}
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBaseUrl+"annonce/create/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  apiUpdateAnnonce(desc : string, price : number, startHour : DateTime, endHour : DateTime, qtite : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"desc": desc, "price" : price, "startHour" : startHour, "endHour": endHour, "qtite" : qtite}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"annonce/update/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  apiChangeAnnonceState(isActive : boolean) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"isActive" : isActive}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"annonce/updateState/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }





}
