import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { PoDialogService, PoNotificationService, PoPageAction, PoTableColumn, PoTableAction, PoSelectOption } from '@po-ui/ng-components';
import { GpsPageListComponent, IDisclaimerConfig } from 'totvs-gps-controls';
import { GpsPageFilter, GpsPageNavigation, GpsCRUDListModel } from 'totvs-gps-crud';
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

  pageNavigation:GpsPageNavigation = new GpsPageNavigation();
  pageController:GpsCRUDListModel<#[app.component,PascalCase]#> = new GpsCRUDListModel<#[app.component,PascalCase]#>();
  pageFilter:GpsPageFilter<I#[app.component,PascalCase]#Filter> = new GpsPageFilter<I#[app.component,PascalCase]#Filter>();

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
    private notificationService:PoNotificationService
  ) {
    this.pageNavigation.setRouter(router);
  }

  ngOnInit(){
    this.initializePageController();
    this.setListColumns();
    this.setDisclaimerConfig();
    this.initEnums();
    this.setActions();
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
      { label:'Adicionar',  action: this.onNew.bind(this) }
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
  }

  initializePageController(){
    this.pageController.title = "#[app.description]#";
    this.pageController.advancedFilterTitle = "Filtrar busca";
    this.pageController.tableMessage = 'Utilize os campos de filtro para pesquisar';
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
    if (!isNullOrUndefined(this.pageFilter.filter.q))
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
    this.service.getByFilter(this.pageFilter)
      .then(result => { 
        this.gpsPageList.hideLoading();
        this.resultSearch(result);
      })
      .catch(() => this.gpsPageList.hideLoading());
  }

  resultSearch(result){
    this.pageFilter.resumeSearch(result);
    this.setItensTable(result.items);
    this.pageController.tableMessage = undefined; // volta a mensagem padrão da table
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
  //#endregion

  //#region Metodos de montagem dos dados
  private extend#[app.component,PascalCase]#(item:#[app.component,PascalCase]#): #[app.component,PascalCase]#Extended {
    let result = new #[app.component,PascalCase]#Extended().parseJsonToObject(item);
@[app.fields,!enumComponent=]@
    result.$#[name]#Description = #[enumComponent,PascalCase]#Enum.getDescription(result.#[name]#);
@[end]@
@[app.fields,!zoomComponent=]@
    this.extend#[zoom.component,PascalCase]#(result.#[name]#).then(value => { result.$#[name]# = value });
@[end]@
    result.$actions = ['edit','remove'];
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
