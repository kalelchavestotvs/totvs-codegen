import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { GpsPageDetailComponent } from 'totvs-gps-controls';
import { GpsPageNavigation, GpsCRUDMaintenancePage } from 'totvs-gps-crud';
import { #[app.component,PascalCase]#Service } from '../services/#[app.component]#.service';
import { #[app.component,PascalCase]# } from '../models/#[app.component]#';
import { #[app.component,PascalCase]#Extended } from '../models/#[app.component]#-extended';
import { #[app.component,PascalCase]#Enum } from '../enum/#[app.component]#.enum';
@[app.enums]@
import { #[component,PascalCase]#Enum } from '../enum/#[component]#.enum';
@[end]@
@[app.zooms]@
import { #[component,PascalCase]# } from '../models/#[component]#';
import { #[component,PascalCase]#Zoom } from '../zoom/#[component]#.zoom';
@[end]@?[app.useCacheService]?
import { TotvsGpsCacheService } from 'totvs-gps-services';?[end]?

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
    private service:#[app.component,PascalCase]#Service,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private dialogService:PoDialogService,
    private notificationService:PoNotificationService,?[app.useCacheService]?
    private cacheService: TotvsGpsCacheService,?[end]?
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
  ) {
      this.pageNavigation.setRouter(router);
      this.maintenanceController = new GpsCRUDMaintenancePage(activatedRoute,#[app.component,PascalCase]#);?[app.useCacheService]?
@[app.zooms]@
      this.cacheService.addService(new #[component,PascalCase]#(), this.#[component,camelCase]#Zoom);
@[end]@?[end]?
  }

  ngOnInit() {
    this.gpsPageDetail.showLoading('Carregando');
    this.maintenanceController.getObjectFromRouteParams()
      .then((result: #[app.component,PascalCase]#) => {
        this.service.getByObject(result)
          .then(result => {
            this.gpsPageDetail.hideLoading();
            this.setData(result);
            this.initCustom();
          })
          .catch(() => this.onBack());
      });
  }

  initCustom(){
    this.gpsPageDetail.setupCustomFields(
      #[app.component,PascalCase]#Enum.APP_NAME,
      #[app.component,PascalCase]#Enum.CUSTOM_DETAIL,
      this.maintenanceController.urlSegments,
      this.service);
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
@[end]@?[app.useCacheService]?
@[app.fields,!zoomComponent=]@
    this.cacheService.extend(new #[zoom.component,PascalCase]#().parseJsonToObject({#[zoom.keyField]#: result.#[name]#}), #[hasZeroAll]#).then((value) => result.parseJsonToObject(value));
@[end]@?[end]??[!app.useCacheService]?
@[app.fields,!zoomComponent=]@
    this.extend#[zoom.component,PascalCase]#(result.#[name]#).then((value: #[zoom.component,PascalCase]#) => {
        let model = new #[zoom.component,PascalCase]#();

        if(value)
          model = model.parseJsonToObject(value);
        else
          model = model.parseJsonToObject({#[zoom.keyField]#: result.#[name]#, #[zoom.labelField]#:'Não encontrado(a)'});

        result.parseJsonToObject(model);
    }).catch(() => {
        result.parseJsonToObject(new #[zoom.component,PascalCase]#().parseJsonToObject({#[zoom.keyField]#: result.#[name]#, #[zoom.labelField]#:'Não encontrado(a)'}))
    });

@[end]@?[end]?

    return result;
  }
?[!app.useCacheService]?
@[app.zooms]@
  private extend#[component,PascalCase]#(value) {
      let model = new #[component,PascalCase]#().parseJsonToObject({#[keyField]#: value});
      return this.#[component,camelCase]#Zoom.zoomById(model);
  }

@[end]@?[end]?

}
