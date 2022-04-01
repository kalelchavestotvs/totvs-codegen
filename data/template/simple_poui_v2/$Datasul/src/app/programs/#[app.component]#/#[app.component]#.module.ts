import { NgModule } from '@angular/core';
import { #[app.component,PascalCase]#ListComponent } from './list/#[app.component]#-list.component';
import { #[app.component,PascalCase]#DetailComponent } from './detail/#[app.component]#-detail.component';
import { #[app.component,PascalCase]#EditComponent } from './edit/#[app.component]#-edit.component';
import { AppComponent } from '../../app.component';
import { #[app.component,PascalCase]#RoutingModule } from './#[app.component]#.routing.module';
import { AppModule } from '../../app.module';
import { #[app.component,PascalCase]#Service } from './services/#[app.component]#.service';
import { ParamService } from 'totvs-gps-api';
@[app.zooms]@
import { #[component,PascalCase]#Zoom } from './zoom/#[component]#.zoom';
@[end]@

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    #[app.component,PascalCase]#RoutingModule,    
    AppModule
  ],  
  declarations: [
    #[app.component,PascalCase]#ListComponent,
    #[app.component,PascalCase]#EditComponent,
    #[app.component,PascalCase]#DetailComponent,
  ],
  exports: [
    #[app.component,PascalCase]#ListComponent,
  ],
  providers: [
    ParamService,
    #[app.component,PascalCase]#Service,
@[app.zooms]@
    #[component,PascalCase]#Zoom,
@[end]@    
  ]
})
export class #[app.component,PascalCase]#Module { }
