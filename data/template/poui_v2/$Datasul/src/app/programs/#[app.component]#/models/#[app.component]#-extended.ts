import { #[app.component,PascalCase]# } from './#[app.component]#';
@[app.zooms]@
import { #[component,PascalCase]# } from './#[component]#';
@[end]@

export class #[app.component,PascalCase]#Extended extends #[app.component,PascalCase]# {

    $actions:string[];
@[app.fields,!zoomComponent=]@
    $#[name]#Description: string = 'Carregando...';
@[end]@@[app.fields,!enumComponent=]@

    $#[name]#Description: string = '';
@[end]@

    parseJsonToObject(jsonData): #[app.component,PascalCase]#Extended {
      @[app.fields,!zoomComponent=]@

        if (jsonData instanceof #[zoom.component,PascalCase]#) {
          this.$#[name]#Description = `${jsonData.#[zoom.keyField]#} - ${jsonData.#[zoom.labelField]#}`;
          return;
        }
      @[end]@
        super.parseJsonToObject(jsonData);
        return this;
    }
}
