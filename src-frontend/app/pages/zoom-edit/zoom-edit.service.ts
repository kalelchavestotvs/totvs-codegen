import { PoLookupColumn, PoLookupFilter } from '@po-ui/ng-components';
import { from, Observable } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ZoomEditService implements PoLookupFilter {

    private readonly columnNames = ['name','table'];
    private readonly columnDefinition = {
        'name': <PoLookupColumn>{ property: 'name', label: 'Aplicação' },
        'table': <PoLookupColumn>{ property: 'table', label: 'Tabela' }
    };

    public COLUMNS: Array<PoLookupColumn>;
    public FIELD_LABEL: string = 'name';
    public FIELD_VALUE: string = 'name';

    constructor(
        private requestService: RequestService
    ) { 
        this.createColumns();
    }

    private createColumns() {
        this.COLUMNS = [];
        this.columnNames.forEach(column => this.COLUMNS.push(this.columnDefinition[column]));
    }

    public getFilteredData(filter: string, page: number, pageSize: number): Observable<any> {
        return from(this.requestService.searchApplication({q:filter}).then(values => { return { hasNext:false, items: values } }));
    }

    public getObjectByValue(value: string): Observable<any> {
        return from(this.requestService.getApplication(value));
    }
}