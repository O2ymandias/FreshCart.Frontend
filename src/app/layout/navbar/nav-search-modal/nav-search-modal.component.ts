import { Component, ElementRef, viewChild } from '@angular/core';
import { NavSearchComponent } from '../nav-search/nav-search.component';

@Component({
  selector: 'app-nav-search-modal',
  imports: [NavSearchComponent],
  templateUrl: './nav-search-modal.component.html',
  styleUrl: './nav-search-modal.component.scss',
})
export class NavSearchModalComponent {
  searchModal =
    viewChild.required<ElementRef<HTMLDialogElement>>('searchModal');

  showModal() {
    this.searchModal().nativeElement.showModal();
  }

  hideModal(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.modal-box')) return;
    this.searchModal().nativeElement.close();
  }
}
