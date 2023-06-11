import { Component } from '@angular/core';
import {CapacitorSQLite,JsonSQLite} from "@capacitor-community/sqlite";
import {SQLiteService} from "../sqlite.service";
import { LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage
{
  task:string="";
  memo={libelle:"",description:"",duree:"",datecreated:""};
  memoUpdate={id:"",libelle:"",description:"",duree:"",datecreated:""};
  addTask: boolean=false;
  tasks=Array();
  currentDate:string;
  toUpdate:boolean=false;
  
  constructor(private loader:LoadingController,private _sqlite:SQLiteService)
  {
    const date= new Date();
    const options={weekday:'long',month:'long',day:'numeric'};
    this.currentDate=date.toLocaleDateString("fr-FR",{day:"numeric",weekday:"long",month:"long"});
    this.getAllTasks();
  }

  //
  edit(){
    
  }

  ///
  addTasks(){
    //this.tasks.push({libelle:this.memo.libelle,duree:this.memo.duree});
    this._sqlite.insertTasks(this.memo.libelle,this.memo.duree,this.memo.description).then((success)=>
    {
      this.showToast("Tâche ajoutée avec succès");
      this.tasks.push({libelle:this.memo.libelle,duree:this.memo.duree});
      this.makeEmptyField();
    },error=>
    {
      this.showToast("Ajout de tâche impossible. Pensez à vérifier vos informations");
    });
  }

  showForm(){
    this.addTask = !this.addTask;
    this.toUpdate=false;
  }

  //Mise à jour
  updateTask()
  {
    //id:any,libelle:any,duree:any,description:any
    this._sqlite.update(this.memoUpdate.id,this.memoUpdate.libelle,this.memoUpdate.duree,this.memoUpdate.description).then((result)=>
    {
      for (let index = 0; index < this.tasks.length; index++)
      {
        //const element = this.tasks[index];
        if(this.memoUpdate.id==this.tasks[index]["id"]){
          this.tasks[index]["libelle"]=this.memoUpdate.libelle;
          this.tasks[index]["duree"]=this.memoUpdate.duree;
          this.tasks[index]["description"]=this.memoUpdate.description;
        }
      }
      this.showToast("Mise à jour effectuée avec succès");
      this.toUpdate=false;
    },error=>
    {
      this.showToast("Mise à jour impossible. Contacez votre administrateur");
    })
  }

  //Détails
  detailsTask(id:any,libelle:any,duree:any,description:any){
    this.toUpdate=true;
    this.memoUpdate.libelle=libelle;
    this.memoUpdate.duree=duree;
    this.memoUpdate.description=description;
    this.memoUpdate.id=id;
  }

  //Suppression
  delete(id:any)
  {
    this._sqlite.deleteTask(id).then((result)=>
    {
      this.showToast("Suppression effectuée avec succès");
    },error=>{
      this.showToast("Suppression impossible.Contactez votre administrateur");
    });
  }

  //
  makeEmptyField()
  {
    this.memo={libelle:"",description:"",duree:"",datecreated:""};
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
      //alert("JSON RESULTAT "+JSON.stringify(result));
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
    this.addTask=false;
   }
}
