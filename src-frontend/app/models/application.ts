export class ApplicationIndex {
  name:string;
  table:string;
  component:string;
  description:string;

  parseJsonToObject(data:any): ApplicationIndex {
    Object.assign(this, data);
    return this;
  }
}

export class Application extends ApplicationIndex {
  module:string;
  version:string;
  team:string;
  useCacheService:boolean = false;

  fields:ApplicationField[];
  enums:ApplicationEnum[];
  zooms:ApplicationZoom[];

  parseJsonToObject(data:any): Application {
    super.parseJsonToObject(data);
    this.fields = data.fields?.map(item => new ApplicationField().parseJsonToObject(item));
    this.enums = data.enums?.map(item => new ApplicationEnum().parseJsonToObject(item));
    this.zooms = data.zooms?.map(item => new ApplicationZoom().parseJsonToObject(item));
    return this;
  }
}


export interface IFieldProperties {
  sequence?:number;
  field?:string;
  name?:string;
  description?:string;
  ablType?:string;
  ablFixedValue?:string;
  jsType?:string;
  jsInitValue?:string;
  inputFormat?:string;
  maxSize?:number;
  enumComponent?:string;
  zoomComponent?:string;
  isPrimary?:boolean;
  isMandatory?:boolean;
  isVisible?:boolean;
  isEditable?:boolean;
  isAuto?:boolean;
  isListed?:boolean;
  isLink?:boolean;
  isFilter?:boolean;
  isRangeFilter?:boolean;
  hasZeroAll?:boolean;
}

export class ApplicationField implements IFieldProperties {
  sequence:number;
  field:string;
  name:string;
  description:string;
  ablType:string;
  ablFixedValue:string;
  jsType:string;
  jsInitValue:string;
  inputFormat:string;
  maxSize:number;

  enumComponent:string;
  zoomComponent:string;

  isPrimary:boolean;
  isMandatory:boolean;
  isVisible:boolean;
  isEditable:boolean;
  isAuto:boolean;
  isListed:boolean;
  isLink:boolean;
  isFilter:boolean;
  isRangeFilter:boolean;
  hasZeroAll:boolean;

  parseJsonToObject(data:any): ApplicationField {
    Object.assign(this, data);
    return this;
  }
}

export class ApplicationEnum {
  component:string;
  description:string;
  values:ApplicationEnumValue[];
  isNumeric: boolean;

  parseJsonToObject(data:any): ApplicationEnum {
    Object.assign(this, data);
    return this;
  }
}

export class ApplicationEnumValue {
  value:string;
  label:string;
}

export class ApplicationZoom {
  application:string;
  fields:string[];
  labelField:string;
  keyField:string;
  isNumeric:boolean;
  hasZeroAll?:boolean;

  parseJsonToObject(data:any): ApplicationZoom {
    Object.assign(this, data);
    return this;
  }
}

