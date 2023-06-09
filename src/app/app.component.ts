import { Component } from '@angular/core';
import {SQLiteService}  from "../app/sqlite.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor(private sqliteService:SQLiteService) {
    this.sqliteService.initializePlugin().then((result)=>{
      //alert("Ok "+JSON.stringify(result));
    },(error:any)=>{
      //alert("Non "+JSON.stringify(error));
    });
  }


}
