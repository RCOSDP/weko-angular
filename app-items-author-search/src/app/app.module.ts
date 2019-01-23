import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppComponent } from './app.component';
import { Route } from '@angular/compiler/src/core';
import { AddAuthorComponent } from './add-author/add-author.component';


@NgModule({
  declarations: [
    AppComponent,
    AddAuthorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
