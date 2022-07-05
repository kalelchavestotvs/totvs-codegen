import { TotvsGpsJsonUtils } from "totvs-gps-utils";
?[app.useCacheService]?import { ICacheModel, ICacheFields } from 'totvs-gps-services';?[end]?

export class #[zoom.component,PascalCase]# ?[app.useCacheService]?implements ICacheModel?[end]?{

  get ENTITY() { return '#[zoom.component,PascalCase]#' };
  get primaryKeys() { return [@[zoom.fields,isPrimary]@?[!isFirst]?,?[end]?'#[name]#'@[end]@] };
?[app.useCacheService]?  get cacheFields(): ICacheFields {return {code: '#[zoom.keyField]#', description: '#[zoom.labelField]#'}};?[end]?

@[zoom.fields]@
  #[name]#:#[jsType]#;
@[end]@

  parseJsonToObject(jsonData): #[zoom.component,PascalCase]# {
    TotvsGpsJsonUtils.getInstance().assign(this,jsonData);
    return this;
  }

}
