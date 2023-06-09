import { Injectable } from '@angular/core';
import {Plugins,Capacitor } from "@capacitor/core";
import { SQLiteConnection} from '@capacitor-community/sqlite';
const { CapacitorSQLite } = Plugins;
import {SQLite,SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
const mSQLite = new SQLiteConnection(CapacitorSQLite);
let database: any;

@Injectable({
  providedIn: 'root'
})

export class SQLiteService {

  dbName="";
  sqlite: any;

  constructor() {
  }
  //>
  async initializePlugin()
  {
    let cnx= new SQLite();
    cnx.create({
      name:"ionic-capacitor.db",
      location:"default",
    }).then((db:SQLiteObject)=>
    {
      db.executeSql("CREATE TABLE tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,libelle TEXT NOT NULL,datefin TEXT NOT NULL)",[]).then((data)=>{
        alert("Création effectuée avec succès");
      },error=>{
        alert("Erreur de création "+JSON.stringify(error));
      });
    },error=>{
      alert("Erreur encore "+JSON.stringify(error));
    });
  }

  //Insert
  async insertTasks(task:any,datefin:any){

    return new Promise((success,fail)=>
    {
      let myTasks:any[];
      let cnx= new SQLite();
      cnx.create({
        name:"ionic-capacitor.db",
        location:"default"
      }).then((db:SQLiteObject)=>
      {
        db.executeSql("INSERT INTO tasks(libelle,datefin) VALUES(?,?)",[task,datefin]).then((resultInsert)=>{
          success(resultInsert.insertId);
        }).catch(error=>{
          fail(error);
        });
      }).catch(error=>{
        fail(error);
      });
    });
  }

  //Liste
    getTasks()
  {
    var myTasks=Array();
    return new Promise((result,fail)=>
    {
      let cnx= new SQLite();
      cnx.create({
        name:"ionic-capacitor.db",
        location:"default"
      }).then((db:SQLiteObject)=>{
        db.executeSql("SELECT id,libelle,datefin FROM tasks",[]).then((resultTasks)=>
        {
          alert(" Rows "+JSON.stringify(resultTasks));
          for(let index=0;index<resultTasks.rows.length;index++)
          {
            //alert("Voici le resultat "+JSON.stringify(resultTasks.rows.item(index)));
            //myTasks.push(resultTasks.rows.item(index));
            //alert("Compteur "+index);
            //alert("Voici le resultat "+JSON.stringify(resultTasks.rows.item(index)));
            myTasks.push(resultTasks.rows.item(index));
          }

          //alert(myTasks);
          result(myTasks);
        }).catch((error)=>{
          fail(error);
        });
      }).catch((error)=>{
        fail(error);
      });
    });
  }
}
