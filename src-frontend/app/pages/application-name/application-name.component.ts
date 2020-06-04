import { Component, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'application-name',
  templateUrl: './application-name.component.html',
  styleUrls: ['./application-name.component.css']
})
export class ApplicationNameComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  value:string;

  query(value?:string): Promise<string> {
    this.value = (value || '');

    let _modal = this.modal;
    let _getValue = this.getValue.bind(this);

    return new Promise(resolve => {
      
      _modal.primaryAction = {
        label: 'Salvar',
        action: () => { 
          _modal.close();
          resolve(_getValue());
        }
      }

      _modal.secondaryAction = {
        label: 'Cancelar',
        action: () => { 
          _modal.close();
          resolve();
        }
      }

      _modal.open();
    });
  }

  private getValue() {
    this.onValueChange();
    return this.value;
  }

  onValueChange() {
    this.value = this.value.toLowerCase().replace(/[^\w\d\-]/g,'').trim();
  }

}
