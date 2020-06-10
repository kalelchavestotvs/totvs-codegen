import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { PoLookupColumn } from '@portinari/portinari-ui';
import { TotvsGpsServices, TTalkCollection } from 'totvs-gps-services';
import { #[zoom.component,PascalCase]# } from '../models/#[zoom.component]#';

@Injectable()
export class #[zoom.component,PascalCase]#Zoom {

    constructor() {
        this.createColumns();
    }

    //#region Service
    private readonly url = '#[zoom.module]#/#[zoom.version]#/#[zoom.component,camelCase,Plural]#';
    private readonly urlKeys = this.url + '/{{#[zoom.keyField]#}}';

    zoomByFilter(searchObject?:any,pageNumber?:number,pageSize?:number): Promise<TTalkCollection<#[zoom.component,PascalCase]#>> {
        return TotvsGpsServices
            .getInstance<#[zoom.component,PascalCase]#>(#[zoom.component,PascalCase]#, this.url)
            .setQueryParams(searchObject)
            .setPage(pageNumber)
            .setPageSize(pageSize)
            .getCollection();
    }

    zoomById(#[zoom.component,camelCase]#:#[zoom.component,PascalCase]#): Promise<#[zoom.component,PascalCase]#> {
        return TotvsGpsServices
            .getInstance<#[zoom.component,PascalCase]#>(#[zoom.component,PascalCase]#, this.urlKeys)
            .setPathParams(#[zoom.component,camelCase]#)
            .get();
    }
    //#endregion

    //#region Zoom definition
    private readonly columnNames = [
@[zoom.fields]@
        '#[name]#',
@[end]@
    ];
    private readonly columnDefinition = {
@[zoom.fields]@
        '#[name]#': <PoLookupColumn>{ property: '#[name]#', label: '#[description]#' },
@[end]@
    };

    COLUMNS: PoLookupColumn[];
    readonly FIELD_LABEL = '#[zoom.labelField]#';
    readonly FIELD_VALUE = '#[zoom.keyField]#';

    private createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    fieldFormat(value) {
        if (value) {
            let _cod = value.#[zoom.keyField]#;
            let _des = value.#[zoom.labelField]#;
            if (_cod != undefined)
                return `${_cod} - ${_des}`;
        }
        return '';
    }

    getFilteredData(filter:string,page:number,pageSize:number): Observable<TTalkCollection<#[zoom.component,PascalCase]#>> {
        let result = this.zoomByFilter({q:filter}, page, pageSize);
        return from(result);
    }

    getObjectByValue(value: string): Observable<any> {
        let #[zoom.component,camelCase]#: #[zoom.component,PascalCase]# = new #[zoom.component,PascalCase]#();
        #[zoom.component,camelCase]#.#[zoom.keyField]# = ?[zoom.isNumeric]?Number.parseInt(?[end]?value?[zoom.isNumeric]?)?[end]?;
        return from(this.zoomById(#[zoom.component,camelCase]#));
    }
    //#endregion

}
