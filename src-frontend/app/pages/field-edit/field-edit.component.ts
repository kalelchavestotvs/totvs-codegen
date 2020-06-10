import { Component, ViewChild } from '@angular/core';
import { PoModalComponent, PoCheckboxGroupOption } from '@po-ui/ng-components';
import { ApplicationField, ApplicationEnum, ApplicationZoom } from '../../models/application';
import { IPoComboOptionData } from '../../models/model';

@Component({
  selector: 'field-edit',
  templateUrl: './field-edit.component.html',
  styleUrls: ['./field-edit.component.css']
})
export class FieldEditComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  value: ApplicationField;
  title = '';
  selectedOptions = [];
  valueOptions: PoCheckboxGroupOption[] = [
    { value: 'isPrimary', label: 'Chave Primária' },
    { value: 'isMandatory', label: 'Obrigatório' },
    { value: 'isEditable', label: 'Editável' },
    { value: 'isAuto', label: 'Auto-incremento' },
    { value: 'isVisible', label: 'Visível' },
    { value: 'isListed', label: 'Listado em grid' },
    { value: 'isLink', label: 'Link' },
    { value: 'isFilter', label: 'Filtro' },
    { value: 'isRangeFilter', label: 'Filtro por faixa' }
  ];
  relation:string;
  relations:Array<ApplicationEnum | ApplicationZoom> = [];
  relationOptions: IPoComboOptionData[] = [];

  edit(field:ApplicationField,relations?:Array<ApplicationEnum | ApplicationZoom>): Promise<ApplicationField> {
    this.value = new ApplicationField().parseJsonToObject(field);
    this.relations = relations;
    this.prepareToLoad();
    this.title = this.value.field;

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
          resolve();
          _clear();
        }
      }

      _modal.open();
    });
  }

  private clear() {
    this.value = null;
  }

  private prepareToSave() {
    this.valueOptions.forEach(item => {
      this.value[item.value] = this.selectedOptions.includes(item.value);
    });
    this.value.enumComponent = null;
    this.value.zoomComponent = null;
    if (this.relation && this.relationOptions) {
      let _r = this.relationOptions.find(item => item.value == this.relation);
      if (_r.$data instanceof ApplicationEnum)
        this.value.enumComponent = _r.$data.component;
      else if (_r.$data instanceof ApplicationZoom)
        this.value.zoomComponent = _r.$data.application;
    }
  }

  private prepareToLoad() {
    this.selectedOptions = [];
    this.valueOptions.forEach(item => {
      if (!!this.value[item.value]) 
        this.selectedOptions.push(item.value);
    });

    this.relation = null;
    if (this.relations?.length>0) {
      this.relationOptions = this.relations.map(item => {
        if (item instanceof ApplicationEnum) {
          if (this.value.enumComponent == item.component)
            this.relation = `enum,${item.component}`;
          return <IPoComboOptionData>{ value: `enum,${item.component}`, label: `${item.component} (enum) - ${item.description}`, $data: item }
        }
        else if (item instanceof ApplicationZoom) {
          if (this.value.zoomComponent == item.application)
            this.relation = `zoom,${item.application}`;
          return <IPoComboOptionData>{ value: `zoom,${item.application}`, label: `${item.application} (zoom)`, $data: item }
        }
      }).sort((v1,v2) => { return v1.label.localeCompare(v2.label) });
    }
    else {
      this.relationOptions = null;
    }
  }

}
