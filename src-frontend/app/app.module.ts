import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { PoModule } from '@po-ui/ng-components';

import { ZikiHttpServicesModule } from "ziki-http-services";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';

import { MenuComponent } from './pages/menu/menu.component';
import { ApplicationEditComponent } from './pages/application-edit/application-edit.component';
import { FieldEditComponent } from './pages/field-edit/field-edit.component';
import { ApplicationNameComponent } from './pages/application-name/application-name.component';
import { GenerateComponent } from './pages/generate/generate.component';
import { RelationAddComponent } from './pages/relation-add/relation-add.component';
import { EnumEditComponent } from './pages/enum-edit/enum-edit.component';
import { ZoomEditComponent } from './pages/zoom-edit/zoom-edit.component';

import { DataService } from './services/data.service';
import { RequestService } from './services/request.service';
import { TypeTranslateService } from './services/type-translate.service';

const modules = [
  BrowserModule,
  CommonModule,
  FormsModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  PoModule,
  ZikiHttpServicesModule
];
const services = [
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ApplicationEditComponent,
    LoadingComponent,
    FieldEditComponent,
    ApplicationNameComponent,
    GenerateComponent,
    RelationAddComponent,
    EnumEditComponent,
    ZoomEditComponent
  ],
  imports: [
    ...modules
  ],
  providers: [
    ...services,
    DataService,
    RequestService,
    TypeTranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
