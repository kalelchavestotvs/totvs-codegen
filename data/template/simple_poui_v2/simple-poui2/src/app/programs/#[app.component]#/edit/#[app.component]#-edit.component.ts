import { Component } from '@angular/core';
import { #[app.component,PascalCase]#Service } from '../services/#[app.component]#.service';
import { #[app.component,PascalCase]# } from '../models/#[app.component]#';
@[app.enums]@
import { #[component,PascalCase]#Enum } from '../enum/#[component]#.enum';
@[end]@
@[app.zooms]@
import { #[component,PascalCase]# } from '../models/#[component]#';
import { #[component,PascalCase]#Zoom } from '../zoom/#[component]#.zoom';
@[end]@

@Component({
  selector: 'app-#[app.component]#-edit',
  templateUrl: './#[app.component]#-edit.component.html'
})
export class #[app.component,PascalCase]#EditComponent {

  data:#[app.component,PascalCase]#;
  isNew:boolean = true;
@[app.enums]@
  #[component,camelCase]#Options = [
    { value: ?[isNumeric]?0?[end]??[!isNumeric]?''?[end]?, label: '(Não informado)' },
    ...#[component,PascalCase]#Enum.#[component,PascalCase]#
  ];
@[end]@

  constructor(
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
    public service:#[app.component,PascalCase]#Service
  ) { }

}
