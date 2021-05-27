import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FileSaverModule } from 'ngx-filesaver';

import { AppComponent } from './app.component';
import { DemoComponent } from './components/demo.component';

@NgModule({
  declarations: [AppComponent, DemoComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, FileSaverModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppDemoModule {}
