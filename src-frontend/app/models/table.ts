import { Field } from './field';

export class TableHeader {
  name:string;
  description:string;

  parseJsonToObject(data): TableHeader {
    Object.assign(this, data);
    return this;
  }
}

export class Table extends TableHeader {
  type = 'table';
  fields: Field[];
  indexes: Index[];

  parseJsonToObject(data): Table {
    super.parseJsonToObject(data);
    this.fields = data.fields?.map(item => new Field().parseJsonToObject(item));
    this.indexes = data.indexes?.map(item => new Index().parseJsonToObject(item));
    return this;
  }
}

export class TableIndex {
  type = 'table.index';
  tables: TableHeader[];

  parseJsonToObject(data): TableIndex {
    Object.assign(this, data);
    this.tables = data.tables?.map(item => new TableHeader().parseJsonToObject(item))
    return this;
  }
}

export class Index {
  name:string;
  fields:string[];
  primary:boolean;

  parseJsonToObject(data): Index {
    Object.assign(this, data);
    return this;
  }
}