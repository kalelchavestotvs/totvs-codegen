import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDialogService, PoNotificationService, PoPageAction, PoTableColumn, PoTableAction, PoSelectOption } from '@po-ui/ng-components';
import { GpsPageListComponent, IDisclaimerConfig, GpsExportDataComponent, IExportColumn } from 'totvs-gps-controls';
import { GpsPageFilter, GpsPageNavigation, GpsCRUDListModel } from 'totvs-gps-crud';
import { ParamService } from 'totvs-gps-api';
import { #[app.component,PascalCase]#Service } from '../services/#[app.component]#.service';
import { #[app.component,PascalCase]#, I#[app.component,PascalCase]#Filter } from '../models/#[app.component]#';
import { #[app.component,PascalCase]#Extended } from '../models/#[app.component]#-extended';
@[app.enums]@
import { #[component,PascalCase]#Enum } from '../enum/#[component]#.enum';
@[end]@
@[app.zooms]@
import { #[component,PascalCase]# } from '../models/#[component]#';
import { #[component,PascalCase]#Zoom } from '../zoom/#[component]#.zoom';
@[end]@

@Component({
  selector: 'app-#[app.component]#-list',
  templateUrl: './#[app.component]#-list.component.html'
})

export class #[app.component,PascalCase]#ListComponent implements OnInit {

  @ViewChild('gpsPageList', {static: true}) gpsPageList: GpsPageListComponent;
  @ViewChild('exportComponent', {static: false}) exportComponent: GpsExportDataComponent;

  filterCacheId:string = '#[app.component]#';
  pageNavigation:GpsPageNavigation = new GpsPageNavigation();
  pageController:GpsCRUDListModel<#[app.component,PascalCase]#> = new GpsCRUDListModel<#[app.component,PascalCase]#>();
  pageFilter:GpsPageFilter<I#[app.component,PascalCase]#Filter> = new GpsPageFilter<I#[app.component,PascalCase]#Filter>();
  exportColumns: IExportColumn[];

  //#region Enumeradores
@[app.enums]@
  #[component,camelCase]#Options = [...#[component,PascalCase]#Enum.#[component,PascalCase]#];
@[end]@
  //#endregion

  constructor(
@[app.zooms]@
    public #[component,camelCase]#Zoom: #[component,PascalCase]#Zoom,
@[end]@
    private service:#[app.component,PascalCase]#Service,
    private router:Router,
    private dialogService:PoDialogService,
    private notificationService:PoNotificationService,
    private paramService:ParamService
  ) {
    this.pageNavigation.setRouter(router);
  }

  ngOnInit(){
    this.initializePageController();
    this.setListColumns();
    this.setDisclaimerConfig();
    this.initEnums();
    this.setActions();
    this.reloadFilter();
  }

  reloadFilter() {
    const filter = this.paramService.popParameter(this.filterCacheId);
    if(filter) {
      this.pageFilter = filter;
      this.resetSearch();
    }
  }

  get filter():any{
    return this.pageFilter.filter;
  }

  private initEnums() {
@[app.fields,!enumComponent=]@
    this.#[enum.component,camelCase]#Options = [
      { value: ?[jsType=string]?''?[end]??[jsType=number]?0?[end]??[jsType=boolean]?null?[end]?, label: 'Todos' },
      ...#[enum.component,PascalCase]#Enum.#[enum.component,PascalCase]#
    ];
@[end]@
  }

  private setActions() {
    this.pageController.actions = [
      { label:'Adicionar',  action: this.onNew.bind(this) },
      { label:'Exportar',  action: this.onExport.bind(this) }
    ];
  }

  setListColumns(){
    this.pageController.listColumns = [
@[app.fields,isListed]@
      { property: '?[!zoomComponent=]?$?[end]??[!enumComponent=]?$?[end]?#[name]#?[!zoomComponent=]?Description?[end]??[!enumComponent=]?Description?[end]?', label: '#[description]#' ?[ablType=logical&enumComponent=]?, type: 'boolean'?[end]??[ablType=date&enumComponent=]?, type: 'date'?[end]??[isLink]?, type: 'link', action: (value, row) => { this.onDetail(row); }?[end]?},
@[end]@
      { property: '$actions', label: 'Ações', type: 'icon', width: '3.5em', icons:
        [
          { value: 'edit', icon: 'po-icon-edit', tooltip: 'Editar', action: this.onEdit.bind(this) },
          { value: 'remove', icon: 'po-icon-delete', tooltip: 'Remover', color: 'color-07', action: this.onRemove.bind(this) }
        ]
      }
    ];

    this.exportColumns = [
@[app.fields,isVisible]@
      { property: '?[!zoomComponent=]?$?[end]??[!enumComponent=]?$?[end]?#[name]#?[!zoomComponent=]?Description?[end]??[!enumComponent=]?Description?[end]?', label: '#[description]#'?[ablType=date]?, transform: (value) => { return (value ? new Date(value).toLocaleDateString() : '') }?[end]??[ablType=logical]?, transform: (value) => { return (value == 'true' ? 'Sim' : 'Não') }?[end]? },
@[end]@
    ];
  }

  initializePageController(){
    this.pageController.title = '#[app.description,PascalCase]#';
    this.pageController.advancedFilterTitle = 'Filtrar busca';
  }

  setDisclaimerConfig(){
    let disclaimerConfig:IDisclaimerConfig[] = [
      { label: 'Pesquisa por', property: 'q' },
@[app.fields,isFilter]@
?[isRangeFilter&ablType=date]?      { label: '#[description]#', property: '#[name]#Initial', type: 'date', group: '#[name]#', value: (v) => { return `de ${v}` } },
      { label: '#[description]#', property: '#[name]#Final', type: 'date', group: '#[name]#', separator: ' ', value: (v) => { return `até ${v}` } },
?[end]??[isRangeFilter&!ablType=date]?      { label: '#[description]#', property: '#[name]#Initial', group: '#[name]#', value: (v) => { return `de ${v}` } },
      { label: '#[description]#', property: '#[name]#Final', group: '#[name]#', separator: ' ', value: (v) => { return `até ${v}` } },
?[end]??[!isRangeFilter&ablType=date]?      { label: '#[description]#', property: '#[name]#', type: 'date' },
?[end]??[!isRangeFilter&!ablType=date&enumComponent=]?      { label: '#[description]#', property: '#[name]#' },
?[end]??[end]??[!isRangeFilter&!ablType=date&!enumComponent=]?      { label: '#[description]#', property: '#[name]#', value: this.get#[enum.component,PascalCase]#Description },
?[end]?@[end]@    ];
    this.pageFilter.disclaimerConfig = disclaimerConfig;
  }

  //#region Pesquisa
  resetSearch() {
    if (this.pageFilter.filter.q)
      return this.applySimpleFilter(this.pageFilter.filter.q);

    this.applyAdvancedFilter(this.pageFilter.filter);
  }

  applySimpleFilter(text) {
    this.pageFilter.setFilterText(text);
    this.resetPage();
    this.search();
  }

  applyAdvancedFilter(filter?) {
    this.pageFilter.filter.q = null;
    this.resetPage();
    this.search();
  }

  private search() {
    this.gpsPageList.showLoading('Pesquisando...');
    this.paramService.pushParameter(this.filterCacheId,this.pageFilter);
    this.service.getByFilter(this.pageFilter)
      .then(result => this.resultSearch(result))
      .finally(() => this.gpsPageList.hideLoading());
  }

  resultSearch(result){
    this.pageFilter.resumeSearch(result);
    this.setItensTable(result.items);
  }

  resetPage(){
    this.pageController.listItems = [];
    this.pageFilter.resetPage();
  }

  setItensTable(itens: Object[]){
    itens.forEach((value) => {
        let _obj:#[app.component,PascalCase]# = new #[app.component,PascalCase]#();
        Object.assign(_obj,value);
        _obj = this.extend#[app.component,PascalCase]#(_obj);
        this.pageController.listItems.push(_obj);
    });
  }
  //#endregion

  //#region Eventos
  onListShowMore() {
    this.pageFilter.nextPage();
    this.search();
  }

  onEdit(item:#[app.component,PascalCase]#) {
    this.pageNavigation.editRegisterPage(item);
  }

  onRemove(item:#[app.component,PascalCase]#) {
    this.dialogService.confirm({
      title: 'Remover',
      message: 'Deseja confirmar a remoção deste registro?',
      confirm: () => {
        this.gpsPageList.showLoading('Removendo...');
        this.service.removeByObject(item)
          .then(result => {
            this.gpsPageList.hideLoading();
            this.notificationService.success('Registro removido com sucesso!');
            this.resetSearch();
          })
          .catch(() => this.gpsPageList.hideLoading());
      }
    });
  }

  onNew() {
    this.pageNavigation.newRegisterPage();
  }

  onDetail(item:#[app.component,PascalCase]#) {
    if(item)
      this.pageNavigation.detailRegisterPage(item);
  }

  onExport() {
    this.exportComponent.export(true);
  }
  //#endregion

  //#region Metodos de montagem dos dados
  private extend#[app.component,PascalCase]#(item:#[app.component,PascalCase]#): #[app.component,PascalCase]#Extended {
    let result = new #[app.component,PascalCase]#Extended().parseJsonToObject(item);
    @[app.fields,!enumComponent=]@
    result.$#[name]#Description = #[enumComponent,PascalCase]#Enum.getDescription(result.#[name]#);

@[end]@
@[app.fields,!zoomComponent=]@
    this.extend#[zoom.component,PascalCase]#(result.#[name]#).then((value:#[zoom.component,PascalCase]#) => {
      let model = new #[zoom.component,PascalCase]#();
      value instanceof #[zoom.component,PascalCase]#
        ? model = model.parseJsonToObject(value)
        : model = model.parseJsonToObject({#[zoom.keyField]#: result.#[name]#, #[zoom.labelField]#:'Não encontrado'});

      result.parseJsonToObject(model);
    });

@[end]@
    result.$actions = ['edit','remove'];
    return result;
  }

@[app.zooms]@
  private extend#[component,PascalCase]#(value) {
    let model = new #[component,PascalCase]#().parseJsonToObject({#[keyField]#: value});
    return this.#[component,camelCase]#Zoom.zoomById(model);
  }

@[end]@
  //#endregion

}
