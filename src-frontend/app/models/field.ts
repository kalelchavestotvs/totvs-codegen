export class Field {
  name:string;
  description:string;
  type:string;
  format:string;
  mandatory:boolean;

  parseJsonToObject(data): Field {
    Object.assign(this, data);
    return this;
  }
}
