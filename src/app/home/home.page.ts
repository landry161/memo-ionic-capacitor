import { Component } from '@angular/core';
import {CapacitorSQLite,JsonSQLite} from "@capacitor-community/sqlite";
import {SQLiteService} from "../sqlite.service";
import { LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
//import { posix } from 'path';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage
{
  task:string="";
  myTask='';
  addTask: boolean=false;
  tasks=Array();

  currentDate:string;
  constructor(private loader:LoadingController,private _sqlite:SQLiteService)
  {
    const date= new Date();
    const options={ weekday:'long',month:'long',day:'numeric'};
    this.currentDate=date.toLocaleDateString("fr-FR",{day:"numeric",weekday:"long",month:"long"});

    this.getAllTasks();
  }

  ///
  addTasks(){
    const date=new Date();
    const finalDate=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
    /*this.tasks.push({libelle:this.task,datefin:finalDate});
    this.task="";
    this.showForm();*/
    this._sqlite.insertTasks(this.task,finalDate).then((success)=>
    {
      this.showToast("Tâche ajoutée avec succès");
      this.tasks.push({libelle:this.task,datefin:finalDate});
      this.task="";
      this.showForm();
    },error=>
    {
      this.showToast("Ajout de tâche impossible. Pensez à vérifier vos informations");
    });
  }

  showForm(){
    this.addTask = !this.addTask;
    this.myTask = '';
  }

  //Liste des Tasks
  async getAllTasks()
  {
    const loading = await this.loader.create({
      message: 'Affichage en cours ...',
      //duration: 3000,
    });

    loading.present();
    this._sqlite.getTasks().then((result)=>
    {
      alert("JSON RESULTAT "+JSON.stringify(result));
      this.tasks=<Array<Object>>result;
      loading.dismiss();

    },error=>
    {
      alert("Erreur de sélection "+JSON.stringify(error));
      loading.dismiss();
      this.showToast("Aucune données disponible");
    });
  }

   async showToast(message:any){
    return Toast.show({
      text: message,
      duration:"long",
      position:"bottom"
    });
   }

  //Retry
   getRefreshAllTasks(){
    this.getAllTasks();
   }
}
