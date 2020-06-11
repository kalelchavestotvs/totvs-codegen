import { Component, ViewChild } from '@angular/core';
import { PoTableColumn, PoTableComponent, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.css']
})
export class ListSelectorComponent {

  @ViewChild('listTable', {static:false}) listTable: PoTableComponent;
  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  title:string;
  listColumns:PoTableColumn[] = [];
  listItems:any[] = [];

  constructor (
    private notificationService: PoNotificationService
  ) {}

  select<T>(list:T[],labelColumn:string,title?:string): Promise<T> {
    this.listItems = list.map(item => <any>{ label: item[labelColumn], value: item });
    this.title = title || 'Selecione';

    let _modal = this.modal;
    let _getValue = this.getValue.bind(this);
    let _validateSelection = this.validateSelection.bind(this);
    let _clear = this.clear.bind(this);

    return new Promise(resolve => {
      
      _modal.primaryAction = {
        label: 'Selecionar',
        action: () => { 
          if (_validateSelection()) {
            _modal.close();
            resolve(_getValue());
            _clear();
          }
        }
      }

      _modal.secondaryAction = {
        label: 'Cancelar',
        action: () => { 
          _modal.close();
          resolve(null);
          _clear();
        }
      }

      _modal.open();
    });
  }

  private getValue() {
    let s = this.listTable.getSelectedRows();
    if (s?.length == 1) {
      return s[0].value;
    }
    return null;
  }

  private validateSelection() {
    if (this.getValue())
      return true;
    this.notificationService.warning('Selecione um item');
    return false;
  }

  private clear() {
    this.listItems = [];
  }

}
