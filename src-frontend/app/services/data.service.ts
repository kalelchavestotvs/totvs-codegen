import { Injectable } from '@angular/core';
import { Application } from '../models/application';
import { TableHeader } from '../models/table';
import { v4 as uuidv4 } from 'uuid';
import { TemplateIndex } from '../models/template';
import { RequestService } from './request.service';

@Injectable()
export class DataService {

  constructor(
    private requestService: RequestService
  ) {
    this.myUUID = uuidv4(); // gera um UUID unico para a sessao atual
    this.getTemplates();
  }

  applications: Application[] = [];
  tables: TableHeader[];
  myUUID:string;
  templates: TemplateIndex;

  private getTemplates() {
    this.requestService.getTemplates()
      .then(value => this.templates = value);
  }

}
