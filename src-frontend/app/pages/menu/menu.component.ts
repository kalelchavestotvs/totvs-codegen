import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { PoPageAction, PoTableColumn, PoTableComponent, PoPageFilter } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { ApplicationIndex, Application } from '../../models/application';
import { DataService } from '../../services/data.service';
import { ApplicationIndexList } from '../../models/model';
import { GenerateComponent } from '../generate/generate.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements AfterViewInit {

  @ViewChild('appTable', {static:false}) appTable: PoTableComponent;
  @ViewChild('generateComponent', {static:false}) generateComponent: GenerateComponent;
  @ViewChild(LoadingComponent, {static:false}) loadingComponent: LoadingComponent;

  //#region inicializacao
  constructor(
    private dataService: DataService,
    private requestService: RequestService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.init();
  }
  //#endregion

  //#region propriedades
  applicationList: ApplicationIndexList[] = [];
  filterModel;
  //#endregion

  //#region propriedades de tela
  pageActions: PoPageAction[] = [
    { label: 'Executar', action: this.onActionBuild.bind(this), disabled: this.isActionBuildDisabled.bind(this) },
    { label: 'Adicionar', action: this.onAddClick.bind(this) },
  ];
  pageFilter: PoPageFilter = {
    ngModel: 'filterModel',
    action: this.searchApp.bind(this),
    placeholder: 'App/tabela/componente'
  };
  applicationListColumns: PoTableColumn[] = [
    { property: 'name', label: 'Aplicação', width: '20%' },
    { property: 'component', label: 'Componente', width: '20%' },
    { property: 'table', label: 'Tabela', width: '20%' },
    { property: 'description', label: 'Descrição' },
    { property: '$actions', label: 'Ação', width: '7em', type: 'icon', icons: 
      [
        { value: 'edit', color: 'color-01', icon: 'po-icon-edit', action: (item) => { this.onEditAppClick(item) } },
        { value: 'delete', color: 'color-07', icon: 'po-icon-delete', action: (item) => { this.onDeleteAppClick(item) } }
      ]
    }
  ];
  //#endregion

  //#region eventos de tela
  onAddClick() {
    this.router.navigate(['application']);
  }

  onEditAppClick(app:ApplicationIndex) {
    this.router.navigate(['application',app.name]);
  }

  onDeleteAppClick(app:ApplicationIndex) {
    this.requestService.deleteApplication(app);
    this.searchApp();
  }
  //#endregion

  //#region metodos internos
  private init() {
    this.initData();
    this.changeDetectorRef.detectChanges();
  }

  private initData() {
    this.applicationList = [...this.dataService.applications.map(item => this.mapApplicationIndex(item)).map(item => this.mapApplicationIndexList(item))];
  }

  private onActionBuild() {
    let appIndex = this.applicationList.find(item => item['$selected']);
    let app = this.dataService.applications.find(item => item.name == appIndex.name);
    this.generateComponent.execute(app);
  }

  private isActionBuildDisabled() {
    return !(this.applicationList.find(item => item['$selected']));
  }

  private mapApplicationIndex(app:Application): ApplicationIndex {
    return new ApplicationIndex().parseJsonToObject(app);
  }

  private mapApplicationIndexList(app:ApplicationIndex): ApplicationIndexList {
    return new ApplicationIndexList().parseJsonToObject(app);
  }

  private searchApp() {
    this.loadingComponent.show('Pesquisando...');
    this.requestService.searchApplication({q:this.filterModel})
      .then(value => {
        this.dataService.applications = value;
        this.initData();
      })
      .finally(() => this.loadingComponent.hide())
  }
  //#endregion
 
}
