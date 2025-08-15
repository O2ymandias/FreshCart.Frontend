export interface ICart {
  id: string;
  items: ICartItem[];
}

export interface ICartItem {
  productId: number;
  productName: string;
  productPictureUrl: string;
  productPrice: number;
  quantity: number;
}
