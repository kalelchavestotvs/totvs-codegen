import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoTableColumn } from '@po-ui/ng-components';
import { ApplicationEnum, ApplicationEnumValue } from '../../models/application';
import { TypeTranslateService } from '../../services/type-translate.service';

@Component({
  selector: 'enum-edit',
  templateUrl: './enum-edit.component.html',
  styleUrls: ['./enum-edit.component.css']
})
export class EnumEditComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  value: ApplicationEnum;
  selected: ApplicationEnumValue;

  tableColumns: PoTableColumn[] = [
    { property: 'value', label: 'Valor', width: '30%' },
    { property: 'label', label: 'Descriçao', width: '70%' },
  ];

  constructor(
    private typeTranslateService: TypeTranslateService
  ) { }


  edit(value?): Promise<ApplicationEnum> {
    this.selected = new ApplicationEnumValue();
    this.value = new ApplicationEnum().parseJsonToObject(value);
    if (!this.value.values)
      this.value.values = [];

    let _modal = this.modal;
    let _value = this.value;
    let _clear = this.clear.bind(this);
    let _prepareToSave = this.prepareToSave.bind(this);

    return new Promise(resolve => {
      
      _modal.primaryAction = {
        label: 'Salvar',
        action: () => { 
          _prepareToSave();
          _modal.close();
          resolve(_value);
          _clear();
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

  onAddClick() {
    this.value.values.push(this.selected);
    this.selected = new ApplicationEnumValue();
  }

  onComponentChange() {
    let validName = this.typeTranslateService.validateComponentName(this.value.component);
    if (validName != this.value.component) {
      this.value.component = validName;
    }
  }


  private clear() {
    this.value = null;
  }

  private prepareToSave() {
    let _numeric = true;
    this.value.values.forEach(item => {
      if ((item.value)&&(isNaN(Number(item.value))))
        _numeric = false;
    });
    this.value.isNumeric = _numeric;
  }

}
