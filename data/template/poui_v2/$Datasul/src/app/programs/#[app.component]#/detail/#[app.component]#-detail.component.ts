import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { GpsPageDetailComponent } from 'totvs-gps-controls';
import { GpsPageNavigation, GpsCRUDMaintenancePage } from 'totvs-gps-crud';
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
export class #[app.component,PascalCase]#DetailComponent implements OnInit {

  @ViewChild('gpsPageDetail', {static:true}) gpsPageDetail: GpsPageDetailComponent;

  data:#[app.component,PascalCase]#Extended;

  private pageNavigation:GpsPageNavigation = new GpsPageNavigation();
  private maintenanceController:GpsCRUDMaintenancePage<#[app.component,PascalCase]#>;

  constructor(
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
    private service:#[app.component,PascalCase]#Service,
    private activatedRoute: ActivatedRoute, 
    private router:Router,
    private dialogService:PoDialogService,
    private notificationService:PoNotificationService) { 
      this.pageNavigation.setRouter(router);
      this.maintenanceController = new GpsCRUDMaintenancePage(activatedRoute,#[app.component,PascalCase]#);
  }

  ngOnInit() {
    this.gpsPageDetail.showLoading('Carregando');
    this.maintenanceController.getObjectFromRouteParams()
      .then(result => {
        this.service.getByObject(result)
          .then(result => { 
            this.gpsPageDetail.hideLoading();
            this.setData(result);
          })
          .catch(() => this.onBack());
      });
  }

  onBack() {
    this.pageNavigation.back();
  }

  onRemove() {
    this.dialogService.confirm({
      title: 'Remover',
      message: 'Deseja confirmar a remoção deste registro?',
      confirm: () => {
        this.gpsPageDetail.showLoading('Removendo...');
        this.service.removeByObject(this.data)
          .then(result => {
            this.notificationService.success('Registro removido com sucesso!');
            this.onBack();
          })
          .finally(() => this.gpsPageDetail.hideLoading());
      }
    });
  }

  onEdit() {
    this.pageNavigation.editRegisterPage(this.data);
  }

  setData(value){     
    this.data = this.extend#[app.component,PascalCase]#(value);
  }

  //#region Metodos de montagem dos dados
  private extend#[app.component,PascalCase]#(item:#[app.component,PascalCase]#): #[app.component,PascalCase]#Extended {
    let result = new #[app.component,PascalCase]#Extended().parseJsonToObject(item);
@[app.fields,!enumComponent=]@
    result.$#[name]#Description = #[enumComponent,PascalCase]#Enum.getDescription(result.#[name]#);
@[end]@
@[app.fields,!zoomComponent=]@
    this.extend#[zoom.component,PascalCase]#(result.#[name]#).then(value => { result.$#[name]# = value });
@[end]@
    return result;
  }
  
@[app.zooms]@
  private extend#[component,PascalCase]#(value) {
    let model = new #[component,PascalCase]#().parseJsonToObject({#[keyField]#: value});
    return this.#[component,ControllerName]#Zoom.zoomById(model);
  }

@[end]@
  //#endregion

}
