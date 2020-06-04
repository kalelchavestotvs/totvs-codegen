export class TemplateHeader {
  id:string;
  description:string;

  parseJsonToObject(data): TemplateHeader {
    Object.assign(this, data);
    return this;
  }
}

export class TemplateIndex {
  type = 'template.index';
  templates: TemplateHeader[];

  parseJsonToObject(data): TemplateIndex {
    Object.assign(this, data);
    this.templates = data.templates?.map(item => new TemplateHeader().parseJsonToObject(item))
    return this;
  }
}
