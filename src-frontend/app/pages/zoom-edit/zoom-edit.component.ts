import { Component, ViewChild } from '@angular/core';
import { PoModalComponent,  PoComboOption, PoTableColumn } from '@po-ui/ng-components';
import { ApplicationZoom, ApplicationField } from '../../models/application';
import { TypeTranslateService } from '../../services/type-translate.service';
import { RequestService } from '../../services/request.service';
import { ZoomEditService } from './zoom-edit.service';

@Component({
  selector: 'zoom-edit',
  templateUrl: './zoom-edit.component.html',
  styleUrls: ['./zoom-edit.component.css'],
  providers: [ZoomEditService]
})
export class ZoomEditComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  lastApplication:string = '';
  value: ApplicationZoom;
  fieldOptions: PoComboOption[];
  fields:ApplicationField[];
  tableColumns:PoTableColumn[] = [
    { property: 'field', label: 'Campo' },
    { property: 'name', label: 'Nome' }
  ];

  constructor(
    public zoomEditService: ZoomEditService,
    private requestService: RequestService
  ) { }


  edit(value?:ApplicationZoom): Promise<ApplicationZoom> {
    this.value = new ApplicationZoom().parseJsonToObject(value);
    if (!this.value.fields)
      this.value.fields = [];
    this.prepareToLoad();

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

  onSelectApplication(): Promise<any> {
    if (this.value.application) {
      if (this.value.application != this.lastApplication) {
        this.lastApplication = this.value.application;
        return this.requestService.getApplication(this.value.application).then(v => {
          this.fields = v.fields;
          this.fieldOptions = v.fields?.map(item => { return <PoComboOption>{ value: item.name, label: `${item.name} (${item.field})` } });
        });
      }
      else
        return Promise.resolve();
    }
    else {
      this.lastApplication = '';
      this.fields = null;
      this.fieldOptions = null;
      this.value.keyField = null;
      this.value.labelField = null;
      return Promise.resolve();
    }
  }

  private clear() {
    this.lastApplication = '';
    this.value = null;
    this.fields = null;
    this.fieldOptions = null;
  }

  private prepareToLoad() {
    this.onSelectApplication().then(() => {
      this.value.fields.forEach(item => {
        let field = this.fields?.find(f => f.name == item);
        if (field)
          field['$selected'] = true;
      });
    });
  }

  private prepareToSave() {
    this.value.fields = this.fields?.filter(item => item['$selected']).map(item => item.name);

    let kf = this.fields.find(item => item.name == this.value.keyField);
    this.value.isNumeric = (kf?.jsType == 'number');
  }

}
