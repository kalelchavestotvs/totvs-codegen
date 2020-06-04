import { Injectable } from '@angular/core';
import { IFieldProperties } from '../models/application';

@Injectable()
export class TypeTranslateService {

  abl2js(ablType:string): string {
    if (ablType.startsWith('int'))
      return 'number';
    if (ablType.includes('char'))
      return 'string';
    if (ablType.startsWith('log'))
      return 'boolean';
    if (ablType.startsWith('date'))
      return 'Date';
    if (ablType.startsWith('dec'))
      return 'number';
    return ablType;
  }

  fieldDefaults(fieldName:string): IFieldProperties {
    if (fieldName.match(/(dt|dat){1}\-[\w\d\-]*(atualiz){1}/gi))
      return { name: 'updateDate', description: 'Atualização', ablFixedValue: 'today', isEditable: false };
    if (fieldName.match(/(hr|hra){1}\-[\w\d\-]*(atualiz){1}/gi))
      return { name: 'updateHour', description: 'Hora de Atualização', ablFixedValue: 'string(time,~"HH:MM:SS~")', isEditable: false, isListed: false, isVisible: false };
    if (fieldName.match(/(cd|cod){1}\-[\w\d\-]*(atualiz|userid){1}/gi))
      return { name: 'updateUser', description: 'Usuário', ablFixedValue: 'v_cod_usuar_corren', isEditable: false, isListed: false };
    return {};
  }

  validateComponentName(name:string): string {
    return name.toLowerCase().split(/[^a-z0-9]/g).filter(word => word.length>0).join('-');
  }

}
