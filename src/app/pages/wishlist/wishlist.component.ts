import { DynamicNumberPipe } from './../../shared/pipes/dynamic-number.pipe';
import { ConfirmationService } from 'primeng/api';
import { NotfoundResourceComponent } from './../../shared/components/notfound-resource/notfound-resource.component';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ProductCardComponent } from '../product/product-card/product-card.component';
import { RouterLink } from '@angular/router';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { map } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ConfirmationBoxTranslation } from '../../shared/shared.model';

@Component({
  selector: 'app-wishlist',
  imports: [
    ProductCardComponent,
    NotfoundResourceComponent,
    RouterLink,
    TranslatePipe,
    AsyncPipe,
    DynamicNumberPipe,
    PaginationComponent,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly _wishlistService = inject(WishlistService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _appTranslationService = inject(AppTranslationService);

  constructor() {
    // Skipping SSR
    if (isPlatformBrowser(this._platformId)) {
      effect(() => {
        // Executes whenever currLang signal changes.
        const lang = this.currLang();
        this.getUserWishlistItems();
      });
    }
  }

  currLang = this._appTranslationService.currLang;
  locale = this._appTranslationService.locale;
  wishlistItems = this._wishlistService.wishlistItems;
  total = this._wishlistService.total;
  pageNumber = this._wishlistService.pageNumber;
  pageSize = this._wishlistService.pageSize;
  totalPages = this._wishlistService.pages;
  hasNext = this._wishlistService.hasNext;
  hasPrevious = this._wishlistService.hasPrevious;

  confirmationBoxTranslation = signal<ConfirmationBoxTranslation>(
    {} as ConfirmationBoxTranslation,
  );
  notFoundTranslationMessage$ = this._appTranslationService
    .getTranslation('wishlist.notFound')
    .pipe(
      map((res) => {
        return {
          title: res.title as string,
          description: res.description as string,
        };
      }),
    );

  ngOnInit(): void {
    this._getConfirmationBoxTranslation();
  }

  getUserWishlistItems() {
    this._wishlistService
      .getUserWishlistItems({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  onPageChange(pageNumber: number) {
    if (pageNumber === this.pageNumber()) return;
    this.pageNumber.set(pageNumber);
  }
  clearWishlist() {
    const { title, message, confirmBtn, cancelBtn } =
      this.confirmationBoxTranslation();

    this._confirmationService.confirm({
      target: event?.target as EventTarget,
      message: message,
      header: title,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: cancelBtn,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: confirmBtn,
        severity: 'danger',
      },

      accept: () => {
        this._wishlistService
          .clearWishlist()
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe();
      },
    });
  }

  private _getConfirmationBoxTranslation() {
    this._appTranslationService
      .getTranslation('confirmationBox.wishlist')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res) => {
        this.confirmationBoxTranslation.set(res);
      });
  }
}
