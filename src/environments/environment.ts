export const environment = {
  apiUrl: 'http://localhost:5115/api',
  authUrl: 'http://localhost:5115/api/auth',
};

export const securedApis: { method: string; path: string }[] = [
  { method: 'GET', path: '/ratings/latest' },
  { method: 'POST', path: '/ratings' },
  { method: 'DELETE', path: '/ratings' },
  { method: 'GET', path: 'account/address' },
  { method: 'GET', path: 'account/user-info' },
  { method: 'PUT', path: 'account/basic-info' },
  { method: 'PUT', path: 'account/change-password' },
  { method: 'POST', path: 'account/request-email-change' },
  { method: 'POST', path: 'account/confirm-email-change' },
  { method: 'POST', path: '/orders' },
  { method: 'GET', path: '/orders' },
  { method: 'DELETE', path: '/orders' },
  { method: 'Post', path: '/checkout' },
  { method: 'GET', path: '/wishlist' },
  { method: 'GET', path: '/wishlist/total' },
  { method: 'GET', path: '/wishlist/product-ids' },
  { method: 'POST', path: '/wishlist/add-to-wishlist' },
  { method: 'DELETE', path: '/wishlist/remove-from-wishlist' },
  { method: 'DELETE', path: '/wishlist/clear-wishlist' },
  { method: 'GET', path: '/checkout' },
  { method: 'POST', path: '/checkout' },
];
