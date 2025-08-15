import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  imports: [TranslatePipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  private readonly _platformId = inject(PLATFORM_ID);
  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      effect(() => {
        const modalElement = this.modal().nativeElement;
        this.visible() ? modalElement.showModal() : modalElement.close();
      });
    }
  }

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  title = input.required<string>();
  visible = input<boolean>(false);
  visibleChange = output<boolean>();
  closeOnBackdropClick = input<boolean>(false);

  close() {
    this.visibleChange.emit(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.visible()) this.close();
  }

  onBackdropClick(event: MouseEvent) {
    if (
      event.target === this.modal().nativeElement &&
      this.closeOnBackdropClick()
    )
      this.close();
  }
}
