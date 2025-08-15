export interface RatingResult {
  pageSize: number;
  pageNumber: number;
  total: number;
  average: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: IRatingItem[];
}

export interface IRatingItem {
  id: number;
  stars: number;
  title?: string;
  comment?: string;
  createdAt: string;
  product: IRatedProduct;
  user: IRatingUser;
}

export interface IRatingUser {
  id: string;
  displayName: string;
  pictureUrl: string | null;
}
export interface IRatedProduct {
  id: number;
  name: string;
  pictureUrl: string;
}

export interface IRatingInput {
  stars: number;
  title?: string;
  comment?: string;
  productId: number;
}

export interface IPaginationOptions {
  pageSize: number;
  pageNumber: number;
}
export interface IRatingOptions {
  productId?: number;
  userId?: string;
  pagination: IPaginationOptions;
}

export interface IAverageRatingResult {
  totalRatings: number;
  averageRating: number;
}

export interface ILatestRatingsResult {
  count: number;
  latestRatings: IRatingItem[];
}
