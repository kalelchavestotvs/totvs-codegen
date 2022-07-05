import { TotvsGpsJsonUtils } from "totvs-gps-utils";

export class #[app.component,PascalCase]# {

  get ENTITY() { return '#[app.component,PascalCase]#' };
  get primaryKeys() { return [@[app.fields,isPrimary]@?[!isFirst]?,?[end]?'#[name]#'@[end]@] };

@[app.fields]@
  #[name]#:#[jsType]#?[jsType=number&hasZeroAll=true]? | string?[end]??[jsType=Date]? = null?[end]?;
@[end]@

  parseJsonToObject(jsonData): #[app.component,PascalCase]# {
    TotvsGpsJsonUtils.getInstance().assign(this, jsonData);
    return this;
  }
}

export interface I#[app.component,PascalCase]#Filter {
  q?:string;
@[app.fields,isFilter]@?[isRangeFilter]?
  #[name]#Initial?:#[jsType]#;
  #[name]#Final?:#[jsType]#;?[end]??[!isRangeFilter]?
  #[name]#?:#[jsType]#;?[end]?
@[end]@
}
