import { isNullOrUndefined } from 'util';
import { #[app.component,PascalCase]# } from './#[app.component]#';
@[app.zooms]@
import { #[component,PascalCase]# } from './#[component]#';
@[end]@

export class #[app.component,PascalCase]#Extended extends #[app.component,PascalCase]# {

    $actions:string[];
 
@[app.fields,!zoomComponent=]@
    $#[name]#:#[zoom.component,PascalCase]#;
@[end]@
@[app.fields,!enumComponent=]@
    $#[name]#Description: string = '';
@[end]@
    
@[app.fields,!zoomComponent=]@
    get $#[name]#Description() {
        if (isNullOrUndefined(this.$#[name]#))
            return '';
        return `${this.$#[name]#} - ${this.$#[name]#.#[zoom.labelField]#}`;
    }

@[end]@
    parseJsonToObject(jsonData): #[app.component,PascalCase]#Extended {
        super.parseJsonToObject(jsonData);
        return this;
    }
    
}
