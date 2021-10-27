
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './../environments/environment';
import { #[app.component,PascalCase]#Module } from '../app/programs/#[app.component]#/#[app.component]#.module';
if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(#[app.component,PascalCase]#Module)
.catch(err => console.log(err));
