import { IProduct } from './product.model';

export interface IWishlistResult {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: IWishlistItem[];
}

export interface IWishlistItem {
  product: IProduct;
  createdAt: Date;
}
