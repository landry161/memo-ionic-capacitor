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

export class SQLiteService 
{
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
      db.executeSql("CREATE TABLE tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,libelle TEXT NOT NULL,datecreated DATETIME,duree INTEGER NOT NULL,description TEXT NOT NULL)",[]).then((data)=>{
        console.log("Création effectuée avec succès");
      },error=>{
        //alert("Erreur de création "+JSON.stringify(error));
      });
    },error=>{
      console.log("Erreur encore "+JSON.stringify(error));
    });
  }

  //Insert
  async insertTasks(libelle:string,duree:any,description:string)
  {  
    return new Promise((success,fail)=>
    {
      let myTasks:any[];
      let cnx= new SQLite();
      cnx.create({
        name:"ionic-capacitor.db",
        location:"default"
      }).then((db:SQLiteObject)=>
      {
        db.executeSql("INSERT INTO tasks(libelle,datecreated,duree,description) VALUES(?,?,?,?)",[libelle,new Date().toUTCString(),duree,description]).then((resultInsert)=>{
          success(resultInsert.insertId);
        }).catch(error=>{
          fail(error);
        });
      }).catch(error=>{
        fail(error);
      });
    });
  }

  //Suppression
  deleteTask(id:any){
    return new Promise((success,fail)=>{
      let myTasks:any[];
      let cnx= new SQLite();
      cnx.create({
        name:"ionic-capacitor.db",
        location:"default"
      }).then((db:SQLiteObject)=>
      {
        db.executeSql("DELETE FROM tasks WHERE id=?",[id]).then((resultInsert)=>{
          success(resultInsert);
        }).catch(error=>{
          fail(error);
        });
      }).catch(error=>{
        fail(error);
      });
    });
  }

  update(id:any,libelle:any,duree:any,description:any)
  {
    return new Promise((success,fail)=>{
      let myTasks:any[];
      let cnx= new SQLite();
      cnx.create({
        name:"ionic-capacitor.db",
        location:"default"
      }).then((db:SQLiteObject)=>
      {
        db.executeSql("UPDATE tasks SET libelle=?, duree=?,description=? WHERE id=?",[libelle,duree,description,id]).then((resultInsert)=>{
          success(resultInsert);
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
        db.executeSql("SELECT id,libelle,datecreated,duree,description FROM tasks",[]).then((resultTasks)=>
        {
          for(let index=0;index<resultTasks.rows.length;index++)
          {
            myTasks.push(resultTasks.rows.item(index));
          }
          //alert(JSON.stringify(myTasks));
          result(myTasks);
        }).catch((error)=>{
          fail(error);
        });
      }).catch((error)=>
      {
        fail(error);
      });
    });
  }
}