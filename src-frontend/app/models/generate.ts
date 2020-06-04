export interface Generate {
  session:string;
  application:string;
  templates:string[]
}

export class GenerateResult {
  type = 'generate.result';
  outputPath:string;

  parseJsonToObject(data): GenerateResult {
    Object.assign(this, data);
    return this;
  }
}
