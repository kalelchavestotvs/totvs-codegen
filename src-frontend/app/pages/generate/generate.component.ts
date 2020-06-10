import { Component, ViewChild } from '@angular/core';
import { PoModalComponent, PoCheckboxGroupOption, PoModalAction, PoNotificationService } from '@po-ui/ng-components';
import { Application } from '../../models/application';
import { DataService } from '../../services/data.service';
import { RequestService } from '../../services/request.service';
import { copyTextToClipboard } from 'ziki-ng-utils';

@Component({
  selector: 'generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {

  @ViewChild('modal', {static:false}) modal: PoModalComponent;

  constructor(
    private dataService: DataService,
    private requestService: RequestService,
    private notificationService: PoNotificationService
  ) { }

  application:Application;
  templateOptions: PoCheckboxGroupOption[] = [];
  selectedValues = [];
  modalPrimaryAction: PoModalAction = { label: 'Executar', action: null };
  modalSecondaryAction: PoModalAction = { label: 'Fechar', action: null };

  execute(application:Application): Promise<any> {
    this.initTemplates();
    this.application = application;

    let _modal = this.modal;
    let _primaryAction = this.modalPrimaryAction;
    let _secondaryAction = this.modalSecondaryAction;
    let _generate = this.generate.bind(this);

    return new Promise(resolve => {
      
      _primaryAction.action = () => { 
        _primaryAction.loading = true;
        _generate().then(ok => {
          if (ok) {
            _modal.close();
            resolve();
          }
        })
        .finally(() => _primaryAction.loading = false);
      }

      _secondaryAction.action = () => { 
        _modal.close();
        resolve();
      }

      _modal.open();
    });
  }

  private initTemplates() {
    if (this.dataService.templates?.templates)
      this.templateOptions = [...this.dataService.templates.templates.map(item => { return <PoCheckboxGroupOption>{ value: item.id, label: item.description } })];
    else
      this.templateOptions = [];
  }

  private generate(): Promise<boolean> {
    let _service = this.requestService;
    let _session = this.dataService.myUUID;
    let _templates = this.selectedValues;
    let _app = this.application;
    let _notificationService = this.notificationService;
    
    return new Promise(resolve =>  {
      _service.generate(_app, _templates, _session)
        .then(value => {
          _notificationService.success({ 
            message: `Aplicação gerada em ${value.outputPath}`,
            actionLabel: 'Copiar',
            action: () => { copyTextToClipboard(value.outputPath) }
          });
          resolve(true);
        })
        .catch(() => resolve(false))
    });
  }

}
