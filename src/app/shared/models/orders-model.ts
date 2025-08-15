import { SortDir } from '../shared.model';

export interface IOrderInput {
  cartId: string;
  deliveryMethodId: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
}

export interface IShippingAddress {
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  country: string;
}

export type OrderSortKey = 'createdAt' | 'price';

export type OrderSortSelectOption = {
  key: OrderSortKey;
  dir: SortDir;
  label: {
    en: string;
    ar: string;
  };
};

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending'
  | 'AwaitingPayment'
  | 'PaymentReceived'
  | 'PaymentFailed';

export type PaymentMethod = 'Cash' | 'Online';

export interface IOrderResponse {
  pageSize: number;
  pageNumber: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  results: IOrderResult[];
}

export interface IOrderResult {
  orderId: number;
  orderDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  shippingAddress: IShippingAddress;
  deliveryMethodCost: number;
  items: IOrderItem[];
  subTotal: number;
  total: number;
  isCancellable: boolean;
  checkoutSessionId: string;
}

export interface IOrderItem {
  id: number;
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrderOptions {
  orderId?: number;
  sort?: {
    key: OrderSortKey;
    dir: SortDir;
  };
  pageNumber?: number;
  pageSize?: number;
  filter?: OrderStatus;
}

export interface ILatestOrdersResult {
  count: number;
  latestOrders: IOrderResult[];
}

export interface ICreateOrderResponse {
  success: boolean;
  message: string;
  createdOrderId: number;
}

export interface ICancelOrderResult {
  manageToCancelOrder: boolean;
  manageToExpireSession?: boolean | null;
  cancelMessage?: string | null;
  expireMessage?: string | null;
}
