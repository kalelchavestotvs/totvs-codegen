import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { GpsPageEditComponent } from 'totvs-gps-controls';
import { GpsPageNavigation, GpsCRUDMaintenancePage } from 'totvs-gps-crud';
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
export class #[app.component,PascalCase]#EditComponent implements OnInit {

  @ViewChild('gpsPageEdit', {static:true}) gpsPageEdit: GpsPageEditComponent;

  data:#[app.component,PascalCase]#;
@[app.enums]@
  #[component,camelCase]#Options = [
    { value: ?[isNumeric]?0?[end]??[!isNumeric]?''?[end]?, label: '(Não informado)' },
    ...#[component,PascalCase]#Enum.#[component,PascalCase]#
  ];
@[end]@

  private isNew:boolean = true;
  private pageNavigation:GpsPageNavigation = new GpsPageNavigation();
  private maintenanceController:GpsCRUDMaintenancePage<#[app.component,PascalCase]#>;

  constructor(
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
    private service:#[app.component,PascalCase]#Service,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private notificationService:PoNotificationService) {
      this.pageNavigation.setRouter(router);
      this.maintenanceController = new GpsCRUDMaintenancePage(activatedRoute,#[app.component,PascalCase]#);
  }

  ngOnInit() {
    this.maintenanceController.getObjectFromRouteParams()
      .then((result: #[app.component,PascalCase]#) => {
        this.data = result;
        this.initializePage();
      })
      .catch(() => this.onBack());
  }

  private initializePage(){
    if(!this.data){
      this.initializeAddPage();
    }
    else {
      this.initializeEditPage();
    }
  }

  private initializeAddPage(){
    this.isNew = true;
    this.setData(new #[app.component,PascalCase]#());
  }

  private initializeEditPage() {
    this.gpsPageEdit.showLoading('Carregando');
    this.isNew = false;
    this.service.getByObject(this.data)
      .then(result => {
        this.gpsPageEdit.hideLoading();
        this.setData(result);
      })
      .catch(() => this.onBack());
  }

  private onBack() {
    this.pageNavigation.back();
  }

  getPageTitle(){
    let _title = "#[app.description,camelCase]#";
    return this.isNew ? "Adicionar " + _title : "Editar " + _title;
  }

  onCancel() {
    this.onBack();
  }

  onSave() {
    this.gpsPageEdit.showLoading('Salvando dados...');
    let _promise: Promise<#[app.component,PascalCase]#> = this.isNew ?
        this.service.insert(this.data).then(value => { this.notificationService.success('Registro cadastrado com sucesso!'); return value; })
      : this.service.update(this.data).then(value => { this.notificationService.success('Registro alterado com sucesso!'); return value; });
    _promise
      .then(result => this.onBack())
      .finally(() => this.gpsPageEdit.hideLoading());
  }

  setData(value){
    if(!this.data)
      this.data = new #[app.component,PascalCase]#();
    Object.assign(this.data,value);
  }

}
