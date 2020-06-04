import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  message = '';
  hidden = true;

  show(message?:string) {
    this.message = (message || '');
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }

}
