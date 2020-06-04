/*
 *  Models utilizados somente para montagem mais dinamicas das telas 
 */

import { ApplicationField, ApplicationIndex, ApplicationEnum, ApplicationZoom } from './application';
import { PoComboOption } from '@po-ui/ng-components';

export class AvailableField {
  name:string;
  // $actions = ['add'];
}

export class InsertedField {
  field:string;
  name:string;
  description:string;
  // $actions = ['edit','delete'];
  $field: ApplicationField;
}

export class ApplicationIndexList extends ApplicationIndex {
  $actions = ['edit'];

  parseJsonToObject(data:any): ApplicationIndexList {
    super.parseJsonToObject(data);
    return this;
  }
}

export interface IApplicationRelation {
  type: 'enum' | 'zoom';
  name:string;
  data: ApplicationEnum | ApplicationZoom;
}

export interface IPoComboOptionData extends PoComboOption {
  $data:any;
}