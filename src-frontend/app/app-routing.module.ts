import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { ApplicationEditComponent } from './pages/application-edit/application-edit.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'application', component: ApplicationEditComponent },
  { path: 'application/:name', component: ApplicationEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
