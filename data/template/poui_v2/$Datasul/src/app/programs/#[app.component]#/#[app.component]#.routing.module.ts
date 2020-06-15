import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { #[app.component,PascalCase]#ListComponent } from './list/#[app.component]#-list.component';
import { #[app.component,PascalCase]#EditComponent } from './edit/#[app.component]#-edit.component';
import { #[app.component,PascalCase]#DetailComponent } from './detail/#[app.component]#-detail.component';

const routes: Routes = [
    { path: '', component: #[app.component,PascalCase]#ListComponent },
    { path: 'new', component: #[app.component,PascalCase]#EditComponent },
    { path: 'edit@[app.fields,isPrimary]@/:#[name]#@[end]@', component: #[app.component,PascalCase]#EditComponent },
    { path: '@[app.fields,isPrimary]@?[!isFirst]?/?[end]?:#[name]#@[end]@', component: #[app.component,PascalCase]#DetailComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class #[app.component,PascalCase]#RoutingModule {}
