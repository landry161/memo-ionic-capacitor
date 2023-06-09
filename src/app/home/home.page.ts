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

  //
  async details(id:any,duree:any,description:any,datecreated:any){
    const result = await ActionSheet.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Upload',
        },
        {
          title: 'Share',
        },
        {
          title: 'Remove',
          style: ActionSheetButtonStyle.Destructive,
        },
      ],
    });
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
    //this.myTask = ''; 
  }

  async actionSheet(){
    const result= await ActionSheet.showActions({
      title:"Actions",
      message:"Message ici",
      options:[{
        title:"Option 1"
      },{
        title:"Option 2"
      },{
        title:"Option 3"
      }]
    }).then((res:any)=>{
      //alert("Ok");
    });
    return result;
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
