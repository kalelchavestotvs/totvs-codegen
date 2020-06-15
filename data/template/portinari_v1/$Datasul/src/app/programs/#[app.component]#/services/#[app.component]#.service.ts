import { Injectable } from '@angular/core';
import { TotvsGpsServices, TTalkCollection } from 'totvs-gps-services';
import { #[app.component,PascalCase]#, I#[app.component,PascalCase]#Filter } from '../models/#[app.component]#';
import { GpsPageFilter} from 'totvs-gps-crud';
import { GpsMaintenanceUrl } from 'totvs-gps-utils';

@Injectable()
export class #[app.component,PascalCase]#Service {

  private readonly url = '#[app.module]#/#[app.version]#/#[app.component,camelCase,Plural]#';
  private readonly urlKeys = `${this.url}@[app.fields,isPrimary]@/{{#[name]#}}@[end]@`;

  getByFilter(pageFilter?:GpsPageFilter<any>,expand?:string[],fields?:string[]): Promise<TTalkCollection<#[app.component,PascalCase]#>> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#, this.url)
      .setPage(pageFilter.listPage)
      .setPageSize(pageFilter.listSize)
      .setFields(fields || pageFilter.fields)
      .setExpand(expand || pageFilter.expand)
      .setQueryParams(pageFilter.filter)
      .getCollection();
  }

  get(@[app.fields,isPrimary]@#[name]#,@[end]@expand?:string[],fields?:string[]): Promise<#[app.component,PascalCase]#> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#, this.urlKeys)
      .setPathParams({@[app.fields,isPrimary]@#[name]#:#[name]#?[!isLast]?, ?[end]?@[end]@})
      .setFields(fields).setExpand(expand)
      .get();
  }

  remove(@[app.fields,isPrimary]@#[name]#?[!isLast]?,?[end]?@[end]@): Promise<any> {
    return TotvsGpsServices
      .getInstance(#[app.component,PascalCase]#, this.urlKeys)
      .setPathParams({@[app.fields,isPrimary]@#[name]#:#[name]#?[!isLast]?, ?[end]?@[end]@})
      .delete();
  }

  insert(#[app.component,camelCase]#: #[app.component,PascalCase]#): Promise<#[app.component,PascalCase]#> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#)
      .post(#[app.component,camelCase]#, this.url);
  }

  update(#[app.component,camelCase]#: #[app.component,PascalCase]#): Promise<#[app.component,PascalCase]#> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#)
      .setPathParams(#[app.component,camelCase]#)
      .put(#[app.component,camelCase]#, this.urlKeys);
  }

  getByObject(#[app.component,camelCase]#:#[app.component,PascalCase]#,expand?:string[],fields?:string[]): Promise<#[app.component,PascalCase]#> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#,GpsMaintenanceUrl.getUrl(#[app.component,camelCase]#,this.url))
      .setPathParams(GpsMaintenanceUrl.getPathParamsObject(#[app.component,camelCase]#))
      .setFields(fields).setExpand(expand)
      .get();
  }

  removeByObject(#[app.component,camelCase]#:#[app.component,PascalCase]#): Promise<any> {
    return TotvsGpsServices
      .getInstance<#[app.component,PascalCase]#>(#[app.component,PascalCase]#,GpsMaintenanceUrl.getUrl(#[app.component,camelCase]#,this.url))
      .setPathParams(GpsMaintenanceUrl.getPathParamsObject(#[app.component,camelCase]#))
      .delete();
  }
}
