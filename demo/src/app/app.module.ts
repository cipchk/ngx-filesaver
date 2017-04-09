import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { FileSaverModule } from 'ngx-filesaver';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileSaverModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class FileSaverDemoModule {
}
