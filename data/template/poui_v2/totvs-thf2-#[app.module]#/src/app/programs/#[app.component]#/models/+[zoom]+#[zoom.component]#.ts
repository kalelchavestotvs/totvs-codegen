import { TotvsGpsJsonUtils } from "totvs-gps-utils";

export class #[zoom.component,PascalCase]# {

  get ENTITY() { return '#[zoom.component,PascalCase]#' };
  get primaryKeys() { return [@[zoom.fields,isPrimary]@?[!isFirst]?,?[end]?'#[name]#'@[end]@] };

@[zoom.fields]@
  #[name]#:#[jsType]#;
@[end]@

  parseJsonToObject(jsonData): #[zoom.component,PascalCase]# {
    TotvsGpsJsonUtils.getInstance().assign(this,jsonData);
    return this;
  }

}
