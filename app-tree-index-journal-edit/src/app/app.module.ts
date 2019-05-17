import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { TreeModule } from 'ng2-tree'; 
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { TreeList2Component } from './tree-list2/tree-list2.component';
import { Route } from '@angular/compiler/src/core';
import { CofirmModalComponent } from './cofirm-modal/cofirm-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    TreeList2Component,
    CofirmModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TreeModule,
    HttpModule
  ],
  exports:[TreeList2Component],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
