import { Component } from '@angular/core';
import { #[app.component,PascalCase]#Service } from '../services/#[app.component]#.service';
import { #[app.component,PascalCase]# } from '../models/#[app.component]#';
import { #[app.component,PascalCase]#Extended } from '../models/#[app.component]#-extended';
@[app.enums]@
import { #[component,PascalCase]#Enum } from '../enum/#[component]#.enum';
@[end]@
@[app.zooms]@
import { #[component,PascalCase]# } from '../models/#[component]#';
import { #[component,PascalCase]#Zoom } from '../zoom/#[component]#.zoom';
@[end]@

@Component({
  selector: 'app-#[app.component]#-detail',
  templateUrl: './#[app.component]#-detail.component.html'
})
export class #[app.component,PascalCase]#DetailComponent {

  data:#[app.component,PascalCase]#Extended;

  constructor(
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
    public  service:#[app.component,PascalCase]#Service
  ) { }

  //#region Metodos de montagem dos dados
  extend#[app.component,PascalCase]#(item:#[app.component,PascalCase]#) {
    let result = new #[app.component,PascalCase]#Extended().parseJsonToObject(item);
@[app.fields,!enumComponent=]@
    result.$#[name]#Description = #[enumComponent,PascalCase]#Enum.getDescription(result.#[name]#);
@[end]@
@[app.fields,!zoomComponent=]@
    this.extend#[zoom.component,PascalCase]#(result.#[name]#).then(value => { result.$#[name]# = value });
@[end]@
    this.data = result;
  }
  
@[app.zooms]@
  private extend#[component,PascalCase]#(value) {
    let model = new #[component,PascalCase]#().parseJsonToObject({#[keyField]#: value});
    return this.#[component,camelCase]#Zoom.zoomById(model);
  }

@[end]@
  //#endregion

}
