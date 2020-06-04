import { Component, ViewChild } from '@angular/core';
import { PoModalComponent, PoRadioGroupOption } from '@po-ui/ng-components';
import { ApplicationEnum, ApplicationZoom } from '../../models/application';
import { EnumEditComponent } from '../enum-edit/enum-edit.component';
import { ZoomEditComponent } from '../zoom-edit/zoom-edit.component';

@Component({
  selector: 'relation-add',
  templateUrl: './relation-add.component.html',
  styleUrls: ['./relation-add.component.css']
})
export class RelationAddComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;
  @ViewChild('enumEditComponent', {static:false}) enumEditComponent: EnumEditComponent;
  @ViewChild('zoomEditComponent', {static:false}) zoomEditComponent: ZoomEditComponent;

  relationType;
  relationOptions: PoRadioGroupOption[] = [
    { value: 'enum', label: 'Enumerador' },
    { value: 'zoom', label: 'Zoom' }
  ];


  add(): Promise<ApplicationEnum | ApplicationZoom> {
    this.relationType = 'enum';

    let _modal = this.modal;
    let _getRelationType = this.getRelationType.bind(this);
    let _enumComponent = this.enumEditComponent;
    let _zoomComponent = this.zoomEditComponent;

    return new Promise(resolve => {
      
      _modal.primaryAction = {
        label: 'Adicionar',
        action: () => { 
          _modal.close();
          if (_getRelationType() == 'enum') {
            _enumComponent.edit().then(value => resolve(value))
          }
          else {
            _zoomComponent.edit().then(value => resolve(value))
          }
        }
      }

      _modal.secondaryAction = {
        label: 'Cancelar',
        action: () => { 
          _modal.close();
          resolve(null);
        }
      }

      _modal.open();
    });
  }

  edit(item: ApplicationEnum | ApplicationZoom): Promise<ApplicationEnum | ApplicationZoom> {
    if (item instanceof ApplicationEnum)
      return this.enumEditComponent.edit(item)
    else if (item instanceof ApplicationZoom)
      return this.zoomEditComponent.edit(item)
    else
      return Promise.resolve(null)
  }

  private getRelationType() {
    return this.relationType;
  }

}
