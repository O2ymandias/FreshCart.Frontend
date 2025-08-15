import { SupportedLanguages } from '../../core/services/translation/app-translation.model';
import { SortDir } from '../shared.model';

export interface IProductOptions {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  brandId?: number;
  categoryId?: number;
  sortKey?: ProductSortKey;
  sortDir?: SortDir;
  minPrice?: number;
  maxPrice?: number;
  lang?: SupportedLanguages;
}

export type ProductSortKey = 'name' | 'price';

export interface IProductResponse {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: IProduct[];
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
}

export interface IBrand {
  name: string;
  id: number;
  pictureUrl?: string;
}

export interface ICategory {
  name: string;
  id: number;
  pictureUrl?: string;
}

export type ProductGalleryResponse = IProductGallery[];

export interface IProductGallery {
  pictureUrl: string;
  altText: string;
}

export type ProductSortSelectOption = {
  key: ProductSortKey;
  dir: SortDir;
  label: {
    en: string;
    ar: string;
  };
};
