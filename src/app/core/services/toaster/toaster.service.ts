import { ToasterMessage } from './../../../shared/shared.model';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private readonly _messageService = inject(MessageService);

  success(message: ToasterMessage) {
    const { summary, detail } = message;
    this._messageService.add({
      severity: 'success',
      key: 'br',
      summary,
      detail,
      life: 3000,
    });
  }

  warn(message: ToasterMessage) {
    const { summary, detail } = message;
    this._messageService.add({
      severity: 'warn',
      key: 'br',
      summary,
      detail,
      life: 3000,
    });
  }

  error(message: ToasterMessage) {
    const { summary, detail } = message;
    this._messageService.add({
      severity: 'error',
      key: 'br',
      summary,
      detail,
      life: 3000,
    });
  }

  info(message: ToasterMessage) {
    const { summary, detail } = message;
    this._messageService.add({
      severity: 'info',
      key: 'br',
      summary,
      detail,
      life: 3000,
    });
  }
}
