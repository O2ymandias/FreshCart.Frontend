import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product/product.component').then(
        (m) => m.ProductComponent,
      ),
    title: 'Products',
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
    title: 'Product Details',
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
  },

  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent,
      ),
    title: 'Cart',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
    title: 'Orders',
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account.component').then(
        (m) => m.AccountComponent,
      ),
    title: 'Account',
    canActivate: [authGuard],
  },
];
